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
import json, os, re, sys, html, urllib.parse, urllib.request, urllib.error, hashlib
from datetime import date, datetime, timedelta
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARQ = os.path.join(ROOT, "concursos.json")

# Palavras-chave da area fiscal (case-insensitive) - usadas como base/contexto
PALAVRAS = ["sefaz", "auditor", "analista", "fiscal", "iss"]
# Termos que reforcam contexto de concurso (reduz ruido)
CTX = ["concurso", "edital", "inscri", "seleç", "selec", "prova"]

# Areas espelhando o ConfigConcursos do app: id -> {query, termos para classificar}
# O robo busca por TODAS as areas para alimentar o feed; o app (sino) filtra
# depois pela area que o usuario escolheu em Configuracoes.
AREAS = {
    "fiscal":        {"q": "auditor fiscal tributacao receita sefaz", "kw": ["sefaz","auditor fiscal","tribut","iss","fazend","receita estadual"]},
    "tribunais":     {"q": "concurso tribunal analista tecnico judiciario TJ TRT TRF", "kw": ["tribunal","judiciario","tj ","trt","trf","tre "]},
    "controle":      {"q": "concurso tribunal de contas auditor controle TCU TCE", "kw": ["tribunal de contas","tcu","tce","controle externo","cgu"]},
    "bancos":        {"q": "concurso banco do brasil caixa BNB escriturario", "kw": ["banco do brasil","caixa","escriturario","bnb","banco central"]},
    "policial":      {"q": "concurso policia civil militar penal delegado", "kw": ["policia","delegado","penal","policial","perito","bombeiro"]},
    "magistratura":  {"q": "concurso magistratura juiz tribunal de justica", "kw": ["magistratura","juiz","juiza","desembargador"]},
    "saude":         {"q": "concurso saude enfermeiro medico tecnico enfermagem", "kw": ["enfermeir","medico","saude","hospital","tecnico de enfermagem"]},
    "conselhos":     {"q": "concurso conselho regional CRM CRC CREA OAB", "kw": ["conselho regional","crm","crc","crea","coren","conselho federal"]},
    "agencias":      {"q": "concurso agencia reguladora ANS ANEEL ANATEL ANVISA", "kw": ["agencia reguladora","ans","aneel","anatel","anvisa","ana ","antt"]},
    "legislativo":   {"q": "concurso camara assembleia legislativa senado analista", "kw": ["camara","assembleia","legislativ","senado","camara dos deputados"]},
    "administrativa":{"q": "concurso analista administrativo tecnico ministerio", "kw": ["administrativ","tecnico administrativo","ministerio","prefeitura"]},
}
# Areas que o robo varre por padrao. As personalizadas do usuario (sufixo extras)
# sao tratadas no cliente, que filtra por palavras-chave proprias.
AREAS_ROBO = ["fiscal", "tribunais", "controle", "bancos", "policial",
              "magistratura", "saude", "conselhos", "agencias", "legislativo", "administrativa"]

MAX_POR_FONTE = 5     # candidatos por fonte
MAX_AUTO = 40         # teto de itens auto-detectados no feed
TIMEOUT = 25
UA = "Mozilla/5.0 (compatible; sefaz-ce-estudos/1.0; monitoramento de concursos)"

def classificar_area(texto):
    """Classifica um achado em uma area pelo texto; default 'fiscal'."""
    t = (texto or "").lower()
    for aid, cfg in AREAS.items():
        if any(k in t for k in cfg["kw"]):
            return aid
    return "fiscal"

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
        except urllib.error.HTTPError as e:
            try:
                corpo = e.read().decode("utf-8", errors="ignore")
                err = json.loads(corpo).get("error", {})
                msg = err.get("message", "")
                reason = ""
                errs = err.get("errors") or []
                if errs:
                    reason = errs[0].get("reason", "")
                info["erro"] = f"HTTP {e.code}: {reason or ''} {msg}"[:250]
            except Exception:
                info["erro"] = f"HTTP {e.code}"
            continue
        except Exception as e:
            info["erro"] = str(e)[:160]
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


def coletar_tavily(diag):
    """Busca via Tavily Search API por TODAS as areas em AREAS_ROBO. Cada achado e
    etiquetado com sua area (o app filtra depois pela config do usuario). Sem chave, pula."""
    api_key = os.environ.get("TAVILY_API_KEY")
    if not api_key:
        diag["Tavily"] = {"ok": False, "hits": 0, "erro": "sem TAVILY_API_KEY (desativado)"}
        return []
    info = {"ok": False, "hits": 0, "erro": None, "porArea": {}}
    achados = []
    vistos = set()
    ano = date.today().year
    for aid in AREAS_ROBO:
        termo = AREAS.get(aid, {}).get("q", "")
        q = f"concurso {termo} edital inscricoes {ano}"
        payload = json.dumps({
            "api_key": api_key, "query": q, "search_depth": "basic",
            "max_results": 6, "topic": "general",
        }).encode("utf-8")
        try:
            req = urllib.request.Request("https://api.tavily.com/search", data=payload,
                headers={"Content-Type": "application/json", "User-Agent": UA})
            with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
                data = json.loads(r.read().decode("utf-8"))
            info["ok"] = True
        except urllib.error.HTTPError as e:
            try:
                corpo = e.read().decode("utf-8", errors="ignore")[:160]
            except Exception:
                corpo = ""
            info["erro"] = f"HTTP {e.code}: {corpo}"[:200]
            continue
        except Exception as e:
            info["erro"] = str(e)[:160]
            continue
        n_area = 0
        for it in (data.get("results") or []):
            link = it.get("url", "")
            titulo = it.get("title", "")
            conteudo = it.get("content", "")
            if link in vistos:
                continue
            if not any(c in (titulo + " " + conteudo).lower() for c in CTX):
                continue
            vistos.add(link)
            area_item = classificar_area(titulo + " " + conteudo)
            achados.append({
                "id": _id("tavily", link or titulo),
                "orgao": "Busca web (Tavily)", "cargo": titulo[:140], "area": area_item,
                "banca": "a definir", "vagas": "verificar na fonte", "status": "detectado",
                "uf": "", "data": date.today().isoformat(), "fonte": link,
                "obs": (conteudo[:180] + " [...]") if conteudo else "Detectado via busca web.",
            })
            n_area += 1
            if n_area >= 5:
                break
        info["porArea"][aid] = n_area
    info["hits"] = len(achados)
    diag["Tavily"] = info
    return achados


def coletar_de_fontes(diag):
    todos = []
    todos += coletar_querido_diario(diag)
    for nome, tipo, url in FONTES_HTML:
        todos += coletar_html(nome, tipo, url, diag)
    todos += coletar_google(diag)
    todos += coletar_tavily(diag)
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
