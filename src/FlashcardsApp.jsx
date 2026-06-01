import { useState, useEffect, useRef } from "react";
import { R, Q } from "./fcData.js";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035",
  border:"#1b2c44", gold:"#c8a951", goldL:"#f0d080",
  red:"#ef4444", green:"#22c55e", blue:"#3b82f6",
  purple:"#a855f7", text:"#e2e8f0", muted:"#64748b",
};

// Cada topico tem seu proprio banco de questoes
const QK = {
  "LP-1":"LP-1","LP-2":"LP-2","MAT-1":"MAT-1","MAT-2":"MAT-2","ADM-1":"ADM-1","ADM-2":"ADM-2","ECO-1":"ECO-1","ECO-2":"ECO-2","DCO-1":"DCO-1","DAD-1":"DAD-1","DCI-1":"DCI-1","DFI-1":"DFI-1","DFI-2":"DFI-2","CGP-1":"CGP-1","CGP-2":"CGP-2","COA-1":"COA-1","COA-2":"COA-2","DTR-1":"DTR-1","DTR-2":"DTR-2","DTR-3":"DTR-3","LTE-1":"LTE-1","FLD-1":"FLD-1","FPB-1":"FPB-1"
};

const DISC = [
  {n:"Lingua Portuguesa",c:"#84cc16",i:"📝",p:"10Q",tps:[
    {id:"LP-1",t:"Concordancia, Regencia, Crase e Morfossintaxe"},
    {id:"LP-2",t:"Interpretacao, Coesao, Pontuacao e Ortografia"},
  ]},
  {n:"Matematica Financeira, Estatistica e Logica",c:"#06b6d4",i:"🔢",p:"12Q",tps:[
    {id:"MAT-1",t:"Juros Simples, Compostos, SAC e Price"},
    {id:"MAT-2",t:"Estatistica Descritiva, Probabilidade e Logica"},
  ]},
  {n:"Administracao Publica e Governanca",c:"#f59e0b",i:"🏢",p:"10Q",tps:[
    {id:"ADM-1",t:"Governanca, Gestao de Riscos e Integridade"},
    {id:"ADM-2",t:"Licitacoes (Lei 14.133/2021), Improbidade e LAI"},
  ]},
  {n:"Economia",c:"#3b82f6",i:"📉",p:"10Q",tps:[
    {id:"ECO-1",t:"Microeconomia, Elasticidades e Tributacao"},
    {id:"ECO-2",t:"Macroeconomia, PIB, IS-LM e Politicas"},
  ]},
  {n:"Direito Constitucional",c:"#ec4899",i:"⚖️",p:"4Q",tps:[
    {id:"DCO-1",t:"Controle de Constitucionalidade e Direitos Fundamentais"},
  ]},
  {n:"Direito Administrativo",c:"#f97316",i:"🏛️",p:"4Q",tps:[
    {id:"DAD-1",t:"Atos Administrativos, Responsabilidade Civil e Organizacao"},
  ]},
  {n:"Direito Civil e Penal",c:"#a78bfa",i:"📋",p:"4Q",tps:[
    {id:"DCI-1",t:"Crimes Tributarios, Lavagem de Dinheiro e Noções Cíveis"},
  ]},
  {n:"Direito Financeiro",c:"#14b8a6",i:"💰",p:"8Q",tps:[
    {id:"DFI-1",t:"LRF - Lei de Responsabilidade Fiscal Completa"},
    {id:"DFI-2",t:"Orcamento Publico, PPA, LDO, LOA e Lei 4.320/64"},
  ]},
  {n:"Contabilidade Geral e Publica",c:"#6366f1",i:"📒",p:"10Q",tps:[
    {id:"CGP-1",t:"MCASP, Receita, Despesa, NBC TSP e Restos a Pagar"},
    {id:"CGP-2",t:"Estoques, Ativo Imobilizado, Provisoes e DRE"},
  ]},
  {n:"Contabilidade Avancada e de Custos",c:"#8b5cf6",i:"📊",p:"20Q (Peso 2)",tps:[
    {id:"COA-1",t:"Valor Justo (CPC 46), Arrendamento IFRS 16, Goodwill e MEP"},
    {id:"COA-2",t:"Custos, Ponto de Equilibrio e Metodos de Custeio"},
  ]},
  {n:"Direito Tributario",c:"#ef4444",i:"⚖️",p:"20Q (Peso 2)",tps:[
    {id:"DTR-1",t:"CTN: Obrigacao, Fato Gerador, Credito, Extincao e Suspensao"},
    {id:"DTR-2",t:"Reforma Tributaria: EC 132/2023, IBS, CBS e IS"},
    {id:"DTR-3",t:"Lei Kandir, CONFAZ, Simples Nacional e LC 116"},
  ]},
  {n:"Legislacao Tributaria Estadual do Ceara",c:"#f97316",i:"📜",p:"20Q (Peso 2)",tps:[
    {id:"LTE-1",t:"ICMS-CE, ITCD, IPVA e FECOP"},
  ]},
  {n:"Fluencia de Dados",c:"#d946ef",i:"💻",p:"10Q (Peso 2)",tps:[
    {id:"FLD-1",t:"SQL, Arquitetura de Dados, LGPD e Governanca de Dados"},
  ]},
  {n:"Financas Publicas",c:"#10b981",i:"📈",p:"10Q (Peso 2)",tps:[
    {id:"FPB-1",t:"Funcoes do Estado (Musgrave), Bens Publicos e Resultado Fiscal"},
  ]},
];

