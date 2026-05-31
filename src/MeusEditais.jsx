import { useState, useEffect } from "react";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035",
  border:"#1b2c44", gold:"#c8a951", goldL:"#f0d080",
  red:"#ef4444", green:"#22c55e", blue:"#3b82f6",
  purple:"#a855f7", text:"#e2e8f0", muted:"#64748b",
};

const KEY = "sefaz_meus_editais_v1";

// ---- Persistencia (localStorage) ----
function carregar() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function salvar(lista) {
  try { localStorage.setItem(KEY, JSON.stringify(lista)); } catch (e) {}
}

// ---- Extracao de texto de PDF (pdf.js via CDN, no navegador) ----
async function extrairTextoPDF(file) {
  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  }
  const buf = await file.arrayBuffer();
  const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
  let texto = "";
  const maxPag = Math.min(pdf.numPages, 60);
  for (let i = 1; i <= maxPag; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    texto += content.items.map(it => it.str).join(" ") + "\n";
  }
  return texto;
}

// ---- Analise heuristica do edital ----
const BANCAS_KW = [
  ["CEBRASPE","Cebraspe/CESPE"],["CESPE","Cebraspe/CESPE"],["FCC","FCC"],
  ["FGV","FGV"],["VUNESP","Vunesp"],["IDECAN","IDECAN"],["IBFC","IBFC"],
  ["QUADRIX","Quadrix"],["AOCP","AOCP"],["CESGRANRIO","Cesgranrio"],["IADES","IADES"],
];

function detectarBanca(t) {
  const up = t.toUpperCase();
  for (const [kw, nome] of BANCAS_KW) {
    if (up.includes(kw)) return nome;
  }
  return "Nao identificada";
}

function temDiscursiva(t) {
  const up = t.toUpperCase();
  return /PROVA DISCURSIVA|REDA[CÇ][AÃ]O|DISSERTATIV|PE[CÇ]A PROFISSIONAL|ESTUDO DE CASO/.test(up);
}

// Detecta disciplinas e topicos do conteudo programatico
function analisarConteudo(texto) {
  const t = texto.replace(/\r/g, " ").replace(/\u00a0/g, " ");
  // Disciplinas ordenadas: as MAIS especificas primeiro (evita "Portugues" engolir "Lingua Portuguesa")
  const discKW = [
    "LINGUA PORTUGUESA","REDACAO OFICIAL","RACIOCINIO LOGICO","RACIOCINIO LOGICO-MATEMATICO",
    "NOCOES DE INFORMATICA","TECNOLOGIA DA INFORMACAO","MATEMATICA FINANCEIRA","MATEMATICA",
    "ESTATISTICA","DIREITO CONSTITUCIONAL","DIREITO ADMINISTRATIVO","DIREITO TRIBUTARIO",
    "DIREITO CIVIL","DIREITO PENAL","DIREITO PROCESSUAL CIVIL","DIREITO PROCESSUAL PENAL",
    "DIREITO PROCESSUAL","DIREITO DO TRABALHO","DIREITO PREVIDENCIARIO","DIREITO FINANCEIRO",
    "DIREITO EMPRESARIAL","CONTABILIDADE PUBLICA","CONTABILIDADE GERAL","CONTABILIDADE DE CUSTOS",
    "CONTABILIDADE AVANCADA","CONTABILIDADE","AUDITORIA GOVERNAMENTAL","AUDITORIA",
    "ADMINISTRACAO PUBLICA","ADMINISTRACAO FINANCEIRA E ORCAMENTARIA","ADMINISTRACAO FINANCEIRA",
    "ADMINISTRACAO GERAL","ADMINISTRACAO","ECONOMIA","FINANCAS PUBLICAS","LEGISLACAO TRIBUTARIA",
    "LEGISLACAO ESPECIFICA","LEGISLACAO","ATUALIDADES","ETICA NO SERVICO PUBLICO","ETICA",
    "GESTAO DE PESSOAS","GESTAO PUBLICA","ARQUIVOLOGIA","SAUDE PUBLICA","ENFERMAGEM",
    "FARMACOLOGIA","PORTUGUES","INFORMATICA","CONHECIMENTOS ESPECIFICOS","CONHECIMENTOS GERAIS",
    "CONHECIMENTOS BASICOS",
  ];
  const semAcento = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const tn = semAcento(t);

  // Marca intervalos ja cobertos por uma disciplina mais especifica (evita duplicar)
  const ocupado = new Array(tn.length).fill(false);
  const achados = [];
  for (const kw of discKW) {
    let idx = tn.indexOf(kw);
    while (idx !== -1) {
      // se essa posicao ja foi capturada por uma kw mais especifica, ignora
      let livre = true;
      for (let j = idx; j < idx + kw.length; j++) { if (ocupado[j]) { livre = false; break; } }
      if (livre) {
        achados.push({ kw, idx });
        for (let j = idx; j < idx + kw.length; j++) ocupado[j] = true;
      }
      idx = tn.indexOf(kw, idx + kw.length);
    }
  }
  achados.sort((a, b) => a.idx - b.idx);

  const disc = [];
  for (let i = 0; i < achados.length; i++) {
    const a = achados[i];
    const prox = achados[i + 1] ? achados[i + 1].idx : Math.min(a.idx + 1400, t.length);
    const trecho = t.slice(a.idx, prox);
    let topicos = trecho
      .replace(/^[^:]*:?/, "")
      .split(/;|\.\s+\d+\.?\d*\s|\u2022|\n|\d+\.\d+|\s\d+\s/)
      .map(s => s.replace(/^\d+[.)\s-]*/, "").trim())
      .filter(s => s.length > 6 && s.length < 180)
      .filter((s, idx, arr) => arr.indexOf(s) === idx) // remove duplicatas
      .slice(0, 15);
    const nome = a.kw.split(" ").map(w => w.length <= 2 ? w.toLowerCase() : w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
    // so adiciona se achou topicos reais (descarta disciplina "fantasma" vazia)
    if (topicos.length > 0) {
      disc.push({ nome, topicos });
    }
  }
  return disc;
}

