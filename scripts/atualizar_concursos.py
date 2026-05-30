#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Robo de manutencao do feed de concursos (executado pelo GitHub Actions agendado).

DESENHO HIBRIDO:
  1. Querido Diario (Open Knowledge Brasil) - API publica de diarios oficiais
     MUNICIPAIS. Usada para detectar concursos no ambito LOCAL/municipal (ISS,
     prefeituras) das cidades cearenses configuradas. Doc: https://docs.queridodiario.ok.org.br
  2. Curadoria manual - os itens fixos do concursos.json (SEFAZ estaduais e
     federais), mantidos a mao, pois nao ha API limpa unificada para essas esferas.
  3. RSS do Diario do CE - leitor generico/configuravel. Desativado por padrao
     porque o DOE-CE estadual nao publica um RSS oficial de concursos. Quando
     houver uma URL de feed confiavel, basta preenche-la em RSS_CE_URL.

Alem disso, a cada execucao o robo:
  - expira automaticamente concursos com prazo de inscricao vencido;
  - carimba "ultimaVerificacao" e (se mudou) "atualizadoEm";
  - limita os itens auto-detectados (qd:/rss:) aos mais recentes, preservando
    integralmente a curadoria manual.
"""
import json, os, sys, urllib.parse, urllib.request
from datetime import date, datetime, timedelta
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARQ = os.path.join(ROOT, "concursos.json")

# --- Configuracao das fontes ---------------------------------------------
# 1) Querido Diario: cidades do Ceara (codigos IBGE) a monitorar
QD_API = "https://api.queridodiario.ok.org.br/gazettes"
QD_TERRITORIOS = ["2304400"]          # Fortaleza-CE (capital). Extensivel.
QD_PALAVRAS = "concurso"              # busca ampla; filtra-se o fiscal no excerto
QD_TERMOS_FISCAIS = ("fiscal", "auditor", "tribut", "sefaz", "fazend")
QD_JANELA_DIAS = 45                   # busca publicacoes dos ultimos 45 dias
QD_MAX = 20

# 3) RSS do Diario do CE: sem feed oficial confirmado -> desativado por padrao.
RSS_CE_URL = ""   # preencha com uma URL de RSS confiavel para ativar

MAX_AUTO = 15     # teto de itens auto-detectados mantidos no feed


def parse_data_br(s):
    """Converte 'dd/mm/aaaa' em date; aceita intervalo 'd1 a d2' (usa d2)."""
    if not s:
        return None
    s = s.strip()
    if " a " in s:
        s = s.split(" a ")[-1].strip()
    for fmt in ("%d/%m/%Y", "%d/%m/%y"):
        try:
            return datetime.strptime(s, fmt).date()
        except ValueError:
            continue
    return None


def _http_get_json(url, timeout=25):
    req = urllib.request.Request(url, headers={"User-Agent": "sefaz-ce-estudos/1.0"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def coletar_querido_diario(diag):
    """Item 1: consulta a API do Querido Diario para cada cidade configurada."""
    achados = []
    desde = (date.today() - timedelta(days=QD_JANELA_DIAS)).isoformat()
    total_bruto = 0
    for terr in QD_TERRITORIOS:
        params = urllib.parse.urlencode({
            "territory_ids": terr,
            "querystring": QD_PALAVRAS,
            "published_since": desde,
            "excerpt_size": 240,
            "number_of_excerpts": 1,
            "size": QD_MAX,
        })
        url = QD_API + "?" + params
        try:
            data = _http_get_json(url)
        except Exception as e:
            diag["erro"] = f"QD {terr}: {e}"
            print(f"[QD] falha ao consultar {terr}: {e}", file=sys.stderr)
            continue
        gazettes = data.get("gazettes") or []
        total_bruto += len(gazettes)
        for g in gazettes:
            exc = (g.get("highlight_texts") or [""])[0]
            exc = " ".join(exc.split())
            low = exc.lower()
            # mantem apenas publicacoes que mencionem termos fiscais
            if not any(t in low for t in QD_TERMOS_FISCAIS):
                continue
            achados.append({
                "id": "qd:" + str(g.get("territory_id")) + ":" + str(g.get("date")),
                "orgao": "Diario Oficial - " + str(g.get("territory_name", "")) + "/" + str(g.get("state_code", "")),
                "cargo": "Mencao a concurso fiscal detectada no diario oficial",
                "area": "fiscal",
                "banca": "a definir",
                "vagas": "verificar no diario",
                "status": "detectado",
                "uf": str(g.get("state_code", "")),
                "data": str(g.get("date", "")),
                "fonte": g.get("url", ""),
                "obs": (exc[:200] + " [...]") if exc else "Publicacao detectada via Querido Diario.",
            })
    diag["qd_bruto"] = total_bruto
    diag["qd_fiscais"] = len(achados)
    return achados


def coletar_rss_ce():
    """Item 3: leitor de RSS do Diario do CE (desativado ate ter URL confiavel)."""
    if not RSS_CE_URL:
        return []
    achados = []
    try:
        req = urllib.request.Request(RSS_CE_URL, headers={"User-Agent": "sefaz-ce-estudos/1.0"})
        with urllib.request.urlopen(req, timeout=25) as r:
            raiz = ET.fromstring(r.read())
        for item in raiz.iter("item"):
            titulo = (item.findtext("title") or "").strip()
            link = (item.findtext("link") or "").strip()
            if not titulo:
                continue
            low = titulo.lower()
            if "concurso" not in low and "edital" not in low:
                continue
            achados.append({
                "id": "rss:ce:" + str(abs(hash(link or titulo)) % (10**10)),
                "orgao": "Diario Oficial do Estado - CE",
                "cargo": titulo[:120],
                "area": "fiscal",
                "banca": "a definir",
                "vagas": "verificar no diario",
                "status": "detectado",
                "uf": "CE",
                "fonte": link,
                "obs": "Publicacao detectada via RSS do DOE-CE.",
            })
    except Exception as e:
        print(f"[RSS-CE] falha: {e}", file=sys.stderr)
    return achados


def coletar_de_fontes(diag):
    """Agrega as fontes automaticas (itens 1 e 3)."""
    return coletar_querido_diario(diag) + coletar_rss_ce()


def main():
    if not os.path.exists(ARQ):
        print("concursos.json nao encontrado", file=sys.stderr)
        sys.exit(1)
    with open(ARQ, "r", encoding="utf-8") as f:
        data = json.load(f)

    hoje = date.today()
    concursos = data.get("concursos", [])
    mudou = False

    # expira prazos vencidos
    for c in concursos:
        prazo = parse_data_br(c.get("inscricoes"))
        if prazo and hoje > prazo and c.get("status") != "encerrado":
            c["status"] = "encerrado"; mudou = True
            print(f"[expirado] {c.get('id')}")

    # mescla fontes automaticas
    diag = {"ultimaColeta": hoje.isoformat(), "qd_bruto": 0, "qd_fiscais": 0, "erro": None}
    novos = coletar_de_fontes(diag)
    existentes = {c.get("id") for c in concursos}
    for n in novos:
        if n.get("id") and n["id"] not in existentes:
            concursos.append(n); existentes.add(n["id"]); mudou = True
            print(f"[novo] {n.get('id')}")

    # limita itens auto-detectados aos mais recentes (preserva curadoria manual)
    auto = [c for c in concursos if str(c.get("id", "")).startswith(("qd:", "rss:"))]
    manuais = [c for c in concursos if not str(c.get("id", "")).startswith(("qd:", "rss:"))]
    auto.sort(key=lambda c: c.get("data", ""), reverse=True)
    concursos = manuais + auto[:MAX_AUTO]

    data["concursos"] = concursos
    data["ultimaVerificacao"] = hoje.isoformat()
    data["diagnostico"] = diag
    if mudou:
        data["atualizadoEm"] = hoje.isoformat()

    with open(ARQ, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2); f.write("\n")
    print("MUDOU=1" if mudou else "MUDOU=0")


if __name__ == "__main__":
    main()