const fmtT = s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

// ── QUIZ ──────────────────────────────────────────────
const K_ERRADAS="sefaz_erradas_v2";
const K_TIPOERRO="sefaz_tipoerro_v1";
const TIPOS_ERRO=[
  {id:"naosabia",  n:"Nao sabia o conteudo", icone:"📕", cor:"#ef4444"},
  {id:"interpret", n:"Interpretei mal",       icone:"🔍", cor:"#f59e0b"},
  {id:"pegadinha", n:"Cai na pegadinha",      icone:"🎣", cor:"#a855f7"},
  {id:"distraido", n:"Erro bobo/distracao",   icone:"💨", cor:"#3b82f6"},
  {id:"chute",     n:"Chutei",                icone:"🎲", cor:"#64748b"},
];
function carregarTipoErro(){ try{const r=localStorage.getItem(K_TIPOERRO);return r?JSON.parse(r):{};}catch(e){return {};} }
function salvarTipoErro(o){ try{localStorage.setItem(K_TIPOERRO,JSON.stringify(o));}catch(e){} }
function registrarTipoErro(tipo){
  const o=carregarTipoErro(); o[tipo]=(o[tipo]||0)+1; salvarTipoErro(o);
}

// Formata a fonte da questao de forma rastreavel e honesta:
// distingue questao de PROVA REAL de questao no ESTILO da banca (inedita).
function fonteQuestao(q){
  const ref = String(q.r||"").trim();
  const ano = q.a || "";
  const ehEstilo = /estilo|inedit|autoral/i.test(ref);
  if (ehEstilo) {
    return { texto: "Questao no estilo FCC" + (ano?(" · "+ano):""), real: false, icone: "✎" };
  }
  // ref tipica: "FCC/SEFAZ-CE-2023" -> banca/concurso
  const partes = ref.split(/[\/]/);
  const banca = partes[0] || "FCC";
  const concurso = partes.slice(1).join("/");
  let texto = banca;
  if (concurso && concurso !== banca) texto += " · " + concurso;
  if (ano && !ref.includes(String(ano))) texto += " · " + ano;
  return { texto, real: true, icone: "📄" };
}
function carregarErradas(){try{const r=localStorage.getItem(K_ERRADAS);return r?JSON.parse(r):{};}catch(e){return {};}}
function salvarErradas(o){try{localStorage.setItem(K_ERRADAS,JSON.stringify(o));}catch(e){}}
// historico de simulados (evolucao)
const K_HIST="sefaz_simulados_v1";
function carregarHist(){try{const r=localStorage.getItem(K_HIST);return r?JSON.parse(r):[];}catch(e){return [];}}
function salvarHist(a){try{localStorage.setItem(K_HIST,JSON.stringify(a));}catch(e){}}
// assinatura estavel da questao (independe de posicao/embaralhamento)
function sigQ(q){return (q&&q.q?q.q:"").slice(0,120);}
// mapa assinatura -> disciplina (lazy, construido na 1a chamada)
let _sig2disc=null;
function discDaSig(sig){
  if(!_sig2disc){
    _sig2disc={};
    DISC.forEach(d=>d.tps.forEach(t=>{const qk=QK[t.id]||"";(Q[qk]||[]).forEach(q=>{_sig2disc[sigQ(q)]=d.n;});}));
  }
  return _sig2disc[sig]||"Outras";
}
// estatistica de acerto por disciplina (acumulada)
const K_STATS="sefaz_stats_disc_v1";
function carregarStats(){try{const r=localStorage.getItem(K_STATS);return r?JSON.parse(r):{};}catch(e){return {};}}
function salvarStats(o){try{localStorage.setItem(K_STATS,JSON.stringify(o));}catch(e){}}
// reconstroi a lista de questoes erradas varrendo todo o banco Q
function questoesErradas(){
  const er=carregarErradas();
  const out=[];
  Object.keys(Q).forEach(k=>{(Q[k]||[]).forEach(q=>{ if(er[sigQ(q)]) out.push(q); });});
  return out;
}