// ---- Gerador de PLANO DE ESTUDO INTELIGENTE (sem inventar dados; usa o proprio edital) ----
function gerarPlanoInteligente(disc, horasDia, dataProva) {
  if (!disc || disc.length === 0) return null;
  const totalTopicos = disc.reduce((s, d) => s + d.topicos.length, 0) || 1;
  const horasSemana = Math.max(1, horasDia) * 7;
  const linhas = disc.map(d => {
    const peso = d.topicos.length / totalTopicos;
    return {
      nome: d.nome,
      topicos: d.topicos.length,
      pesoPct: Math.round(peso * 100),
      horasSemana: Math.round(peso * horasSemana * 10) / 10,
    };
  });
  linhas.sort((a, b) => b.topicos - a.topicos);
  let diasAteProva = null, semanasAteProva = null, horasTotaisDisponiveis = null, ritmo = null;
  if (dataProva) {
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const dp = new Date(dataProva + "T00:00:00");
    if (!isNaN(dp.getTime())) {
      diasAteProva = Math.max(0, Math.round((dp - hoje) / 86400000));
      semanasAteProva = Math.max(1, Math.ceil(diasAteProva / 7));
      horasTotaisDisponiveis = diasAteProva * Math.max(1, horasDia);
      ritmo = Math.ceil(totalTopicos / semanasAteProva);
    }
  }
  return { linhas, totalTopicos, totalDisciplinas: disc.length, horasSemana,
           diasAteProva, semanasAteProva, horasTotaisDisponiveis, ritmo };
}

// ---- Fontes de estudo por topico ----
function linksEstudo(termo, banca) {
  const q = encodeURIComponent(termo + " " + (banca && banca !== "Nao identificada" ? banca : "") + " concurso");
  return [
    { n:"Gran", cor:"#0ea5e9", u:`https://www.grancursosonline.com.br/busca?q=${q}` },
    { n:"TEC", cor:"#16a34a", u:`https://www.tecconcursos.com.br/s/${q}` },
    { n:"QConcursos", cor:"#2563eb", u:`https://www.qconcursos.com/busca?q=${q}` },
    { n:"Estrategia", cor:"#e11d48", u:`https://www.estrategiaconcursos.com.br/?s=${q}` },
    { n:"Google", cor:"#0891b2", u:`https://www.google.com/search?q=${q}` },
    { n:"YouTube", cor:"#dc2626", u:`https://www.youtube.com/results?search_query=${q}` },
  ];
}

// ============ FLASHCARDS AUTOMATICOS (gerados dos topicos do edital) ============
function SrcLinksBase({ termo, banca }) {
  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
      {linksEstudo(termo, banca).map((l,i)=>(
        <a key={i} href={l.u} target="_blank" rel="noopener noreferrer"
          style={{background:l.cor+"22",border:`1px solid ${l.cor}`,color:l.cor,borderRadius:6,padding:"4px 9px",fontSize:11,fontWeight:700,textDecoration:"none"}}>
          {l.n} ↗
        </a>
      ))}
    </div>
  );
}

function gerarBaralho(disc) {
  const cards = [];
  for (const d of disc) {
    for (const tp of d.topicos) {
      const t = String(tp).trim();
      if (t.length < 4) continue;
      cards.push({ disciplina: d.nome, topico: t });
    }
  }
  return cards;
}

