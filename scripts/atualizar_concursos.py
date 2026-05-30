#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Robo de monitoramento de concursos (GitHub Actions agendado).

ARQUITETURA: motor modular e tolerante a falhas. Cada fonte e tentada de forma
independente (try/except), falha sozinha sem derrubar as demais, e reporta no
bloco "diagnostico" do concursos.json se funcionou (ok/hits/erro).

FONTES (filtradas pelas PALAVRAS-CHAVE da area fiscal):
  - OFICIAIS: DOU (Imprensa Nacional), DOE-CE, DOM (via Querido Diario).
  - BANCAS: FCC, CEBRASPE, FGV, VUNESP, IDECAN.
  - CURSOS: Gran, Estrategia, Qconcursos, Tec Concursos (best-effort; muitos sao
    SPAs/anti-bot e podem nao responder a HTTP simples - o diagnostico revela).
  - BUSCA: Google via Custom Search JSON API OFICIAL (desativado ate ter chave;
    NUNCA raspamos o google.com/search, que viola os termos de uso).

A curadoria manual (itens sem prefixo de fonte automatica) e sempre preservada.
"""
import json, os, re, sys, html, urllib.parse, urllib.request, hashlib
from datetime import date, datetime, timedelta
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARQ = os.path.join(ROOT, "concursos.json")

# Palavras-chave da area fiscal (case-insensitive)
PALAVRAS = ["sefaz", "auditor", "analista", "fiscal", "iss"]
# Termos que reforcam contexto de concurso (reduz ruido)
CTX = ["concurso", "edital", "inscri", "seleç", "selec", "prova"]

MAX_POR_FONTE = 5     # candidatos por fonte
MAX_AUTO = 30         # teto de itens auto-detectados no feed
TIMEOUT = 25
UA = "Mozilla/5.0 (compatible; sefaz-ce-estudos/1.0; monitoramento de concursos)"

# Querido Diario (DOM municipal)
QD_API = "https://api.queridodiario.ok.org.br/gazettes"
QD_TERRITORIOS = ["2304400"]   # Fortaleza-CE (extensivel)
QD_JANELA_DIAS = 45

# Paginas de listagem por fonte (best-effort)
FONTES_HTML = [
    # (nome, tipo, url)
    ("DOU",        "oficial", "https://www.in.gov.br/consulta/-/buscar/dou?q=sefaz+auditor+fiscal&s=do1"),
    ("DOE-CE",     "oficial", "https://www.ceara.gov.br/diario-oficial/"),
    ("FCC",        "banca",   "https://www.concursosfcc.com.br/index.html"),
    ("CEBRASPE",   "banca",   "https://www.cebraspe.org.br/concursos/"),
    ("FGV",        "banca",   "https://conhecimento.fgv.br/concursos"),
    ("VUNESP",     "banca",   "https://www.vunesp.com.br/"),
    ("IDECAN",     "banca",   "https://www.idecan.org.br/concursos"),
    ("Gran",       "curso",   "https://www.grancursosonline.com.br/concursos"),
    ("Estrategia", "curso",   "https://www.estrategiaconcursos.com.br/concursos/"),
    ("Qconcursos", "curso",   "https://www.qconcursos.com/concursos"),
    ("TecConcursos","curso",  "https://www.tecconcursos.com.br/concursos"),
]


def _get(url, timeout=TIMEOUT):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "pt-BR,pt"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        raw = r.read()
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("latin-1", errors="ignore")


def _get_json(url, timeout=TIMEOUT):
    return json.loads(_get(url, timeout))


def _tem_kw(texto):
    t = texto.lower()
    return any(p in t for p in PALAVRAS)


def _slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def _id(nome, chave):
    h = hashlib.sha1(chave.encode("utf-8")).hexdigest()[:10]
    return "src:" + _slug(nome) + ":" + h


def coletar_html(nome, tipo, url, diag):
    """Scanner generico: baixa a pagina, extrai links com palavra-chave fiscal."""
    info = {"ok": False, "hits": 0, "erro": None}
    achados = []
    try:
        pagina = _get(url)
    except Exception as e:
        info["erro"] = str(e)[:120]
        diag[nome] = info
        return achados
    info["ok"] = True
    # extrai ancoras <a href=...>texto</a>
    for m in re.finditer(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', pagina, re.I | re.S):
        href, txt = m.group(1), m.group(2)
        txt = html.unescape(re.sub(r"<[^>]+>", "", txt)).strip()
        txt = re.sub(r"\s+", " ", txt)
        if len(txt) < 8:
            continue
        low = txt.lower()
        if not _tem_kw(txt):
            continue
        if not any(c in low for c in CTX):
            continue
        link = urllib.parse.urljoin(url, href)
        achados.append({
            "id": _id(nome, link + "|" + txt),
            "orgao": nome + " (" + tipo + ")",
            "cargo": txt[:140],
            "area": "fiscal",
            "banca": nome if tipo == "banca" else "a definir",
            "vagas": "verificar na fonte",
            "status": "detectado",
            "uf": "",
            "data": date.today().isoformat(),
            "fonte": link,
            "obs": "Detectado em " + nome + " — confira o edital na fonte.",
        })
        if len(achados) >= MAX_POR_FONTE:
            break
    info["hits"] = len(achados)
    diag[nome] = info
    return achados


def coletar_querido_diario(diag):
    """DOM municipal via API publica do Querido Diario."""
    info = {"ok": False, "hits": 0, "bruto": 0, "erro": None}
    achados = []
    desde = (date.today() - timedelta(days=QD_JANELA_DIAS)).isoformat()
    for terr in QD_TERRITORIOS:
        params = urllib.parse.urlencode({
            "territory_ids": terr, "querystring": "concurso",
            "published_since": desde, "excerpt_size": 240,
            "number_of_excerpts": 1, "size": 20,
        })
        try:
            data = _get_json(QD_API + "?" + params)
            info["ok"] = True
        except Exception as e:
            info["erro"] = str(e)[:120]
            continue
        gz = data.get("gazettes") or []
        info["bruto"] += len(gz)
        for g in gz:
            exc = " ".join((g.get("highlight_texts") or [""])[0].split())
            if not _tem_kw(exc):
                continue
            achados.append({
                "id": "qd:" + str(g.get("territory_id")) + ":" + str(g.get("date")),
                "orgao": "DOM " + str(g.get("territory_name", "")) + "/" + str(g.get("state_code", "")),
                "cargo": "Mencao fiscal detectada no diario oficial municipal",
                "area": "fiscal", "banca": "a definir", "vagas": "verificar no diario",
                "status": "detectado", "uf": str(g.get("state_code", "")),
                "data": str(g.get("date", "")), "fonte": g.get("url", ""),
                "obs": (exc[:200] + " [...]") if exc else "Detectado via Querido Diario.",
            })
    info["hits"] = len(achados)
    diag["QD-DOM"] = info
    return achados


def coletar_google(diag):
    """Busca via Google Custom Search JSON API OFICIAL (requer chave). Sem chave, pula."""
    api_key = os.environ.get("GOOGLE_API_KEY")
    cx = os.environ.get("GOOGLE_CX")
    if not api_key or not cx:
        diag["Google"] = {"ok": False, "hits": 0, "erro": "sem GOOGLE_API_KEY/GOOGLE_CX (desativado)"}
        return []
    info = {"ok": False, "hits": 0, "erro": None}
    achados = []
    vistos = set()
    ano = date.today().year
    consultas = [
        f"concurso SEFAZ auditor fiscal edital {ano}",
        f"concurso auditor fiscal estadual edital inscricoes {ano}",
        f"concurso ISS auditor fiscal municipal edital {ano}",
        f"concurso analista SEFAZ tributos edital {ano}",
    ]
    for q in consultas:
        url = "https://www.googleapis.com/customsearch/v1?" + urllib.parse.urlencode({
            "key": api_key, "cx": cx, "q": q, "num": 10, "dateRestrict": "m1", "lr": "lang_pt"})
        try:
            data = _get_json(url)
            info["ok"] = True
        except Exception as e:
            info["erro"] = str(e)[:120]
            continue
        for it in (data.get("items") or []):
            link = it.get("link", "")
            titulo = it.get("title", "")
            if link in vistos:
                continue
            if not _tem_kw(titulo + " " + it.get("snippet", "")):
                continue
            vistos.add(link)
            achados.append({
                "id": _id("google", link or titulo),
                "orgao": "Google (busca)", "cargo": titulo[:140], "area": "fiscal",
                "banca": "a definir", "vagas": "verificar na fonte", "status": "detectado",
                "uf": "", "data": date.today().isoformat(), "fonte": link,
                "obs": (it.get("snippet", "")[:180] + " [...]"),
            })
            if len(achados) >= 8:
                break
        if len(achados) >= 8:
            break
    info["hits"] = len(achados)
    diag["Google"] = info
    return achados


def coletar_de_fontes(diag):
    todos = []
    todos += coletar_querido_diario(diag)
    for nome, tipo, url in FONTES_HTML:
        todos += coletar_html(nome, tipo, url, diag)
    todos += coletar_google(diag)
    return todos


def parse_data_br(s):
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


def main():
    if not os.path.exists(ARQ):
        print("concursos.json nao encontrado", file=sys.stderr); sys.exit(1)
    with open(ARQ, "r", encoding="utf-8") as f:
        data = json.load(f)
    hoje = date.today()
    concursos = data.get("concursos", [])
    mudou = False

    for c in concursos:
        prazo = parse_data_br(c.get("inscricoes"))
        if prazo and hoje > prazo and c.get("status") != "encerrado":
            c["status"] = "encerrado"; mudou = True; print(f"[expirado] {c.get('id')}")

    fontes_diag = {}
    novos = coletar_de_fontes(fontes_diag)
    existentes = {c.get("id") for c in concursos}
    for n in novos:
        if n.get("id") and n["id"] not in existentes:
            concursos.append(n); existentes.add(n["id"]); mudou = True
            print(f"[novo] {n.get('id')} | {n.get('orgao')}")

    pref = ("qd:", "src:")
    auto = [c for c in concursos if str(c.get("id", "")).startswith(pref)]
    manuais = [c for c in concursos if not str(c.get("id", "")).startswith(pref)]
    auto.sort(key=lambda c: c.get("data", ""), reverse=True)
    concursos = manuais + auto[:MAX_AUTO]

    total_hits = sum(v.get("hits", 0) for v in fontes_diag.values())
    data["concursos"] = concursos
    data["ultimaVerificacao"] = hoje.isoformat()
    data["diagnostico"] = {"ultimaColeta": hoje.isoformat(), "totalDetectado": total_hits, "fontes": fontes_diag}
    if mudou:
        data["atualizadoEm"] = hoje.isoformat()

    with open(ARQ, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2); f.write("\n")
    print("MUDOU=1" if mudou else "MUDOU=0", "| hits:", total_hits)


if __name__ == "__main__":
    main()
