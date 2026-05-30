import { useState, useEffect, useRef } from "react";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035",
  border:"#1b2c44", gold:"#c8a951", goldL:"#f0d080",
  red:"#ef4444", green:"#22c55e", blue:"#3b82f6",
  purple:"#a855f7", text:"#e2e8f0", muted:"#64748b", orange:"#f59e0b",
};

const K_DES = "sefaz_desempenho_v1";
const K_DIARIO = "sefaz_diario_v1";

// Estrutura do edital SEFAZ-CE (disciplina -> topicos)
const ESTRUTURA = [
  ["Lingua Portuguesa", ["Concordancia, Regencia e Crase","Interpretacao, Coesao e Pontuacao"]],
  ["Matematica/Estatistica/Logica", ["Juros, SAC e Price","Estatistica e Probabilidade","Raciocinio Logico"]],
  ["Administracao Publica", ["Governanca e Gestao de Riscos","Licitacoes, Improbidade e LAI"]],
  ["Economia", ["Microeconomia e Tributacao","Macroeconomia e Politicas"]],
  ["Direito Constitucional", ["Controle de Constitucionalidade e Direitos Fundamentais"]],
  ["Direito Administrativo", ["Atos, Responsabilidade e Organizacao"]],
  ["Direito Civil e Penal", ["Crimes Tributarios, Lavagem e Civel"]],
  ["Direito Financeiro", ["LRF Completa","Orcamento Publico e Lei 4.320"]],
  ["Contabilidade Geral e Publica", ["MCASP, Receita e Despesa","Estoques, Imobilizado e DRE"]],
  ["Contabilidade Avancada e Custos", ["Valor Justo, IFRS 16, Goodwill e MEP","Custos e Ponto de Equilibrio"]],
  ["Direito Tributario", ["CTN: Obrigacao, Credito e Extincao","Reforma Tributaria EC 132","Lei Kandir, CONFAZ e Simples"]],
  ["Legislacao Tributaria CE", ["ICMS-CE, ITCD, IPVA e FECOP"]],
  ["Fluencia de Dados", ["SQL, Arquitetura, LGPD"]],
  ["Financas Publicas", ["Musgrave, Bens Publicos e Resultado Fiscal"]],
];

const STATUS = [
  {id:0, n:"Nao iniciado", cor:"#64748b"},
  {id:1, n:"Estudando", cor:"#f59e0b"},
  {id:2, n:"Revisao", cor:"#3b82f6"},
  {id:3, n:"Dominado", cor:"#22c55e"},
];
const INTERVALOS = [1, 7, 30, 90]; // dias de revisao espacada

function hoje() { return new Date().toISOString().slice(0,10); }
function diasEntre(d1, d2) {
  return Math.floor((new Date(d2) - new Date(d1)) / 86400000);
}

function carregar(k, fb) {
  try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; }
  catch (e) { return fb; }
}
function salvar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

