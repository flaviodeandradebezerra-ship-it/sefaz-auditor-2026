#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Robo de manutencao do feed de concursos (executado pelo GitHub Actions agendado).

O que ele faz HOJE, de forma automatica e confiavel:
  1. Carrega o concursos.json atual.
  2. Expira automaticamente os concursos cujo prazo de inscricao ja passou
     (status -> "encerrado"), comparando com a data de execucao.
  3. Atualiza os carimbos "atualizadoEm" e "ultimaVerificacao".
  4. Grava o arquivo de volta (o workflow faz commit + redeploy se houver mudanca).

PONTO DE EXTENSAO (monitoramento externo real):
  A funcao coletar_de_fontes() e o lugar para plugar uma fonte de dados real
  (API publica, RSS de Diario Oficial, etc.). Hoje retorna [] de proposito,
  para nao depender de scraping fragil/instavel. Ao conectar uma fonte aqui,
  os novos itens sao mesclados ao feed por id, sem perder a curadoria manual.
"""
import json, os, sys
from datetime import date, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARQ = os.path.join(ROOT, "concursos.json")


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


def coletar_de_fontes():
    """Ponto de extensao para uma fonte de dados real (API/RSS). Veja docstring."""
    # Exemplo de como seria a mesclagem (desativado por padrao):
    # itens = chamar_api_publica()
    # return [normalizar(i) for i in itens]
    return []


def main():
    if not os.path.exists(ARQ):
        print("concursos.json nao encontrado", file=sys.stderr)
        sys.exit(1)

    with open(ARQ, "r", encoding="utf-8") as f:
        data = json.load(f)

    hoje = date.today()
    concursos = data.get("concursos", [])
    mudou = False

    # 1) expirar prazos vencidos automaticamente
    for c in concursos:
        prazo = parse_data_br(c.get("inscricoes"))
        if prazo and hoje > prazo and c.get("status") != "encerrado":
            c["status"] = "encerrado"
            mudou = True
            print(f"[expirado] {c.get('id')} (prazo {c.get('inscricoes')})")

    # 2) mesclar itens de fontes externas (se houver; hoje vazio)
    novos = coletar_de_fontes()
    if novos:
        existentes = {c.get("id") for c in concursos}
        for n in novos:
            if n.get("id") and n["id"] not in existentes:
                concursos.append(n)
                existentes.add(n["id"])
                mudou = True
                print(f"[novo] {n.get('id')}")

    # 3) carimbos de verificacao
    data["concursos"] = concursos
    data["ultimaVerificacao"] = hoje.isoformat()
    if mudou:
        data["atualizadoEm"] = hoje.isoformat()

    with open(ARQ, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    # sinaliza ao workflow se houve mudanca de conteudo (alem do carimbo)
    print("MUDOU=1" if mudou else "MUDOU=0")


if __name__ == "__main__":
    main()