function FlashcardsEdital({ disc, banca }) {
  const baralho = gerarBaralho(disc);
  const [filtro, setFiltro] = useState("Todas");
  const [idx, setIdx] = useState(0);
  const [virada, setVirada] = useState(false);

  const disciplinas = ["Todas", ...disc.map(d => d.nome)];
  const cards = filtro === "Todas" ? baralho : baralho.filter(c => c.disciplina === filtro);
  const card = cards[idx] || null;

  const irPara = (n) => { setVirada(false); setIdx(n); };
  const proximo = () => irPara((idx + 1) % cards.length);
  const anterior = () => irPara((idx - 1 + cards.length) % cards.length);

  if (baralho.length === 0) {
    return <p style={{color:C.muted,fontSize:13}}>Nenhum topico detectado para gerar flashcards. Cole o conteudo programatico do edital.</p>;
  }

  return (
    <div>
      <div style={{background:`linear-gradient(135deg, ${C.blue}1e, ${C.card})`,border:`1px solid ${C.blue}55`,borderRadius:10,padding:14,marginBottom:12}}>
        <div style={{fontWeight:700,color:C.text,fontSize:14,marginBottom:3}}>📇 Flashcards do seu edital</div>
        <div style={{fontSize:11.5,color:C.muted,lineHeight:1.6}}>
          {baralho.length} flashcards gerados automaticamente dos topicos detectados. Tente lembrar o conteudo, depois vire a carta para conferir e aprofundar.
        </div>
      </div>

      {/* filtro por disciplina */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:12}}>
        {disciplinas.map(nm => (
          <button key={nm} onClick={()=>{ setFiltro(nm); irPara(0); }}
            style={{padding:"5px 11px",borderRadius:14,fontSize:11.5,fontWeight:700,cursor:"pointer",
              border:`1px solid ${filtro===nm?C.blue:C.border}`,
              background:filtro===nm?C.blue+"22":"transparent",
              color:filtro===nm?"#93c5fd":C.muted}}>
            {nm}{nm!=="Todas" ? "" : ` (${baralho.length})`}
          </button>
        ))}
      </div>

      {card && (
        <>
          <div onClick={()=>setVirada(v=>!v)}
            style={{background:virada?C.card2:C.card,border:`1px solid ${virada?C.blue:C.border}`,borderRadius:14,padding:"28px 20px",minHeight:170,
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",cursor:"pointer",transition:"all 0.2s"}}>
            <div style={{fontSize:10.5,color:C.muted,textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>{card.disciplina}</div>
            {!virada ? (
              <>
                <div style={{fontSize:16,color:C.text,fontWeight:600,lineHeight:1.5}}>O que voce sabe sobre:</div>
                <div style={{fontSize:18,color:C.goldL,fontWeight:700,lineHeight:1.5,marginTop:8}}>{card.topico}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:16}}>👆 toque para virar</div>
              </>
            ) : (
              <>
                <div style={{fontSize:14,color:C.text,fontWeight:600,lineHeight:1.6}}>Topico para dominar:</div>
                <div style={{fontSize:16,color:"#93c5fd",fontWeight:700,lineHeight:1.5,marginTop:8}}>{card.topico}</div>
                <div style={{fontSize:11.5,color:C.muted,marginTop:14,lineHeight:1.6}}>
                  Aprofunde nas fontes abaixo ou peca a uma IA: <em>"explique {card.topico} para concurso da banca {banca}"</em>.
                </div>
              </>
            )}
          </div>

          {virada && (
            <div style={{marginTop:10}}>
              <SrcLinksBase termo={card.disciplina + " " + card.topico} banca={banca} />
            </div>
          )}

          {/* navegacao */}
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:14,gap:10}}>
            <button onClick={anterior} style={{background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700}}>← Anterior</button>
            <div style={{fontSize:12,color:C.muted}}>{idx+1} / {cards.length}</div>
            <button onClick={proximo} style={{background:C.blue+"22",border:`1px solid ${C.blue}`,color:"#93c5fd",borderRadius:8,padding:"9px 16px",cursor:"pointer",fontSize:13,fontWeight:700}}>Proximo →</button>
          </div>
        </>
      )}
    </div>
  );
}

