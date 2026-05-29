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
    L.push("1) COBERTURA DO EDITAL");
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
    L.push("2) DIARIO DE ESTUDOS");
    L.push("   Total acumulado: " + horasTotal + "h");
    L.push("   Sequencia atual (streak): " + streak + " dia(s)");
    L.push("   Estudo hoje: " + minHoje + " min");
    L.push("");
    L.push("   Horas por disciplina:");
    const pares = Object.entries(porDisc).sort(function(a,b){ return b[1]-a[1]; });
    if (pares.length === 0) {
      L.push("      (sem sessoes registradas)");
    } else {
      pares.forEach(function(p){ L.push("      - " + p[0] + ": " + (p[1]/60).toFixed(1) + "h"); });
    }
    L.push("");
    L.push("3) QUESTOES ERRADAS (para revisao)");
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
          <Btn id="rev">Revisoes de Hoje {revisoesHoje.length>0?`(${revisoesHoje.length})`:""}</Btn>
          <Btn id="diario">Diario & Pomodoro</Btn>
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
      </div>
    </div>
  );
}