export default function Desempenho({ onClose }) {
  const [aba, setAba] = useState("vert");
  const [dados, setDados] = useState({});   // topicoKey -> {status, conf, lastReview, reviewCount}
  const [diario, setDiario] = useState([]); // sessoes {data, disc, min}

  useEffect(() => {
    setDados(carregar(K_DES, {}));
    setDiario(carregar(K_DIARIO, []));
  }, []);

  const persistDados = (d) => { setDados(d); salvar(K_DES, d); };
  const persistDiario = (d) => { setDiario(d); salvar(K_DIARIO, d); };

  // ---------- VERTICALIZADO ----------
  const cicloStatus = (key) => {
    const atual = dados[key] || { status:0, conf:0, reviewCount:0, lastReview:null };
    const novoStatus = (atual.status + 1) % 4;
    const novo = { ...atual, status: novoStatus };
    // ao marcar Revisao ou Dominado, agenda revisao
    if (novoStatus >= 2) { novo.lastReview = hoje(); }
    persistDados({ ...dados, [key]: novo });
  };
  const setConf = (key, c) => {
    const atual = dados[key] || { status:0, conf:0, reviewCount:0, lastReview:null };
    persistDados({ ...dados, [key]: { ...atual, conf: c } });
  };

  // estatisticas
  const todasKeys = [];
  ESTRUTURA.forEach(([d, tps]) => tps.forEach(t => todasKeys.push(d + " | " + t)));
  const totalTop = todasKeys.length;
  const cont = {0:0,1:0,2:0,3:0};
  todasKeys.forEach(k => { cont[(dados[k]||{}).status||0]++; });
  const pctDominado = Math.round((cont[3]/totalTop)*100);
  const pctIniciado = Math.round(((totalTop-cont[0])/totalTop)*100);

  // ---------- REVISOES ----------
  const revisoesHoje = [];
  todasKeys.forEach(k => {
    const d = dados[k];
    if (d && d.lastReview && d.status >= 2) {
      const rc = Math.min(d.reviewCount||0, INTERVALOS.length-1);
      const intervalo = INTERVALOS[rc];
      if (diasEntre(d.lastReview, hoje()) >= intervalo) revisoesHoje.push(k);
    }
  });
  const marcarRevisado = (key) => {
    const atual = dados[key];
    if (!atual) return;
    persistDados({ ...dados, [key]: { ...atual, lastReview: hoje(), reviewCount: (atual.reviewCount||0)+1 } });
  };

  // ---------- AGENDA DE REVISOES (proximas datas pela curva do esquecimento) ----------
  const agendaRevisoes = [];
  todasKeys.forEach(k => {
    const d = dados[k];
    if (d && d.lastReview && d.status >= 2) {
      const rc = Math.min(d.reviewCount||0, INTERVALOS.length-1);
      const intervalo = INTERVALOS[rc];
      const prox = new Date(d.lastReview); prox.setDate(prox.getDate() + intervalo);
      const proxStr = prox.toISOString().slice(0,10);
      const emDias = diasEntre(hoje(), proxStr);
      agendaRevisoes.push({ key:k, prox:proxStr, emDias, intervalo, rc });
    }
  });
  agendaRevisoes.sort((a,b) => a.emDias - b.emDias);

  // ---------- PLANO DE ESTUDOS AUTOMATICO ----------
  // mapeia nome de disciplina (DISC/PESO/stats) -> tem stats de acerto?
  const statsPlano = carregar("sefaz_stats_disc_v1", {});
  // 1) revisoes vencidas (prioridade maxima)
  // 2) disciplinas com pior aproveitamento (pontos fracos)
  // 3) topicos nao iniciados / em estudo (cobertura)
  const fracas = Object.entries(statsPlano).map(([disc,s]) => {
    const tot=(s.ac||0)+(s.er||0); const pct = tot>0?Math.round((s.ac/tot)*100):0;
    return { disc, pct, tot };
  }).filter(x => x.tot >= 3 && x.pct < 70).sort((a,b)=>a.pct-b.pct);
  const naoIniciados = [];
  const emEstudo = [];
  ESTRUTURA.forEach(([disc, tps]) => tps.forEach(t => {
    const k = disc + " | " + t;
    const st = (dados[k]||{}).status || 0;
    if (st === 0) naoIniciados.push(k);
    else if (st === 1) emEstudo.push(k);
  }));
  // monta lista priorizada do plano (ate ~6 acoes)
  const plano = [];
  revisoesHoje.slice(0,3).forEach(k => plano.push({ tipo:"revisao", txt:k, motivo:"Revisao vencida (curva do esquecimento)" }));
  fracas.slice(0,3).forEach(f => plano.push({ tipo:"fraca", txt:f.disc, motivo:"Ponto fraco: "+f.pct+"% de acerto em "+f.tot+" questoes" }));
  emEstudo.slice(0,2).forEach(k => plano.push({ tipo:"estudo", txt:k, motivo:"Em estudo: avance para revisao" }));
  naoIniciados.slice(0,2).forEach(k => plano.push({ tipo:"novo", txt:k, motivo:"Ainda nao iniciado: comece a cobrir o edital" }));

  // ---------- DIARIO + POMODORO ----------
  const [discPomo, setDiscPomo] = useState(ESTRUTURA[0][0]);
  const [foco, setFoco] = useState(true);       // true=foco, false=pausa
  const [seg, setSeg] = useState(25*60);
  const [rodando, setRodando] = useState(false);
  const [metaMin, setMetaMin] = useState(180);   // meta diaria 3h
  const timerRef = useRef(null);

  useEffect(() => {
    if (rodando && seg > 0) {
      timerRef.current = setInterval(() => setSeg(s => s-1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [rodando, seg]);

  useEffect(() => {
    if (seg === 0) {
      clearInterval(timerRef.current);
      setRodando(false);
      if (foco) {
        // registrar 25 min na disciplina
        const d = hoje();
        const nova = [...diario];
        const ix = nova.findIndex(x => x.data===d && x.disc===discPomo);
        if (ix>=0) nova[ix] = {...nova[ix], min: nova[ix].min+25};
        else nova.push({ data:d, disc:discPomo, min:25 });
        persistDiario(nova);
        setFoco(false); setSeg(5*60); // pausa 5 min
      } else {
        setFoco(true); setSeg(25*60);
      }
    }
  }, [seg]);

  const fmtT = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const minHoje = diario.filter(x=>x.data===hoje()).reduce((s,x)=>s+x.min,0);
  // streak (dias consecutivos com estudo)
  const diasComEstudo = Array.from(new Set(diario.map(x=>x.data))).sort().reverse();
  let streak = 0;
  let ref = hoje();
  for (const d of diasComEstudo) {
    if (d === ref) { streak++; const dt=new Date(ref); dt.setDate(dt.getDate()-1); ref=dt.toISOString().slice(0,10); }
    else break;
  }
  // horas por disciplina (total)
  const porDisc = {};
  diario.forEach(x => { porDisc[x.disc] = (porDisc[x.disc]||0) + x.min; });
  const totalMin = Object.values(porDisc).reduce((a,b)=>a+b,0);
  // minutos da semana corrente (ultimos 7 dias, incluindo hoje)
  const seteDiasAtras = (() => { const dt=new Date(); dt.setDate(dt.getDate()-6); return dt.toISOString().slice(0,10); })();
  const minSemana = diario.filter(x => x.data >= seteDiasAtras).reduce((s,x)=>s+x.min,0);
  // meta semanal (config do usuario, em minutos; default 600 = 10h)
  const cfg = carregar("sefaz_metas_v1", { semanalMin: 600 });
  const metaSemanalMin = cfg.semanalMin || 600;
  const salvarMetaSemanal = (min) => { salvar("sefaz_metas_v1", { ...cfg, semanalMin: min }); setDados({...dados}); };
  // questoes resolvidas (para comparativo de aprovacao)
  const statsAll = carregar("sefaz_stats_disc_v1", {});
  let qAc=0, qTot=0; Object.values(statsAll).forEach(s=>{ qAc+=(s.ac||0); qTot+=(s.ac||0)+(s.er||0); });
  const aprov = qTot>0 ? Math.round((qAc/qTot)*100) : 0;

  const Btn = ({id, children}) => (
    <button onClick={()=>setAba(id)} style={{
      padding:"8px 13px", borderRadius:6, whiteSpace:"nowrap",
      border:`1px solid ${aba===id?C.gold:C.border}`,
      background:aba===id?C.gold+"22":"transparent",
      color:aba===id?C.gold:C.muted, cursor:"pointer", fontSize:12, fontWeight:700
    }}>{children}</button>
  );

  const exportarRelatorio = () => {
    const erradas = carregar("sefaz_erradas_v2", {});
    const horasTotal = (totalMin / 60).toFixed(1);
    const L = [];
    L.push("====================================================");
    L.push("  RELATORIO DE DESEMPENHO - SEFAZ/CE 2026");
    L.push("  Auditor-Fiscal | Banca FCC");
    L.push("  Gerado em: " + new Date().toLocaleString("pt-BR"));
    L.push("====================================================");
    L.push("");
    L.push("1) PLANO DE ESTUDOS SUGERIDO");
    if (plano.length === 0) {
      L.push("   (sem dados suficientes — marque status e resolva questoes)");
    } else {
      plano.forEach(function(p,i){ L.push("   " + (i+1) + ". " + p.txt + "  [" + p.motivo + "]"); });
    }
    L.push("");
    L.push("2) COBERTURA DO EDITAL");
    L.push("   " + pctDominado + "% dominado / " + pctIniciado + "% iniciado");
    L.push("");
    ESTRUTURA.forEach(function(par){
      const disc = par[0], tps = par[1];
      const keys = tps.map(function(t){ return disc + " | " + t; });
      const dom = keys.filter(function(k){ return (dados[k]||{}).status === 3; }).length;
      L.push("   " + disc + "  (" + dom + " de " + tps.length + " dominados)");
      tps.forEach(function(t){
        const dd = dados[disc + " | " + t] || { status:0, conf:0 };
        const st = STATUS[dd.status||0].n;
        const conf = dd.conf || 0;
        L.push("      - " + t + " :: " + st + " | confianca " + conf + "/3");
      });
      L.push("");
    });
    L.push("3) DIARIO DE ESTUDOS");
    L.push("   Total acumulado: " + horasTotal + "h");
    L.push("   Sequencia atual (streak): " + streak + " dia(s)");
    L.push("   Estudo hoje: " + minHoje + " min");
    L.push("   Estudo na semana (7 dias): " + Math.floor(minSemana/60) + "h" + (minSemana%60) + "m de meta de " + Math.floor(metaSemanalMin/60) + "h");
    L.push("   Aproveitamento geral em questoes: " + aprov + "% (meta de seguranca: 70%)");
    L.push("");
    L.push("   Horas por disciplina:");
    const pares = Object.entries(porDisc).sort(function(a,b){ return b[1]-a[1]; });
    if (pares.length === 0) {
      L.push("      (sem sessoes registradas)");
    } else {
      pares.forEach(function(p){ L.push("      - " + p[0] + ": " + (p[1]/60).toFixed(1) + "h"); });
    }
    L.push("");
    L.push("4) ACERTOS POR DISCIPLINA");
    const statsD = carregar("sefaz_stats_disc_v1", {});
    const ld = Object.entries(statsD).map(function(par){ const s=par[1]; const tot=(s.ac||0)+(s.er||0); const pct=tot>0?Math.round((s.ac/tot)*100):0; return { d:par[0], ac:s.ac||0, er:s.er||0, tot:tot, pct:pct }; }).filter(function(x){ return x.tot>0; }).sort(function(a,b){ return a.pct-b.pct; });
    if (ld.length === 0) {
      L.push("   (sem questoes resolvidas ainda)");
    } else {
      ld.forEach(function(x){ L.push("      - " + x.d + ": " + x.pct + "% (" + x.ac + " ac / " + x.er + " er)"); });
    }
    L.push("");
    L.push("5) QUESTOES ERRADAS (para revisao)");
    const ek = Object.keys(erradas);
    if (ek.length === 0) {
      L.push("   Nenhuma questao errada registrada. Bom trabalho!");
    } else {
      L.push("   TOTAL a revisar: " + ek.length + " questao(oes)");
      L.push("   (use 'Revisar so as erradas' na area de simulados)");
      L.push("");
      ek.slice(0, 30).forEach(function(s){ L.push("      - " + s.slice(0,80)); });
      if (ek.length > 30) L.push("      ... e mais " + (ek.length-30) + " questao(oes).");
    }
    L.push("");
    L.push("====================================================");
    L.push("  Plataforma de Estudos SEFAZ/CE 2026");
    L.push("====================================================");
    const texto = L.join("\n");
    try {
      const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "relatorio-desempenho-sefaz-ce-" + hoje() + ".txt";
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch (err) {
      try { navigator.clipboard.writeText(texto); alert("Relatorio copiado para a area de transferencia."); }
      catch (err2) { alert("Nao foi possivel exportar o relatorio neste dispositivo."); }
    }
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,overflowY:"auto",padding:"20px 12px"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:700,margin:"0 auto",background:C.bg,border:`1px solid ${C.gold}44`,borderRadius:14,padding:"20px 18px"}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h2 style={{color:C.gold,margin:0,fontSize:17}}>📊 Desempenho</h2>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button onClick={exportarRelatorio} title="Exportar relatorio" style={{background:C.gold+"18",border:`1px solid ${C.gold}`,color:C.gold,borderRadius:6,padding:"7px 12px",cursor:"pointer",fontSize:12,fontWeight:700}}>Exportar relatorio</button>
            <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
          </div>
        </div>

        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8,marginBottom:14,borderBottom:`1px solid ${C.border}`}}>
          <Btn id="vert">Edital Verticalizado</Btn>
          <Btn id="plano">Plano de Estudos {plano.length>0?`(${plano.length})`:""}</Btn>
          <Btn id="rev">Revisoes de Hoje {revisoesHoje.length>0?`(${revisoesHoje.length})`:""}</Btn>
          <Btn id="diario">Diario & Pomodoro</Btn>
          <Btn id="stats">Acertos por Disciplina</Btn>
          <Btn id="metas">Metas & Aprovacao</Btn>
        </div>

        {/* ============ VERTICALIZADO ============ */}
        {aba==="vert" && (
          <div>
            {/* resumo */}
            <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:10,padding:14,marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{fontSize:12,color:C.text}}>Cobertura do edital</span>
                <span style={{fontSize:12,color:C.green,fontWeight:700}}>{pctDominado}% dominado · {pctIniciado}% iniciado</span>
              </div>
              <div style={{height:10,background:C.border,borderRadius:5,overflow:"hidden",display:"flex"}}>
                <div style={{width:`${pctDominado}%`,background:C.green}}/>
                <div style={{width:`${pctIniciado-pctDominado}%`,background:C.orange}}/>
              </div>
              <div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>
                {STATUS.map(s=>(
                  <span key={s.id} style={{fontSize:11,color:s.cor}}>● {s.n}: {cont[s.id]}</span>
                ))}
              </div>
            </div>

            <p style={{fontSize:11,color:C.muted,marginBottom:10}}>Toque no status para avancar: Nao iniciado → Estudando → Revisao → Dominado. Defina sua confianca (estrelas).</p>

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {ESTRUTURA.map(([disc, tps], di)=>{
                const keys = tps.map(t=>disc+" | "+t);
                const dom = keys.filter(k=>(dados[k]||{}).status===3).length;
                return (
                  <div key={di} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{fontWeight:700,color:C.goldL,fontSize:13}}>{disc}</span>
                      <span style={{fontSize:10,color:C.muted}}>{dom}/{tps.length} dominados</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {tps.map((t,ti)=>{
                        const key = disc+" | "+t;
                        const d = dados[key]||{status:0,conf:0};
                        const st = STATUS[d.status||0];
                        return (
                          <div key={ti} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 10px"}}>
                            <div style={{fontSize:12,color:C.text,marginBottom:6}}>{t}</div>
                            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                              <button onClick={()=>cicloStatus(key)} style={{background:st.cor+"22",border:`1px solid ${st.cor}`,color:st.cor,borderRadius:5,padding:"3px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>● {st.n}</button>
                              <div style={{display:"flex",gap:3}}>
                                {[1,2,3].map(n=>(
                                  <span key={n} onClick={()=>setConf(key, d.conf===n?0:n)} style={{cursor:"pointer",fontSize:15,color:(d.conf||0)>=n?C.gold:C.border}}>★</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============ REVISOES ============ */}
        {aba==="rev" && (
          <div>
            <div style={{background:C.card,border:`1px solid ${C.blue}44`,borderRadius:10,padding:14,marginBottom:14}}>
              <div style={{fontWeight:700,color:C.blue,fontSize:14,marginBottom:4}}>🔁 Revisoes pendentes para hoje</div>
              <p style={{fontSize:12,color:C.muted,margin:0,lineHeight:1.6}}>Baseado na curva do esquecimento (1, 7, 30 e 90 dias). Marque os topicos em Revisao/Dominado no Verticalizado para entrarem na fila.</p>
            </div>
            {revisoesHoje.length===0 ? (
              <div style={{textAlign:"center",padding:30,color:C.muted}}>
                <div style={{fontSize:40,marginBottom:10}}>✅</div>
                <p style={{fontSize:13}}>Nenhuma revisao pendente hoje. Continue avancando no conteudo!</p>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {revisoesHoje.map((k,i)=>{
                  const [disc, t] = k.split(" | ");
                  const d = dados[k];
                  return (
                    <div key={i} style={{background:C.card,border:`1px solid ${C.blue}55`,borderRadius:8,padding:"10px 12px"}}>
                      <div style={{fontSize:11,color:C.muted}}>{disc}</div>
                      <div style={{fontSize:13,color:C.text,fontWeight:600,marginBottom:8}}>{t}</div>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <span style={{fontSize:10,color:C.muted}}>Ultima revisao ha {diasEntre(d.lastReview,hoje())} dia(s) · nivel {(d.reviewCount||0)+1}</span>
                        <button onClick={()=>marcarRevisado(k)} style={{background:C.green+"22",border:`1px solid ${C.green}`,color:C.green,borderRadius:5,padding:"4px 12px",cursor:"pointer",fontSize:11,fontWeight:700}}>✓ Revisei</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============ DIARIO + POMODORO ============ */}
        {aba==="diario" && (
          <div>
            {/* Pomodoro */}
            <div style={{background:C.card,border:`1px solid ${foco?C.gold:C.green}55`,borderRadius:12,padding:18,marginBottom:14,textAlign:"center"}}>
              <div style={{fontSize:11,color:foco?C.gold:C.green,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>{foco?"⏳ Foco":"☕ Pausa"}</div>
              <div style={{fontSize:48,fontWeight:700,color:foco?C.goldL:C.green,fontFamily:"monospace",marginBottom:10}}>{fmtT(seg)}</div>
              <select value={discPomo} onChange={e=>setDiscPomo(e.target.value)} disabled={rodando}
                style={{background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"7px 11px",fontSize:12,marginBottom:12,maxWidth:"100%"}}>
                {ESTRUTURA.map(([d])=><option key={d} value={d}>{d}</option>)}
              </select>
              <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
                <button onClick={()=>setRodando(r=>!r)} style={{background:rodando?C.red:C.gold,color:"#000",border:"none",borderRadius:8,padding:"10px 24px",cursor:"pointer",fontWeight:700,fontSize:13}}>{rodando?"⏸ Pausar":"▶ Iniciar"}</button>
                <button onClick={()=>{setRodando(false);setFoco(true);setSeg(25*60);}} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"10px 18px",cursor:"pointer",fontWeight:700,fontSize:13}}>↺ Resetar</button>
              </div>
              <p style={{fontSize:10,color:C.muted,marginTop:10}}>Tecnica Pomodoro: 25 min de foco + 5 min de pausa. Cada foco completo soma na disciplina.</p>
            </div>

            {/* Meta diaria + streak */}
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:130,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:12}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:4}}>Hoje · meta {Math.round(metaMin/60)}h</div>
                <div style={{fontSize:22,fontWeight:700,color:minHoje>=metaMin?C.green:C.gold}}>{Math.floor(minHoje/60)}h{minHoje%60}m</div>
                <div style={{height:6,background:C.border,borderRadius:3,marginTop:6,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(100,(minHoje/metaMin)*100)}%`,background:minHoje>=metaMin?C.green:C.gold}}/>
                </div>
              </div>
              <div style={{flex:1,minWidth:130,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:12,textAlign:"center"}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:4}}>Sequencia</div>
                <div style={{fontSize:22,fontWeight:700,color:C.orange}}>🔥 {streak} dia(s)</div>
              </div>
            </div>

            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <span style={{fontSize:12,color:C.text}}>Meta diaria:</span>
              <input type="range" min="60" max="600" step="30" value={metaMin} onChange={e=>setMetaMin(Number(e.target.value))} style={{flex:1,accentColor:C.gold}}/>
              <span style={{color:C.goldL,fontWeight:700,fontSize:13,minWidth:50,textAlign:"right"}}>{Math.round(metaMin/60)}h</span>
            </div>

            {/* Horas por disciplina */}
            <div style={{fontWeight:700,color:C.gold,fontSize:13,marginBottom:8}}>Horas acumuladas por disciplina</div>
            {totalMin===0 ? (
              <p style={{fontSize:12,color:C.muted}}>Ainda sem registros. Complete um Pomodoro de foco para comecar.</p>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {Object.entries(porDisc).sort((a,b)=>b[1]-a[1]).map(([d,m])=>(
                  <div key={d}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                      <span style={{color:C.text}}>{d}</span>
                      <span style={{color:C.muted}}>{Math.floor(m/60)}h{m%60}m</span>
                    </div>
                    <div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(m/totalMin)*100}%`,background:C.blue}}/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {aba==="stats" && (() => {
          const stats = carregar("sefaz_stats_disc_v1", {});
          const linhas = Object.entries(stats).map(([disc, s]) => {
            const tot = (s.ac||0) + (s.er||0);
            const pct = tot > 0 ? Math.round((s.ac/tot)*100) : 0;
            return { disc, ac:s.ac||0, er:s.er||0, tot, pct };
          }).filter(x => x.tot > 0).sort((a,b) => a.pct - b.pct);
          const totGeral = linhas.reduce((s,x)=>s+x.tot,0);
          const acGeral = linhas.reduce((s,x)=>s+x.ac,0);
          const pctGeral = totGeral>0 ? Math.round((acGeral/totGeral)*100) : 0;
          return (
            <div>
              <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{fontSize:13,color:C.text,marginBottom:4}}>Aproveitamento geral nas questoes resolvidas</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1,height:12,background:C.border,borderRadius:6,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pctGeral}%`,background:pctGeral>=70?C.green:pctGeral>=50?"#f59e0b":C.red}}/>
                  </div>
                  <span style={{fontSize:15,fontWeight:700,color:pctGeral>=70?C.green:pctGeral>=50?"#f59e0b":C.red}}>{pctGeral}%</span>
                </div>
                <div style={{fontSize:11,color:C.muted,marginTop:5}}>{acGeral} acertos em {totGeral} questoes respondidas</div>
              </div>
              {linhas.length === 0 ? (
                <div style={{textAlign:"center",color:C.muted,fontSize:13,padding:"24px 10px"}}>Resolva questoes nos simulados/topicos para ver aqui o seu aproveitamento por disciplina (as materias que voce mais erra aparecem primeiro).</div>
              ) : (
                <div>
                  <div style={{fontSize:12,color:C.muted,marginBottom:10}}>Ordenado das materias que voce <strong style={{color:C.red}}>mais erra</strong> para as que mais acerta — priorize as primeiras.</div>
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {linhas.map((x,i)=>{
                      const cor = x.pct>=70?C.green:x.pct>=50?"#f59e0b":C.red;
                      return (
                        <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6,gap:8}}>
                            <span style={{fontSize:12,color:C.text,fontWeight:600}}>{x.disc}</span>
                            <span style={{fontSize:13,fontWeight:700,color:cor}}>{x.pct}%</span>
                          </div>
                          <div style={{height:8,background:C.border,borderRadius:4,overflow:"hidden",marginBottom:4}}>
                            <div style={{height:"100%",width:`${x.pct}%`,background:cor}}/>
                          </div>
                          <div style={{fontSize:10,color:C.muted}}>✅ {x.ac} acertos · ❌ {x.er} erros · {x.tot} resolvidas</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
        {aba==="metas" && (() => {
          const pctSem = metaSemanalMin>0 ? Math.min(100, Math.round((minSemana/metaSemanalMin)*100)) : 0;
          const corSem = pctSem>=100?C.green:pctSem>=60?"#f59e0b":C.red;
          const opcoes = [300,600,900,1200,1500];
          // meta de aprovacao FCC: tipicamente ~70% de aproveitamento como referencia de seguranca
          const META_APROV = 70;
          const corAprov = aprov>=META_APROV?C.green:aprov>=50?"#f59e0b":C.red;
          const faltam = Math.max(0, META_APROV - aprov);
          return (
            <div>
              {/* META SEMANAL DE ESTUDO */}
              <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{fontWeight:700,color:C.goldL,fontSize:14,marginBottom:8}}>🎯 Meta semanal de estudo</div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <div style={{flex:1,height:14,background:C.border,borderRadius:7,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pctSem}%`,background:corSem,transition:"width 0.3s"}}/>
                  </div>
                  <span style={{fontSize:15,fontWeight:700,color:corSem,minWidth:44,textAlign:"right"}}>{pctSem}%</span>
                </div>
                <div style={{fontSize:12,color:C.muted,marginBottom:10}}>
                  {Math.floor(minSemana/60)}h{minSemana%60}m estudadas nos ultimos 7 dias · meta de {Math.floor(metaSemanalMin/60)}h
                  {pctSem>=100 ? " — meta batida! 🎉" : " — faltam " + Math.floor((metaSemanalMin-minSemana)/60) + "h" + ((metaSemanalMin-minSemana)%60) + "m"}
                </div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {opcoes.map(o=>(
                    <button key={o} onClick={()=>salvarMetaSemanal(o)}
                      style={{background:metaSemanalMin===o?C.gold:C.card2,color:metaSemanalMin===o?"#000":C.text,border:`1px solid ${metaSemanalMin===o?C.gold:C.border}`,borderRadius:6,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700}}>
                      {o/60}h/sem
                    </button>
                  ))}
                </div>
              </div>
              {/* COMPARATIVO VS META DE APROVACAO */}
              <div style={{background:C.card,border:`1px solid ${corAprov}55`,borderRadius:10,padding:14}}>
                <div style={{fontWeight:700,color:C.goldL,fontSize:14,marginBottom:4}}>🏁 Sua evolucao vs. meta de aprovacao</div>
                <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Referencia de seguranca: <strong style={{color:C.text}}>{META_APROV}%</strong> de aproveitamento (provas FCC para fiscais costumam exigir alto acerto na ampla concorrencia).</div>
                <div style={{position:"relative",height:26,background:C.border,borderRadius:13,overflow:"hidden",marginBottom:6}}>
                  <div style={{height:"100%",width:`${aprov}%`,background:corAprov,transition:"width 0.3s"}}/>
                  <div style={{position:"absolute",top:0,bottom:0,left:`${META_APROV}%`,width:2,background:C.gold}}/>
                  <div style={{position:"absolute",top:0,bottom:0,left:0,right:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.text}}>{aprov}% de acerto</div>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.muted,marginBottom:10}}>
                  <span>0%</span><span style={{color:C.gold}}>meta {META_APROV}%</span><span>100%</span>
                </div>
                {qTot===0 ? (
                  <div style={{fontSize:12,color:C.muted}}>Resolva questoes nos simulados para acompanhar sua evolucao rumo a meta.</div>
                ) : aprov>=META_APROV ? (
                  <div style={{fontSize:13,color:C.green,fontWeight:600}}>✅ Voce ja esta na faixa de seguranca ({aprov}%) com base em {qTot} questoes resolvidas. Mantenha o ritmo e amplie a constancia!</div>
                ) : (
                  <div style={{fontSize:13,color:C.text}}>Faltam <strong style={{color:corAprov}}>{faltam} pontos percentuais</strong> para a faixa de seguranca. Use a aba <strong>Acertos por Disciplina</strong> para atacar as materias que voce mais erra. ({qTot} questoes resolvidas)</div>
                )}
              </div>
            </div>
          );
        })()}
        {aba==="plano" && (() => {
          const corTipo = { revisao:"#3b82f6", fraca:"#ef4444", estudo:"#f59e0b", novo:"#64748b" };
          const iconeTipo = { revisao:"🔁", fraca:"⚠️", estudo:"📖", novo:"➕" };
          return (
            <div>
              {/* PLANO AUTOMATICO */}
              <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:10,padding:14,marginBottom:14}}>
                <div style={{fontWeight:700,color:C.goldL,fontSize:14,marginBottom:4}}>🧭 Plano de estudos sugerido para hoje</div>
                <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Gerado a partir das suas revisoes vencidas, dos pontos fracos (questoes) e da cobertura do edital. Atualiza sozinho conforme voce evolui.</div>
                {plano.length === 0 ? (
                  <div style={{fontSize:13,color:C.muted,padding:"10px 0"}}>Sem dados suficientes ainda. Marque o status dos topicos no Edital Verticalizado e resolva questoes nos simulados — o plano aparece aqui automaticamente.</div>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {plano.map((p,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,background:C.card2,border:`1px solid ${corTipo[p.tipo]}44`,borderRadius:8,padding:"10px 12px"}}>
                        <span style={{fontSize:16}}>{iconeTipo[p.tipo]}</span>
                        <div style={{flex:1}}>
                          <div style={{fontSize:13,color:C.text,fontWeight:600,marginBottom:2}}>{i+1}. {p.txt}</div>
                          <div style={{fontSize:11,color:corTipo[p.tipo]}}>{p.motivo}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* AGENDA / NOTIFICACOES DE REVISAO */}
              <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
                <div style={{fontWeight:700,color:C.goldL,fontSize:14,marginBottom:4}}>🔔 Agenda de revisoes (curva do esquecimento)</div>
                <div style={{fontSize:11,color:C.muted,marginBottom:12}}>Proximas revisoes nos intervalos 1 / 7 / 30 / 90 dias. Marque um topico como Revisao/Dominado no verticalizado para ele entrar aqui.</div>
                {agendaRevisoes.length === 0 ? (
                  <div style={{fontSize:13,color:C.muted}}>Nenhuma revisao agendada ainda.</div>
                ) : (
                  <div style={{display:"flex",flexDirection:"column",gap:7}}>
                    {agendaRevisoes.slice(0,12).map((a,i)=>{
                      const venceu = a.emDias <= 0;
                      const cor = venceu ? C.red : a.emDias <= 2 ? "#f59e0b" : C.green;
                      const quando = venceu ? "vencida — revise hoje!" : a.emDias === 1 ? "amanha" : "em " + a.emDias + " dias";
                      const dt = new Date(a.prox);
                      const dstr = String(dt.getDate()).padStart(2,"0")+"/"+String(dt.getMonth()+1).padStart(2,"0");
                      return (
                        <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                          <span style={{width:9,height:9,borderRadius:"50%",background:cor,flexShrink:0}}/>
                          <span style={{flex:1,fontSize:12,color:C.text}}>{a.key}</span>
                          <span style={{fontSize:11,color:cor,fontWeight:600,whiteSpace:"nowrap"}}>{dstr} ({quando})</span>
                          {venceu && <button onClick={()=>marcarRevisado(a.key)} style={{background:C.blue,color:"#fff",border:"none",borderRadius:5,padding:"4px 9px",cursor:"pointer",fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>✓ revisei</button>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