// ============ VISUALIZACAO DE ESTUDO DO EDITAL ============
function EstudoEdital({ ed, onVoltar }) {
  const [tab, setTab] = useState("visao");
  const [horas, setHoras] = useState(3);
  const [dataProva, setDataProva] = useState(ed.prova || "");
  const [topAberto, setTopAberto] = useState(null);
  const [showIAHelp, setShowIAHelp] = useState(false);

  const disc = ed.disciplinas || [];
  const plano = gerarPlanoInteligente(disc, horas, dataProva);
  const totalTopicos = disc.reduce((s, d) => s + d.topicos.length, 0);
  const blocosDia = Math.max(1, Math.round(horas / 1.5));
  const semanas = Math.max(1, Math.ceil(totalTopicos / (blocosDia * 7)));

  const TABS = [
    ["visao","Visao Geral"], ["plano","🎯 Plano Inteligente"], ["disc","Disciplinas"], ["crono","Cronograma"],
    ["banco","Banco de Questoes"],
    ...(ed.discursiva ? [["disc2","Discursivas"]] : []),
    ["estrat","Estrategia da Banca"], ["flash","Resumos e Flashcards"],
    ["simu","Simulado"],
  ];

  const dicasBanca = {
    "Cebraspe/CESPE":["Itens CERTO/ERRADO: erro anula acerto. Cuidado com generalizacoes.","Domine 'palavras-chave' (sempre, nunca, sera) que tornam o item errado.","Texto longo com pegadinhas conceituais; leia com atencao."],
    "FCC":["Questoes literais: decore a letra da lei e jurisprudencia.","Alternativas longas e detalhistas; elimine por exclusao.","Forte em legislacao seca e definicoes precisas."],
    "FGV":["Questoes interpretativas e contextualizadas; exige raciocinio.","Enunciados extensos com casos praticos.","Combina teoria e aplicacao; nao basta decorar."],
    "Vunesp":["Equilibrio entre letra da lei e interpretacao.","Questoes objetivas e diretas; boa base teorica resolve.","Atencao a portugues e raciocinio logico."],
    "IDECAN":["Foco em literalidade e conceitos basicos.","Questoes de dificuldade media; constancia resolve."],
  };
  const dicas = dicasBanca[ed.banca] || ["Pesquise provas anteriores da banca para entender o estilo.","Resolva questoes da propria banca no QConcursos e TEC.","Identifique os temas mais cobrados e priorize-os."];

  const Btn = ({id, children}) => (
    <button onClick={()=>setTab(id)} style={{
      padding:"7px 12px", borderRadius:6, whiteSpace:"nowrap",
      border:`1px solid ${tab===id?C.gold:C.border}`,
      background:tab===id?C.gold+"22":"transparent",
      color:tab===id?C.gold:C.muted, cursor:"pointer", fontSize:12, fontWeight:700
    }}>{children}</button>
  );

  const SrcLinks = ({termo}) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
      {linksEstudo(termo, ed.banca).map((l,i)=>(
        <a key={i} href={l.u} target="_blank" rel="noopener noreferrer"
          style={{background:l.cor+"22",border:`1px solid ${l.cor}`,color:l.cor,borderRadius:6,padding:"4px 9px",fontSize:11,fontWeight:700,textDecoration:"none"}}>
          {l.n} ↗
        </a>
      ))}
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <button onClick={onVoltar} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:12}}>← Meus Editais</button>
        <div style={{fontSize:12,color:C.goldL,fontWeight:700,textAlign:"right"}}>{ed.nome}</div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:14,borderBottom:`1px solid ${C.border}`}}>
        {TABS.map(([id,t])=><Btn key={id} id={id}>{t}</Btn>)}
      </div>

      {/* VISAO GERAL */}
      {tab==="visao" && (
        <div>
          <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:10,padding:16,marginBottom:14}}>
            <h3 style={{color:C.goldL,margin:"0 0 12px"}}>📋 {ed.nome}</h3>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:10}}>
              {[["Orgao/Cargo",ed.cargo||"-"],["Banca",ed.banca],["Disciplinas",disc.length],["Topicos",totalTopicos],["Discursiva",ed.discursiva?"Sim":"Nao"]].map(([l,v])=>(
                <div key={l} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontSize:18,fontWeight:700,color:C.gold}}>{v}</div>
                  <div style={{fontSize:11,color:C.muted}}>{l}</div>
                </div>
              ))}
            </div>
            {ed.link && <div style={{marginTop:12}}><a href={ed.link} target="_blank" rel="noopener noreferrer" style={{color:"#93c5fd",fontSize:12}}>🔗 Abrir edital/fonte original</a></div>}
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
            <div style={{fontWeight:700,color:C.gold,fontSize:13,marginBottom:8}}>Como estudar este edital</div>
            <p style={{color:C.text,fontSize:12,lineHeight:1.8,margin:0}}>
              A plataforma extraiu a estrutura do seu edital. Use as abas acima: veja as <strong>Disciplinas</strong> e topicos detectados, monte seu <strong>Cronograma</strong>, e em cada topico use os botoes de <strong>Resumos/Flashcards</strong>, <strong>Banco de Questoes</strong> e <strong>Simulado</strong> — que abrem buscas filtradas direto nas fontes (Gran, TEC, QConcursos, Estrategia) ja com o nome da banca <strong>{ed.banca}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* PLANO INTELIGENTE */}
      {tab==="plano" && (
        <div>
          <div style={{background:`linear-gradient(135deg, ${C.gold}18, ${C.card})`,border:`1px solid ${C.gold}55`,borderRadius:10,padding:16,marginBottom:14}}>
            <h3 style={{color:C.goldL,margin:"0 0 6px"}}>🎯 Plano de Estudo Inteligente</h3>
            <p style={{color:C.text,fontSize:12,lineHeight:1.7,margin:0}}>
              Gerado automaticamente a partir do <strong>seu edital</strong>: ordem de estudo priorizada, tempo por disciplina proporcional a carga de topicos e cronograma ate a prova. Ajuste suas horas/dia e a data da prova abaixo.
            </p>
          </div>

          {/* Controles */}
          <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:14}}>
            <div style={{flex:1,minWidth:160,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:12}}>
              <div style={{fontSize:12,color:C.muted,marginBottom:6}}>Horas de estudo por dia: <strong style={{color:C.gold}}>{horas}h</strong></div>
              <input type="range" min="1" max="10" value={horas} onChange={e=>setHoras(Number(e.target.value))} style={{width:"100%",accentColor:C.gold}}/>
            </div>
            <div style={{flex:1,minWidth:160,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:12}}>
              <div style={{fontSize:12,color:C.muted,marginBottom:6}}>Data da prova</div>
              <input type="date" value={dataProva} onChange={e=>setDataProva(e.target.value)}
                style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:6,padding:"7px 10px",fontSize:13}}/>
            </div>
          </div>

          {!plano && <p style={{color:C.muted,fontSize:13}}>Nenhuma disciplina detectada para montar o plano. Cole o conteudo programatico do edital na aba Meus Editais.</p>}

          {plano && (
            <>
              {/* Resumo numerico (so dados reais) */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10,marginBottom:14}}>
                {[
                  ["Disciplinas", plano.totalDisciplinas],
                  ["Topicos no edital", plano.totalTopicos],
                  ["Horas/semana", plano.horasSemana+"h"],
                  ...(plano.diasAteProva!=null ? [
                    ["Dias ate a prova", plano.diasAteProva],
                    ["Horas disponiveis", plano.horasTotaisDisponiveis+"h"],
                    ["Ritmo necessario", plano.ritmo+" top/sem"],
                  ] : []),
                ].map(([l,v])=>(
                  <div key={l} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                    <div style={{fontSize:17,fontWeight:700,color:C.gold}}>{v}</div>
                    <div style={{fontSize:11,color:C.muted}}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Ordem priorizada + distribuicao de tempo */}
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{fontWeight:700,color:C.gold,fontSize:13,marginBottom:4}}>Ordem de estudo priorizada</div>
                <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Disciplinas com mais topicos recebem mais tempo (maior peso na prova). Estude de cima para baixo.</div>
                {plano.linhas.map((l,i)=>(
                  <div key={l.nome} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <span style={{fontSize:13,color:C.text,fontWeight:600}}>
                        <span style={{display:"inline-block",width:20,height:20,lineHeight:"20px",textAlign:"center",background:C.gold,color:"#000",borderRadius:"50%",fontSize:11,fontWeight:700,marginRight:8}}>{i+1}</span>
                        {l.nome}
                      </span>
                      <span style={{fontSize:11,color:C.muted}}>{l.topicos} top · {l.horasSemana}h/sem</span>
                    </div>
                    <div style={{height:8,background:C.card2,borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:l.pesoPct+"%",background:`linear-gradient(90deg,${C.gold},${C.goldL})`,borderRadius:4}}/>
                    </div>
                  </div>
                ))}
              </div>

              {plano.diasAteProva!=null && plano.diasAteProva>0 && (
                <div style={{background:C.card,border:`1px solid ${C.green}44`,borderRadius:10,padding:14}}>
                  <div style={{fontWeight:700,color:C.green,fontSize:13,marginBottom:6}}>📅 Cronograma ate a prova</div>
                  <p style={{color:C.text,fontSize:12,lineHeight:1.8,margin:0}}>
                    Faltam <strong>{plano.diasAteProva} dias</strong> ({plano.semanasAteProva} semanas). Com <strong>{horas}h/dia</strong>, voce tem <strong>{plano.horasTotaisDisponiveis}h</strong> de estudo disponiveis. Para cobrir os <strong>{plano.totalTopicos} topicos</strong> a tempo, mantenha um ritmo de <strong>{plano.ritmo} topicos por semana</strong>. Priorize as disciplinas no topo da lista e reserve os ultimos dias para revisao e simulados.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* DISCIPLINAS */}
      {tab==="disc" && (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {disc.length===0 && <p style={{color:C.muted,fontSize:13}}>Nenhuma disciplina detectada automaticamente. Use a aba Estrategia e o link do edital original para conferir o conteudo.</p>}
          {disc.map((d,i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
              <div style={{fontWeight:700,color:C.goldL,fontSize:14,marginBottom:8}}>{d.nome} <span style={{color:C.muted,fontSize:11,fontWeight:400}}>({d.topicos.length} topico(s))</span></div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {d.topicos.map((tp,j)=>{
                  const id=i+"-"+j;
                  return (
                    <div key={j} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 10px"}}>
                      <div onClick={()=>setTopAberto(topAberto===id?null:id)} style={{cursor:"pointer",fontSize:12,color:C.text,display:"flex",justifyContent:"space-between",gap:8}}>
                        <span>{tp}</span><span style={{color:C.gold}}>{topAberto===id?"−":"+"}</span>
                      </div>
                      {topAberto===id && <SrcLinks termo={d.nome+" "+tp}/>}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CRONOGRAMA */}
      {tab==="crono" && (
        <div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <span style={{color:C.text,fontSize:13}}>Horas de estudo/dia:</span>
              <input type="range" min="1" max="10" value={horas} onChange={e=>setHoras(Number(e.target.value))} style={{flex:1,accentColor:C.gold}}/>
              <span style={{color:C.goldL,fontWeight:700,fontSize:16,minWidth:60,textAlign:"right"}}>{horas}h</span>
            </div>
            <p style={{color:C.text,fontSize:12,margin:0}}>
              Com {horas}h/dia, voce cobre os <strong style={{color:C.gold}}>{totalTopicos} topicos</strong> em aproximadamente <strong style={{color:C.green}}>{semanas} semana(s)</strong>, estudando ~{blocosDia*7} sessoes/semana.
            </p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {disc.map((d,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"center",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px"}}>
                <span style={{background:C.gold+"22",border:`1px solid ${C.gold}`,color:C.gold,borderRadius:6,padding:"3px 9px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>Sem {Math.floor(i/2)+1}</span>
                <span style={{fontSize:12,color:C.text}}>{d.nome}</span>
              </div>
            ))}
          </div>
          <p style={{color:C.muted,fontSize:11,marginTop:10,lineHeight:1.5}}>Revisoes por repeticao espacada: revise cada disciplina apos 1, 7, 30 e 90 dias.</p>
        </div>
      )}

      {/* BANCO DE QUESTOES */}
      {tab==="banco" && (
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {/* Gerar questoes com IA (traga sua propria IA) */}
          <div style={{background:`linear-gradient(135deg, ${C.purple}1e, ${C.card})`,border:`1px solid ${C.purple}55`,borderRadius:10,padding:14,marginBottom:6}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:22}}>🤖</span>
                <div>
                  <div style={{fontWeight:700,color:C.text,fontSize:14}}>Gerar questoes com IA</div>
                  <div style={{fontSize:11,color:C.muted}}>Use sua propria IA para criar questoes ineditas dos topicos deste edital</div>
                </div>
              </div>
              <button onClick={()=>setShowIAHelp(true)} title="Como integrar sua IA"
                style={{flexShrink:0,width:34,height:34,borderRadius:"50%",border:`2px solid ${C.purple}`,background:C.purple+"22",color:C.purple,cursor:"pointer",fontSize:18,fontWeight:800,lineHeight:1,animation:"sefazPulse 2s infinite"}}>?</button>
            </div>
          </div>
          <p style={{color:C.muted,fontSize:12,marginBottom:4}}>Ou resolva questoes por disciplina, filtradas pela banca {ed.banca}:</p>
          {disc.map((d,i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:4}}>{d.nome}</div>
              <SrcLinks termo={d.nome+" questoes"}/>
            </div>
          ))}
        </div>
      )}

      {/* DISCURSIVAS */}
      {tab==="disc2" && ed.discursiva && (
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
          <h3 style={{color:C.goldL,margin:"0 0 8px",fontSize:15}}>✍️ Prova Discursiva detectada</h3>
          <p style={{color:C.text,fontSize:12,lineHeight:1.8}}>O edital indica prova discursiva/redacao. Treine: estrutura (introducao, desenvolvimento, conclusao), uso da norma culta, e modelos da banca {ed.banca}.</p>
          <SrcLinks termo={"prova discursiva redacao modelo "+(ed.cargo||"")}/>
        </div>
      )}

      {/* ESTRATEGIA */}
      {tab==="estrat" && (
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
          <h3 style={{color:C.goldL,margin:"0 0 10px",fontSize:15}}>🎯 Estrategia da Banca: {ed.banca}</h3>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {dicas.map((d,i)=>(
              <div key={i} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:12,color:C.text,lineHeight:1.6}}>• {d}</div>
            ))}
          </div>
          <div style={{marginTop:12}}>
            <div style={{fontSize:12,color:C.gold,fontWeight:700,marginBottom:6}}>Provas anteriores da banca:</div>
            <SrcLinks termo={"provas anteriores "+(ed.cargo||"")}/>
          </div>
        </div>
      )}

      {/* FLASHCARDS */}
      {tab==="flash" && (
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <FlashcardsEdital disc={disc} banca={ed.banca} />
          <div>
            <p style={{color:C.muted,fontSize:12,marginBottom:8}}>Resumos e mapas mentais por disciplina (abrem materiais nas fontes):</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {disc.map((d,i)=>(
                <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:4}}>📇 {d.nome}</div>
                  <SrcLinks termo={d.nome+" resumo mapa mental"}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SIMULADO */}
      {tab==="simu" && (
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
          <h3 style={{color:C.goldL,margin:"0 0 8px",fontSize:15}}>🎯 Simulado personalizado</h3>
          <p style={{color:C.text,fontSize:12,lineHeight:1.8,marginBottom:8}}>Monte simulados com as questoes da banca {ed.banca} cobrindo as disciplinas do seu edital:</p>
          <SrcLinks termo={"simulado "+(ed.cargo||"")+" todas as disciplinas"}/>
        </div>
      )}

      {/* MODAL: passo a passo para integrar IAs */}
      {showIAHelp && (
        <div onClick={()=>setShowIAHelp(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,display:"flex",alignItems:"flex-start",justifyContent:"center",padding:16,overflowY:"auto"}}>
          <div onClick={e=>e.stopPropagation()} style={{background:C.card,border:`1px solid ${C.purple}55`,borderRadius:14,padding:20,maxWidth:560,width:"100%",margin:"20px 0"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
              <h3 style={{color:C.goldL,margin:0,fontSize:17}}>🤖 Como gerar questoes com sua IA</h3>
              <button onClick={()=>setShowIAHelp(false)} style={{background:"transparent",border:"none",color:C.muted,fontSize:22,cursor:"pointer",lineHeight:1}}>×</button>
            </div>
            <p style={{color:C.text,fontSize:12.5,lineHeight:1.7,marginTop:0}}>
              Voce pode usar qualquer assistente de IA para criar questoes ineditas dos topicos deste edital. E simples e funciona com a sua conta (nenhum dado seu passa por nos):
            </p>
            <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",margin:"10px 0"}}>
              <div style={{fontWeight:700,color:C.gold,fontSize:13,marginBottom:6}}>Passo a passo (vale para todas):</div>
              <ol style={{color:C.text,fontSize:12.5,lineHeight:1.8,margin:0,paddingLeft:18}}>
                <li>Abra a IA de sua preferencia (lista abaixo).</li>
                <li>Copie um topico da aba <strong>Disciplinas</strong> deste edital.</li>
                <li>Cole o prompt sugerido e envie.</li>
                <li>Resolva as questoes e confira os comentarios.</li>
              </ol>
            </div>
            <div style={{background:C.purple+"15",border:`1px solid ${C.purple}44`,borderRadius:10,padding:"10px 12px",margin:"10px 0"}}>
              <div style={{fontSize:11,color:C.purple,fontWeight:700,marginBottom:4}}>PROMPT SUGERIDO (copie e cole):</div>
              <div style={{fontSize:12,color:C.text,fontStyle:"italic",lineHeight:1.6}}>
                "Aja como banca {ed.banca}. Crie 5 questoes de multipla escolha ineditas sobre [TOPICO], no estilo do concurso {ed.cargo||"que estou estudando"}. Inclua gabarito e comentario explicativo de cada alternativa."
              </div>
            </div>
            <div style={{fontWeight:700,color:C.gold,fontSize:13,margin:"14px 0 8px"}}>Onde acessar cada IA:</div>
            {[
              ["ChatGPT (OpenAI)","chat.openai.com","Gratuito com conta Google/e-mail. O modelo gratuito ja gera questoes muito bem."],
              ["Claude (Anthropic)","claude.ai","Gratuito com conta. Excelente para questoes comentadas e juridicas."],
              ["Gemini (Google)","gemini.google.com","Gratuito com conta Google. Bom para volumes maiores."],
              ["Manus","manus.im","Agente de IA; util para tarefas mais longas e estruturadas."],
              ["Copilot (Microsoft)","copilot.microsoft.com","Gratuito; baseado nos modelos da OpenAI, integrado ao Edge/Windows."],
            ].map(([nome,url,obs])=>(
              <div key={nome} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",marginBottom:7}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{fontWeight:700,color:C.text,fontSize:13}}>{nome}</span>
                  <a href={"https://"+url} target="_blank" rel="noopener noreferrer" style={{color:C.purple,fontSize:12,fontWeight:700,textDecoration:"none"}}>{url} ↗</a>
                </div>
                <div style={{fontSize:11,color:C.muted,marginTop:3}}>{obs}</div>
              </div>
            ))}
            <p style={{fontSize:11,color:C.muted,lineHeight:1.6,marginTop:12,marginBottom:0}}>
              Dica: cole tambem o texto do topico junto ao prompt para questoes mais fieis. Em breve, voce podera cadastrar sua chave de API para gerar questoes direto aqui dentro.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
export default function MeusEditais({ onClose }) {
  const [lista, setLista] = useState([]);
  const [modo, setModo] = useState("lista"); // lista | add | estudo
  const [editalAtivo, setEditalAtivo] = useState(null);

  // form
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [link, setLink] = useState("");
  const [texto, setTexto] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [analisando, setAnalisando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => { setLista(carregar()); }, []);

  const persistir = (nova) => { setLista(nova); salvar(nova); };

  const analisar = async () => {
    setErro("");
    if (!nome.trim()) { setErro("Informe um nome para o edital."); return; }
    setAnalisando(true);
    try {
      let conteudo = texto || "";
      if (arquivo) {
        conteudo = await extrairTextoPDF(arquivo);
      }
      if (!conteudo && link) {
        // Sem backend nao da pra baixar o link; orienta colar o texto
        conteudo = "";
      }
      const disciplinas = conteudo ? analisarConteudo(conteudo) : [];
      const banca = conteudo ? detectarBanca(conteudo) : "Nao identificada";
      const discursiva = conteudo ? temDiscursiva(conteudo) : false;
      const novo = {
        id: Date.now(),
        nome: nome.trim(),
        cargo: cargo.trim(),
        link: link.trim(),
        banca, discursiva, disciplinas,
        criado: new Date().toLocaleDateString("pt-BR"),
        temTexto: !!conteudo,
      };
      const nova = [novo, ...lista];
      persistir(nova);
      setNome(""); setCargo(""); setLink(""); setTexto(""); setArquivo(null);
      setEditalAtivo(novo); setModo("estudo");
    } catch (e) {
      setErro("Nao foi possivel ler o PDF. Tente colar o texto do conteudo programatico.");
    }
    setAnalisando(false);
  };

  const excluir = (id) => {
    const nova = lista.filter(e => e.id !== id);
    persistir(nova);
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,overflowY:"auto",padding:"20px 12px"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:700,margin:"0 auto",background:C.bg,border:`1px solid ${C.gold}44`,borderRadius:14,padding:"20px 18px"}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h2 style={{color:C.gold,margin:0,fontSize:17}}>📑 Meus Editais</h2>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>

        {/* ESTUDO */}
        {modo==="estudo" && editalAtivo && (
          <EstudoEdital ed={editalAtivo} onVoltar={()=>{setModo("lista");setEditalAtivo(null);}}/>
        )}

        {/* ADICIONAR */}
        {modo==="add" && (
          <div>
            <button onClick={()=>setModo("lista")} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:12,marginBottom:14}}>← Voltar</button>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <label style={{fontSize:12,color:C.gold,fontWeight:700,display:"block",marginBottom:4}}>Nome do edital *</label>
                <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Ex: Auditor TCE-PE 2026"
                  style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13}}/>
              </div>
              <div>
                <label style={{fontSize:12,color:C.gold,fontWeight:700,display:"block",marginBottom:4}}>Orgao / Cargo</label>
                <input value={cargo} onChange={e=>setCargo(e.target.value)} placeholder="Ex: Tribunal de Contas - Auditor"
                  style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13}}/>
              </div>
              <div>
                <label style={{fontSize:12,color:C.gold,fontWeight:700,display:"block",marginBottom:4}}>Link / Site / Endereco do edital</label>
                <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://..."
                  style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13}}/>
              </div>
              <div>
                <label style={{fontSize:12,color:C.gold,fontWeight:700,display:"block",marginBottom:4}}>PDF do edital (analise automatica)</label>
                <input type="file" accept="application/pdf" onChange={e=>setArquivo(e.target.files[0])}
                  style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"8px 10px",fontSize:12}}/>
                {arquivo && <div style={{fontSize:11,color:C.green,marginTop:4}}>✓ {arquivo.name}</div>}
              </div>
              <div>
                <label style={{fontSize:12,color:C.gold,fontWeight:700,display:"block",marginBottom:4}}>Ou cole o texto do CONTEUDO PROGRAMATICO</label>
                <textarea value={texto} onChange={e=>setTexto(e.target.value)} rows={5} placeholder="Cole aqui o conteudo programatico do edital (disciplinas e topicos)..."
                  style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:12,resize:"vertical"}}/>
              </div>
              {erro && <div style={{color:C.red,fontSize:12}}>{erro}</div>}
              <button onClick={analisar} disabled={analisando}
                style={{background:analisando?C.muted:C.gold,color:"#000",border:"none",borderRadius:8,padding:"12px",cursor:analisando?"wait":"pointer",fontWeight:700,fontSize:14}}>
                {analisando?"Analisando edital...":"📊 Analisar e Salvar Edital"}
              </button>
              <p style={{fontSize:11,color:C.muted,lineHeight:1.6,margin:0}}>
                A analise le o PDF localmente no seu dispositivo (nada e enviado a servidores) e detecta disciplinas, topicos, banca e prova discursiva. Para melhor resultado, anexe o PDF ou cole o conteudo programatico. O link fica salvo para consulta.
              </p>
            </div>
          </div>
        )}

        {/* LISTA */}
        {modo==="lista" && (
          <div>
            <button onClick={()=>setModo("add")} style={{width:"100%",background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"12px",cursor:"pointer",fontWeight:700,fontSize:14,marginBottom:16}}>
              ➕ Adicionar novo edital
            </button>
            {lista.length===0 ? (
              <div style={{textAlign:"center",padding:30,color:C.muted}}>
                <div style={{fontSize:40,marginBottom:10}}>📭</div>
                <p style={{fontSize:13}}>Nenhum edital salvo ainda. Adicione um edital (PDF, link ou texto) para gerar estudos personalizados.</p>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {lista.map(ed=>(
                  <div key={ed.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,color:C.goldL,fontSize:14}}>{ed.nome}</div>
                        <div style={{fontSize:11,color:C.muted,marginTop:2}}>{ed.cargo||"Cargo nao informado"} • Banca: {ed.banca} • {(ed.disciplinas||[]).length} disciplina(s){ed.discursiva?" • Discursiva":""}</div>
                        <div style={{fontSize:10,color:C.muted,marginTop:2}}>Salvo em {ed.criado}</div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:8,marginTop:10}}>
                      <button onClick={()=>{setEditalAtivo(ed);setModo("estudo");}} style={{flex:1,background:C.blue+"22",border:`1px solid ${C.blue}`,color:C.blue,borderRadius:6,padding:"8px",cursor:"pointer",fontSize:12,fontWeight:700}}>📖 Estudar</button>
                      <button onClick={()=>excluir(ed.id)} style={{background:C.red+"22",border:`1px solid ${C.red}`,color:C.red,borderRadius:6,padding:"8px 14px",cursor:"pointer",fontSize:12,fontWeight:700}}>🗑 Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