function Quiz({tp, qs, onBack, banca}){
  const [lim,setLim]=useState(null);
  const [idx,setIdx]=useState(0);
  const [sel,setSel]=useState(null);
  const [show,setShow]=useState(false);
  const [ac,setAc]=useState(0);
  const [er,setEr]=useState(0);
  const [tipoErroSel,setTipoErroSel]=useState(null);
  const [t,setT]=useState(0);
  const [fim,setFim]=useState(false);
  const ref=useRef(null);
  const penalidade = banca==="cebraspe";
  const salvouHist=useRef(false);
  // modo prova: simulados (SIM-*) tem tempo-limite de 3 min/questao, contagem regressiva
  const exame = !!(tp && tp.id && tp.id.indexOf("SIM")===0);
  const limiteSeg = exame ? (lim||0)*180 : 0;
  const restante = exame ? Math.max(0, limiteSeg - t) : 0;

  useEffect(()=>{
    if(lim&&!fim){ ref.current=setInterval(()=>setT(x=>x+1),1000); }
    return()=>clearInterval(ref.current);
  },[lim,fim]);

  // auto-encerra o simulado quando esgota o tempo da prova
  useEffect(()=>{
    if(exame && lim && !fim && t>=limiteSeg && limiteSeg>0){ setFim(true); clearInterval(ref.current); }
  },[t,exame,lim,fim,limiteSeg]);

  // ao terminar um SIMULADO, registra no historico de evolucao (uma vez)
  useEffect(()=>{
    if(fim && !salvouHist.current && tp && tp.id && tp.id.indexOf("SIM")===0){
      salvouHist.current=true;
      const tot=Math.min(lim||0,(qs||[]).length);
      const liq = penalidade ? Math.max(0,ac-er) : ac;
      const pc = tot>0 ? Math.round((liq/tot)*100) : 0;
      const h=carregarHist();
      h.push({data:new Date().toISOString(), titulo:tp.t||"Simulado", total:tot, acertos:ac, erros:er, pct:pc, tempo:t});
      salvarHist(h.slice(-50));
    }
  },[fim]);

  if(!qs||qs.length===0) return(
    <div style={{textAlign:"center",padding:40}}>
      <div style={{fontSize:44,marginBottom:12}}>🚧</div>
      <h3 style={{color:C.gold,marginBottom:8}}>Questoes em elaboracao</h3>
      <p style={{color:C.muted,marginBottom:20}}>Em breve mais questoes para este topico.</p>
      <button onClick={onBack} style={{background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>Voltar</button>
    </div>
  );

  if(!lim){
    const mx=qs.length;
    const opts=[...new Set([5,10,20,mx].filter(v=>v<=mx))];
    return(
      <div style={{maxWidth:480,margin:"0 auto",textAlign:"center"}}>
        <button onClick={onBack} style={{display:"block",margin:"0 0 16px",background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:12}}>← Voltar</button>
        <div style={{background:C.card,border:`1px solid ${C.gold}44`,borderRadius:12,padding:28}}>
          <div style={{fontSize:44,marginBottom:10}}>🎯</div>
          <h3 style={{color:C.goldL,margin:"0 0 6px"}}>{tp.t}</h3>
          <p style={{color:C.muted,fontSize:13,margin:"0 0 24px"}}>{mx} questoes FCC disponiveis (2018-2025)</p>
          <p style={{color:C.text,fontSize:14,marginBottom:20,fontWeight:600}}>Quantas questoes deseja praticar?</p>
          <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",marginBottom:16}}>
            {opts.map(n=>(
              <button key={n} onClick={()=>setLim(n)}
                style={{background:n===mx?C.gold:C.card2,color:n===mx?"#000":C.text,border:`2px solid ${n===mx?C.gold:C.border}`,borderRadius:10,padding:"14px 20px",cursor:"pointer",fontSize:17,fontWeight:700,minWidth:70}}>
                {n}{n===mx?" ✨":""}
              </button>
            ))}
          </div>
          <p style={{color:C.muted,fontSize:11}}>Com cronometro, gabarito comentado e contador de acertos/erros</p>
          {exame&&<p style={{color:"#f59e0b",fontSize:11,marginTop:8}}>⏱ Modo prova: tempo-limite de 3 min/questao (contagem regressiva). Ao escolher a quantidade, o cronometro inicia e encerra sozinho ao zerar.</p>}
          {penalidade&&<p style={{color:C.orange,fontSize:11,marginTop:8}}>⚠️ Modo Cebraspe ativo: cada erro anula um acerto</p>}
        </div>
      </div>
    );
  }

  const sel_qs=qs.slice(0,lim);
  const q=sel_qs[idx];

  const confirmar=()=>{
    if(!sel) return;
    const erradas=carregarErradas();
    const sig=sigQ(q);
    const disc=discDaSig(sig);
    const stats=carregarStats();
    if(!stats[disc]) stats[disc]={ac:0,er:0};
    if(sel===q.g){
      setAc(a=>a+1);
      stats[disc].ac++;
      // acertou agora: remove da lista de erradas
      if(erradas[sig]){ delete erradas[sig]; salvarErradas(erradas); }
    } else {
      setEr(e=>e+1);
      stats[disc].er++;
      // registra questao errada por assinatura do enunciado
      if(!erradas[sig]){ erradas[sig]=1; salvarErradas(erradas); }
    }
    salvarStats(stats);
    setShow(true);
  };

  const proxima=()=>{
    setTipoErroSel(null);
    if(idx+1>=sel_qs.length){ setFim(true); clearInterval(ref.current); }
    else{ setIdx(i=>i+1); setSel(null); setShow(false); }
  };

  if(fim){
    const liquido = penalidade ? Math.max(0, ac - er) : ac;
    const pct=Math.round((liquido/sel_qs.length)*100);
    return(
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <div style={{background:C.card,border:`2px solid ${pct>=60?C.green:C.red}`,borderRadius:14,padding:28,textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:52,marginBottom:8}}>{pct>=70?"🏆":pct>=50?"📚":"💪"}</div>
          <h2 style={{color:pct>=60?C.green:C.red,margin:"0 0 4px"}}>{pct>=70?"Excelente!":pct>=50?"Bom progresso!":"Continue estudando!"}</h2>
          <p style={{color:C.muted,marginBottom:8,fontSize:13}}>{tp.t}</p>
          {penalidade&&<p style={{color:C.orange,fontSize:12,marginBottom:16}}>⚠️ Modo Cebraspe: cada erro anulou um acerto (liquido: {ac}-{er}={liquido})</p>}
          <div style={{display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap",marginBottom:20}}>
            {[["✅ Acertos",ac,C.green],["❌ Erros",er,C.red],["⏱ Tempo",fmtT(t),C.blue],["📊 Aproveit.",pct+"%",pct>=60?C.gold:C.red]].map(([l,v,col])=>(
              <div key={l} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 18px",textAlign:"center",minWidth:80}}>
                <div style={{fontSize:24,fontWeight:700,color:col}}>{v}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{height:8,background:C.border,borderRadius:4,maxWidth:380,margin:"0 auto"}}>
            <div style={{height:"100%",width:`${pct}%`,background:pct>=70?C.green:pct>=50?"#f59e0b":C.red,borderRadius:4}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>{setIdx(0);setSel(null);setShow(false);setAc(0);setEr(0);setT(0);setFim(false);}}
            style={{background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>
            🔄 Refazer
          </button>
          <button onClick={()=>{setLim(null);setIdx(0);setSel(null);setShow(false);setAc(0);setEr(0);setT(0);setFim(false);}}
            style={{background:"transparent",color:C.gold,border:`1px solid ${C.gold}`,borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>
            ↩ Nova quantidade
          </button>
          <button onClick={onBack}
            style={{background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>
            ← Topico
          </button>
        </div>
      </div>
    );
  }

  return(
    <div style={{maxWidth:700,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <button onClick={onBack} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12}}>← Voltar</button>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <span style={{color:C.green,fontWeight:700,fontSize:14}}>✅ {ac}</span>
          <span style={{color:C.red,fontWeight:700,fontSize:14}}>❌ {er}</span>
          <span style={{fontFamily:"monospace",fontSize:19,fontWeight:700,color:exame?(restante<=limiteSeg*0.1?C.red:restante<=limiteSeg*0.25?"#f59e0b":C.green):(t>300?C.red:C.green)}}>⏱ {exame?fmtT(restante):fmtT(t)}</span>
        </div>
        <span style={{fontSize:12,color:C.muted}}>Q{idx+1}/{sel_qs.length}</span>
      </div>

      <div style={{height:4,background:C.border,borderRadius:2,marginBottom:16}}>
        <div style={{height:"100%",width:`${((idx+1)/sel_qs.length)*100}%`,background:C.gold,borderRadius:2,transition:"width 0.3s"}}/>
      </div>

      <div style={{background:C.card,border:`1px solid ${show?(sel===q.g?C.green:C.red):C.border}`,borderRadius:12,padding:20,transition:"border-color 0.3s"}}>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
          <span style={{background:"#1e3a5f",color:"#7bb3e8",padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700}}>Q{idx+1}</span>
          {(() => {
            const f = fonteQuestao(q);
            return (
              <span title={f.real?"Questao baseada em prova/banca real":"Questao inedita no estilo da banca"}
                style={{display:"inline-flex",alignItems:"center",gap:4,background:f.real?"#0f2647":"#2a2440",border:`1px solid ${f.real?"#1e3a5f":"#4a3d6b"}`,color:f.real?"#7bb3e8":"#c4a9e8",padding:"2px 9px",borderRadius:12,fontSize:10.5,fontWeight:700}}>
                {f.icone} {f.texto}
              </span>
            );
          })()}
        </div>
        <p style={{fontSize:13,color:C.text,lineHeight:1.85,marginBottom:16}}>{q.q}</p>

        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {q.o.map((alt,j)=>{
            const L=alt[0];
            const isSel=sel===L;
            const isCorr=show&&L===q.g;
            const isErr=show&&isSel&&L!==q.g;
            let bg="transparent",bdr=C.border,col=C.text;
            if(isCorr){bg="#16a34a22";bdr=C.green;col=C.green;}
            else if(isErr){bg="#dc262222";bdr=C.red;col=C.red;}
            else if(isSel&&!show){bg=C.gold+"22";bdr=C.gold;col=C.gold;}
            else if(show){col=C.muted;}
            return(
              <div key={j} onClick={()=>!show&&setSel(L)}
                style={{background:bg,border:`2px solid ${bdr}`,borderRadius:8,padding:"10px 14px",cursor:show?"default":"pointer",color:col,fontSize:13,lineHeight:1.65,transition:"all 0.15s"}}>
                {alt}{isCorr?" ✅":isErr?" ❌":""}
              </div>
            );
          })}
        </div>

        {!show&&(
          <div style={{textAlign:"center"}}>
            <button onClick={confirmar} disabled={!sel}
              style={{background:sel?C.gold:"#2d3748",color:sel?"#000":C.muted,border:"none",borderRadius:8,padding:"11px 28px",cursor:sel?"pointer":"not-allowed",fontWeight:700,fontSize:14}}>
              {sel?"✓ Confirmar Resposta":"Selecione uma alternativa"}
            </button>
          </div>
        )}

        {show&&(
          <div>
            <div style={{background:sel===q.g?"#16a34a22":"#dc262222",border:`2px solid ${sel===q.g?C.green:C.red}`,borderRadius:10,padding:"12px 16px",marginBottom:12}}>
              <div style={{fontWeight:700,fontSize:17,color:sel===q.g?C.green:C.red,marginBottom:sel!==q.g?6:0}}>
                {sel===q.g?"✅ Voce acertou! 🎯":"❌ Voce errou!"}
              </div>
              {sel!==q.g&&<div style={{fontSize:12,color:C.text}}>Resposta correta: <strong style={{color:C.green}}>{q.g}</strong></div>}
            </div>
            {sel!==q.g&&(
              <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                <div style={{fontSize:12.5,fontWeight:700,color:C.text,marginBottom:8}}>Por que voce errou? <span style={{color:C.muted,fontWeight:400}}>(ajuda a identificar seu padrao)</span></div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {TIPOS_ERRO.map(t=>(
                    <button key={t.id} onClick={()=>{ if(tipoErroSel) return; setTipoErroSel(t.id); registrarTipoErro(t.id); }}
                      disabled={!!tipoErroSel}
                      style={{padding:"6px 11px",borderRadius:14,fontSize:11.5,fontWeight:700,
                        cursor:tipoErroSel?"default":"pointer",
                        border:`1px solid ${tipoErroSel===t.id?t.cor:C.border}`,
                        background:tipoErroSel===t.id?t.cor+"22":"transparent",
                        color:tipoErroSel===t.id?t.cor:(tipoErroSel?C.muted:C.text),
                        opacity:(tipoErroSel&&tipoErroSel!==t.id)?0.4:1}}>
                      {t.icone} {t.n}
                    </button>
                  ))}
                </div>
                {tipoErroSel&&<div style={{fontSize:11,color:C.green,marginTop:8}}>✓ Registrado. Veja seu padrao de erros no painel Desempenho.</div>}
              </div>
            )}
            <div style={{background:"#0f2647",border:"1px solid #1e3a5f",borderRadius:8,padding:"12px 14px",marginBottom:14}}>
              <div style={{fontWeight:700,color:"#7bb3e8",marginBottom:6,fontSize:12}}>📖 Gabarito Comentado</div>
              <p style={{margin:0,fontSize:12,color:C.text,lineHeight:1.85}}>{q.c}</p>
            </div>
            <div style={{textAlign:"right"}}>
              <button onClick={proxima}
                style={{background:idx+1>=sel_qs.length?C.green:C.gold,color:"#000",border:"none",borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700,fontSize:13}}>
                {idx+1>=sel_qs.length?"📊 Ver Resultado":"Proxima Questao →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FLASHCARD ─────────────────────────────────────────
function Flashcard({tp, onBack}){
  const [virado,setVirado]=useState(false);
  const linhas=R[tp.id]||["Conteudo em elaboracao para este topico."];

  return(
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <button onClick={onBack} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",marginBottom:14,fontSize:12}}>← Voltar</button>

      <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:10,padding:"12px 16px",marginBottom:14}}>
        <h3 style={{color:C.goldL,margin:"0 0 2px",fontSize:15}}>{tp.t}</h3>
        <p style={{color:C.muted,margin:0,fontSize:11}}>Toque no card para ver o resumo completo</p>
      </div>

      {/* Card interativo */}
      <div onClick={()=>setVirado(v=>!v)}
        style={{cursor:"pointer",minHeight:280,borderRadius:14,padding:24,marginBottom:14,background:virado?"#0a1f40":C.card,border:`2px solid ${virado?C.blue:C.gold}`,transition:"all 0.3s",boxShadow:virado?"0 0 30px #3b82f622":"0 0 20px #c8a95122"}}>
        {!virado?(
          <div style={{textAlign:"center",paddingTop:40}}>
            <div style={{fontSize:52,marginBottom:16}}>📇</div>
            <div style={{fontSize:19,fontWeight:700,color:C.goldL,lineHeight:1.4,maxWidth:380,margin:"0 auto"}}>{tp.t}</div>
            <div style={{marginTop:20,color:C.muted,fontSize:13}}>👆 Toque para ver o resumo</div>
          </div>
        ):(
          <div>
            <div style={{fontSize:11,color:C.blue,marginBottom:14,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>📖 RESUMO COMPLETO</div>
            {linhas.map((l,i)=>{
              if(l==="") return <div key={i} style={{height:10}}/>;
              const isTitle=l.startsWith("##");
              const isSub=l.startsWith("*")||l.startsWith("-");
              const isDica=l.startsWith("DICA");
              return(
                <div key={i} style={{marginBottom:isTitle?8:3,paddingLeft:isSub?12:0}}>
                  <span style={{fontSize:isTitle?14:12,fontWeight:isTitle?700:isDica?700:400,color:isTitle?C.goldL:isDica?"#fbbf24":isSub?C.text:"#cbd5e1",lineHeight:1.8,fontStyle:isDica?"italic":"normal"}}>
                    {l}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <button onClick={()=>setVirado(v=>!v)}
          style={{background:virado?C.gold:C.blue,color:"#000",border:"none",borderRadius:8,padding:"10px 24px",cursor:"pointer",fontWeight:700,fontSize:13}}>
          {virado?"← Ver Titulo":"📖 Ver Resumo"}
        </button>
      </div>

      {tp.links&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
          <div style={{fontWeight:700,color:C.gold,fontSize:12,marginBottom:10}}>🔗 Fontes e Videoaulas</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {tp.links.map((l,i)=>(
              <a key={i} href={l.u} target="_blank" rel="noopener noreferrer"
                style={{background:C.card2,border:`1px solid ${C.border}`,color:"#93c5fd",borderRadius:6,padding:"5px 10px",fontSize:12,textDecoration:"none"}}>
                🌐 {l.l}
              </a>
            ))}
            {tp.yt&&tp.yt.map((l,i)=>(
              <a key={i} href={l.u} target="_blank" rel="noopener noreferrer"
                style={{background:"#1a0808",border:"1px solid #7f1d1d",color:"#fca5a5",borderRadius:6,padding:"5px 10px",fontSize:12,textDecoration:"none"}}>
                ▶️ {l.l}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── TOPICO VIEW ───────────────────────────────────────
function TopicoView({tp, corDisc, onBack}){
  const [modo,setModo]=useState(null);
  const qk=QK[tp.id]||"";
  const qs=qk?Q[qk]:null;
  const nq=qs?qs.length:0;

  const links=[
    {l:"Planalto - Legislacao",u:"https://www.planalto.gov.br"},
    {l:"STF - Jurisprudencia",u:"https://portal.stf.jus.br"},
  ];
  const yt=[
    {l:"Buscar no YouTube",u:`https://www.youtube.com/results?search_query=${encodeURIComponent(tp.t+" FCC concurso fiscal")}`},
  ];

  const tpComLinks={...tp, links, yt};

  if(modo==="fc") return <Flashcard tp={tpComLinks} onBack={()=>setModo(null)}/>;
  if(modo==="qz") return <Quiz tp={tp} qs={qs} onBack={()=>setModo(null)}/>;

  const linhasPreview=(R[tp.id]||[]).slice(0,5);

  return(
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <button onClick={onBack} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",marginBottom:14,fontSize:12}}>← Voltar</button>

      <div style={{background:C.card,border:`1px solid ${corDisc}44`,borderLeft:`4px solid ${corDisc}`,borderRadius:10,padding:"14px 16px",marginBottom:16}}>
        <h3 style={{color:C.goldL,margin:"0 0 8px",fontSize:15}}>{tp.t}</h3>
        {linhasPreview.map((l,i)=>l&&(
          <p key={i} style={{margin:"0 0 2px",fontSize:12,color:C.muted,lineHeight:1.6}}>{l}</p>
        ))}
        <p style={{margin:"6px 0 0",fontSize:11,color:C.muted,fontStyle:"italic"}}>...clique em Flashcard para ver o resumo completo</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div onClick={()=>setModo("fc")}
          style={{background:C.card,border:"2px solid #3b82f6",borderRadius:12,padding:22,cursor:"pointer",textAlign:"center",transition:"transform 0.15s,background 0.15s"}}
          onMouseOver={e=>e.currentTarget.style.background="#0d1f35"}
          onMouseOut={e=>e.currentTarget.style.background=C.card}>
          <div style={{fontSize:40,marginBottom:8}}>📇</div>
          <div style={{fontWeight:700,color:"#3b82f6",fontSize:14,marginBottom:4}}>Flashcard</div>
          <div style={{color:C.muted,fontSize:12}}>Resumo completo + links + videoaulas</div>
        </div>
        <div onClick={()=>qs&&setModo("qz")}
          style={{background:C.card,border:`2px solid ${qs?"#a855f7":C.border}`,borderRadius:12,padding:22,cursor:qs?"pointer":"default",textAlign:"center",opacity:qs?1:0.55,transition:"transform 0.15s,background 0.15s"}}
          onMouseOver={e=>{ if(qs) e.currentTarget.style.background="#1a0d35"; }}
          onMouseOut={e=>e.currentTarget.style.background=C.card}>
          <div style={{fontSize:40,marginBottom:8}}>🎯</div>
          <div style={{fontWeight:700,color:qs?"#a855f7":C.muted,fontSize:14,marginBottom:4}}>Questoes FCC</div>
          <div style={{color:C.muted,fontSize:12}}>{qs?`${nq}Q • Escolha de 5 a ${nq}`:"Em breve"}</div>
        </div>
      </div>
    </div>
  );
}

// ── DISC VIEW ─────────────────────────────────────────
function DiscView({d, onBack}){
  const [tp,setTp]=useState(null);
  const [simulado,setSimulado]=useState(false);
  if(tp) return <TopicoView tp={tp} corDisc={d.c} onBack={()=>setTp(null)}/>;
  // Simulado da disciplina: junta questoes de todos os topicos, embaralhadas
  if(simulado){
    let todas=[];
    d.tps.forEach(t=>{ const qk=QK[t.id]||""; if(qk&&Q[qk]) todas=todas.concat(Q[qk]); });
    // embaralhar (Fisher-Yates)
    const arr=[...todas];
    for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}
    return <Quiz tp={{id:"SIM-"+d.tps[0].id,t:"Simulado: "+d.n}} qs={arr} onBack={()=>setSimulado(false)} titulo={"🎯 Simulado — "+d.n}/>;
  }
  // total de questoes da disciplina
  let totalQ=0; d.tps.forEach(t=>{const qk=QK[t.id]||""; if(qk&&Q[qk]) totalQ+=Q[qk].length;});
  return(
    <div>
      <button onClick={onBack} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",marginBottom:14,fontSize:12}}>← Disciplinas</button>
      <div style={{background:C.card,border:`1px solid ${d.c}`,borderLeft:`4px solid ${d.c}`,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <h2 style={{color:d.c,margin:0,fontSize:16}}>{d.i} {d.n}</h2>
          <span style={{background:d.c+"22",border:`1px solid ${d.c}`,color:d.c,padding:"3px 10px",borderRadius:4,fontSize:11,fontWeight:700}}>{d.p}</span>
        </div>
        <p style={{margin:"6px 0 0",color:C.muted,fontSize:12}}>{d.tps.length} topico(s) — Escolha para estudar</p>
      </div>
      {totalQ>0&&(
        <button onClick={()=>setSimulado(true)}
          style={{width:"100%",background:d.c+"18",border:`1px solid ${d.c}`,color:d.c,borderRadius:10,padding:"13px",cursor:"pointer",fontWeight:700,fontSize:14,marginBottom:14,display:"flex",justifyContent:"center",alignItems:"center",gap:8}}>
          🎯 Simulado da Disciplina ({totalQ} questoes, formato prova) →
        </button>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {d.tps.map((tp,i)=>{
          const qk=QK[tp.id]||"";
          const nq=qk&&Q[qk]?Q[qk].length:0;
          return(
            <div key={i} onClick={()=>setTp(tp)}
              style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",transition:"border-color 0.2s,transform 0.15s"}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=d.c;e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div style={{fontWeight:700,color:C.text,fontSize:13}}>{tp.t}</div>
                <div style={{display:"flex",gap:6}}>
                  <span style={{background:"#3b82f622",border:"1px solid #3b82f6",color:"#3b82f6",fontSize:10,padding:"2px 7px",borderRadius:3,fontWeight:700}}>📇 Flashcard</span>
                  {nq>0&&<span style={{background:"#a855f722",border:"1px solid #a855f7",color:"#a855f7",fontSize:10,padding:"2px 7px",borderRadius:3,fontWeight:700}}>🎯 {nq}Q</span>}
                </div>
              </div>
              <p style={{margin:"6px 0 0",fontSize:11,color:C.muted,lineHeight:1.5}}>
                {(R[tp.id]||[""])[0].substring(0,90)}...
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────
const PESO_PROVA = {"Lingua Portuguesa":10,"Matematica Financeira, Estatistica e Logica":12,"Administracao Publica e Governanca":10,"Economia":10,"Direito Constitucional":4,"Direito Administrativo":4,"Direito Civil e Penal":4,"Direito Financeiro":8,"Contabilidade Geral e Publica":10,"Contabilidade Avancada e de Custos":20,"Direito Tributario":20,"Legislacao Tributaria Estadual do Ceara":20,"Fluencia de Dados":10,"Financas Publicas":10};
function embaralhar(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}

export default function FlashcardsApp(){
  const [d,setD]=useState(null);
  const [simGeral,setSimGeral]=useState(false);
  const [revErradas,setRevErradas]=useState(null);
  if(d) return <DiscView d={d} onBack={()=>setD(null)}/>;
  if(simGeral){
    // monta pool proporcional ao peso real da prova FCC
    let pool=[];
    DISC.forEach(disc=>{
      let dq=[];
      disc.tps.forEach(t=>{const qk=QK[t.id]||""; if(qk&&Q[qk]) dq=dq.concat(Q[qk]);});
      const n=PESO_PROVA[disc.n]||4;
      pool=pool.concat(embaralhar(dq).slice(0,Math.min(n,dq.length)));
    });
    pool=embaralhar(pool);
    return <Quiz tp={{id:"SIM-GERAL",t:"Simulado Geral (peso real da prova)"}} qs={pool} onBack={()=>setSimGeral(false)} titulo="🏆 Simulado Geral Multidisciplinar"/>;
  }
  if(revErradas){
    let errQ=questoesErradas();
    if(revErradas!=="ALL") errQ=errQ.filter(q=>discDaSig(sigQ(q))===revErradas);
    errQ=embaralhar(errQ);
    const rotulo = revErradas==="ALL" ? "todas as erradas" : revErradas;
    return <Quiz tp={{id:"REV-ERRADAS",t:"Revisao: "+rotulo}} qs={errQ} onBack={()=>setRevErradas(null)} titulo="🔁 Revisao das Erradas"/>;
  }
  const errList=questoesErradas();
  const nErradas=errList.length;
  const errPorDisc={};
  errList.forEach(q=>{const dn=discDaSig(sigQ(q)); errPorDisc[dn]=(errPorDisc[dn]||0)+1;});
  const errDiscOrden=Object.entries(errPorDisc).sort((a,b)=>b[1]-a[1]);
  const hist=carregarHist().slice(-8).reverse();
  // total de questoes do simulado geral (soma dos pesos, limitado ao disponivel)
  let totalGeral=0;
  DISC.forEach(disc=>{let dq=0;disc.tps.forEach(t=>{const qk=QK[t.id]||"";if(qk&&Q[qk])dq+=Q[qk].length;});totalGeral+=Math.min(PESO_PROVA[disc.n]||4,dq);});
  return(
    <div>
      <div style={{background:C.card,border:`1px solid ${C.gold}44`,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
        <h2 style={{color:C.gold,margin:"0 0 6px",fontSize:16}}>📚 Resumos e Flashcards — SEFAZ/CE 2026</h2>
        <p style={{color:C.muted,fontSize:12,lineHeight:1.7,margin:"0 0 10px"}}>
          Cobertura completa do Edital no 01/2026 (Anexo VI). 14 disciplinas com resumos didaticos, flashcards interativos e questoes FCC comentadas.
        </p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["📇 Flashcards","#3b82f6"],["🎯 Questoes FCC 2018-2025","#a855f7"],["⏱ Cronometro","#22c55e"],["📊 Acertos/Erros","#ef4444"]].map(([l,c])=>(
            <span key={l} style={{background:c+"22",border:`1px solid ${c}`,color:c,borderRadius:4,padding:"3px 10px",fontSize:11,fontWeight:700}}>{l}</span>
          ))}
        </div>
      </div>
      {/* SIMULADO GERAL MULTIDISCIPLINAR */}
      <div onClick={()=>setSimGeral(true)} style={{cursor:"pointer",background:"linear-gradient(135deg,#c8a95122,#ef444422)",border:`1px solid ${C.gold}`,borderRadius:10,padding:"15px 16px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{fontWeight:700,color:C.goldL,fontSize:15,marginBottom:3}}>🏆 Simulado Geral Multidisciplinar</div>
          <div style={{fontSize:12,color:C.muted,lineHeight:1.5}}>Junta TODAS as disciplinas no peso real da prova FCC ({totalGeral} questoes), embaralhadas, cronometrado e com gabarito comentado</div>
        </div>
        <span style={{background:C.gold,color:"#000",borderRadius:6,padding:"10px 18px",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>Iniciar →</span>
      </div>
      {/* REVISAR SO AS ERRADAS (com filtro por disciplina) */}
      <div style={{background:"linear-gradient(135deg,#ef444422,#f59e0b22)",border:`1px solid ${nErradas>0?"#ef4444":C.border}`,borderRadius:10,padding:"13px 16px",marginBottom:18,opacity:nErradas>0?1:0.65}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontWeight:700,color:"#fca5a5",fontSize:14,marginBottom:2}}>🔁 Revisar so as questoes que errei</div>
            <div style={{fontSize:12,color:C.muted}}>{nErradas>0?(nErradas+" questao(oes) acumulada(s) — refaca e elas saem da lista ao acertar"):"Nenhuma errada por enquanto. Resolva questoes e as que errar aparecem aqui."}</div>
          </div>
          {nErradas>0&&<span onClick={()=>setRevErradas("ALL")} style={{cursor:"pointer",background:"#ef4444",color:"#fff",borderRadius:6,padding:"10px 18px",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>Revisar todas ({nErradas}) →</span>}
        </div>
        {nErradas>0&&(
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:11}}>
            {errDiscOrden.map(([dn,c])=>(
              <span key={dn} onClick={()=>setRevErradas(dn)} title={"Revisar so "+dn}
                style={{cursor:"pointer",background:C.card2,border:`1px solid #ef444466`,color:"#fca5a5",borderRadius:20,padding:"4px 11px",fontSize:11,fontWeight:600}}>
                {dn} · {c}
              </span>
            ))}
          </div>
        )}
      </div>
      {/* HISTORICO / EVOLUCAO DOS SIMULADOS */}
      {hist.length>0&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",marginBottom:18}}>
          <div style={{fontWeight:700,color:C.goldL,fontSize:14,marginBottom:10}}>📈 Sua evolucao nos simulados</div>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {hist.map((h,i)=>{
              const cor=h.pct>=70?C.green:h.pct>=50?"#f59e0b":C.red;
              const dt=new Date(h.data);
              const datatxt=String(dt.getDate()).padStart(2,"0")+"/"+String(dt.getMonth()+1).padStart(2,"0")+" "+String(dt.getHours()).padStart(2,"0")+":"+String(dt.getMinutes()).padStart(2,"0");
              return(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:10,color:C.muted,minWidth:74}}>{datatxt}</span>
                  <div style={{flex:1,height:14,background:C.card2,borderRadius:7,overflow:"hidden",border:`1px solid ${C.border}`}}>
                    <div style={{height:"100%",width:`${h.pct}%`,background:cor,transition:"width 0.3s"}}/>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:cor,minWidth:38,textAlign:"right"}}>{h.pct}%</span>
                  <span style={{fontSize:10,color:C.muted,minWidth:54}}>{h.acertos}/{h.total}</span>
                </div>
              );
            })}
          </div>
          <div style={{fontSize:10,color:C.muted,marginTop:8}}>Registra automaticamente os simulados (por disciplina e geral) que voce conclui.</div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
        {DISC.map((disc,i)=>(
          <div key={i} onClick={()=>setD(disc)}
            style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${disc.c}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",transition:"transform 0.15s,border-color 0.2s"}}
            onMouseOver={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=disc.c;}}
            onMouseOut={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=C.border;}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <span style={{fontSize:22}}>{disc.i}</span>
              <span style={{background:disc.c+"22",border:`1px solid ${disc.c}`,color:disc.c,fontSize:10,padding:"2px 6px",borderRadius:3,fontWeight:700}}>{disc.p}</span>
            </div>
            <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:4,lineHeight:1.4}}>{disc.n}</div>
            <div style={{fontSize:11,color:C.muted}}>{disc.tps.length} topico(s) — Resumos + Questoes FCC →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
