import { useState, useEffect } from "react";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035",
  border:"#1b2c44", gold:"#c8a951", goldL:"#f0d080",
  red:"#ef4444", green:"#22c55e", blue:"#3b82f6",
  purple:"#a855f7", text:"#e2e8f0", muted:"#64748b",
};

const KEY_NOTAS = "sefaz_anotacoes_v1";
const KEY_EDITAIS = "sefaz_meus_editais_v1";

function carregarNotas() {
  try { const r = localStorage.getItem(KEY_NOTAS); return r ? JSON.parse(r) : []; }
  catch (e) { return []; }
}
function salvarNotas(l) { try { localStorage.setItem(KEY_NOTAS, JSON.stringify(l)); } catch (e) {} }
function carregarEditais() {
  try { const r = localStorage.getItem(KEY_EDITAIS); return r ? JSON.parse(r) : []; }
  catch (e) { return []; }
}

// Disciplinas padrao do SEFAZ-CE (caso o usuario nao escolha um edital salvo)
const DISC_PADRAO = [
  "Lingua Portuguesa","Matematica/Estatistica/Logica","Administracao Publica",
  "Economia","Direito Constitucional","Direito Administrativo","Direito Civil e Penal",
  "Direito Financeiro","Contabilidade Geral e Publica","Contabilidade Avancada e Custos",
  "Direito Tributario","Legislacao Tributaria CE","Fluencia de Dados","Financas Publicas","Outra",
];

function dataHora() {
  const d = new Date();
  return {
    iso: d.toISOString(),
    label: d.toLocaleDateString("pt-BR") + " as " + d.toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}),
  };
}

export default function Anotacoes({ onClose }) {
  const [notas, setNotas] = useState([]);
  const [editais, setEditais] = useState([]);
  const [modo, setModo] = useState("lista"); // lista | add
  const [editando, setEditando] = useState(null);

  // filtros
  const [fEdital, setFEdital] = useState("Todos");
  const [fDisc, setFDisc] = useState("Todas");
  const [busca, setBusca] = useState("");

  // form
  const [edital, setEdital] = useState("SEFAZ/CE 2026");
  const [disciplina, setDisciplina] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [texto, setTexto] = useState("");

  useEffect(() => {
    setNotas(carregarNotas());
    const eds = carregarEditais();
    setEditais(eds);
  }, []);

  const persistir = (nova) => { setNotas(nova); salvarNotas(nova); };

  // Lista de editais disponiveis (SEFAZ fixo + salvos pelo usuario)
  const opcoesEditais = ["SEFAZ/CE 2026", ...editais.map(e => e.nome)];

  // Disciplinas: se o edital escolhido for um salvo com disciplinas, usa as dele
  const discDoEdital = () => {
    const ed = editais.find(e => e.nome === edital);
    if (ed && ed.disciplinas && ed.disciplinas.length) return ed.disciplinas.map(d => d.nome).concat("Outra");
    return DISC_PADRAO;
  };

  const iniciarAdd = () => {
    setEditando(null); setEdital(opcoesEditais[0] || "SEFAZ/CE 2026");
    setDisciplina(""); setConteudo(""); setTexto(""); setModo("add");
  };

  const iniciarEdit = (n) => {
    setEditando(n.id); setEdital(n.edital); setDisciplina(n.disciplina);
    setConteudo(n.conteudo); setTexto(n.texto); setModo("add");
  };

  const salvarNota = () => {
    if (!texto.trim()) return;
    if (editando) {
      const nova = notas.map(n => n.id === editando
        ? { ...n, edital, disciplina, conteudo, texto, editadoEm: dataHora().label }
        : n);
      persistir(nova);
    } else {
      const dh = dataHora();
      const nova = [{
        id: Date.now(), edital, disciplina: disciplina || "Geral",
        conteudo: conteudo || "-", texto: texto.trim(),
        criadoIso: dh.iso, criadoEm: dh.label,
      }, ...notas];
      persistir(nova);
    }
    setModo("lista");
  };

  const excluir = (id) => persistir(notas.filter(n => n.id !== id));

  // Aplicar filtros
  const filtradas = notas.filter(n => {
    if (fEdital !== "Todos" && n.edital !== fEdital) return false;
    if (fDisc !== "Todas" && n.disciplina !== fDisc) return false;
    if (busca && !(n.texto + " " + n.conteudo + " " + n.disciplina).toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  // Agrupar por edital -> disciplina
  const grupos = {};
  filtradas.forEach(n => {
    if (!grupos[n.edital]) grupos[n.edital] = {};
    if (!grupos[n.edital][n.disciplina]) grupos[n.edital][n.disciplina] = [];
    grupos[n.edital][n.disciplina].push(n);
  });

  // Disciplinas existentes para o filtro
  const discsFiltro = ["Todas", ...Array.from(new Set(notas.map(n => n.disciplina)))];
  const editaisFiltro = ["Todos", ...Array.from(new Set(notas.map(n => n.edital)))];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,overflowY:"auto",padding:"20px 12px"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:700,margin:"0 auto",background:C.bg,border:`1px solid ${C.gold}44`,borderRadius:14,padding:"20px 18px"}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h2 style={{color:C.gold,margin:0,fontSize:17}}>📝 Anotacoes</h2>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>

        {/* ADICIONAR / EDITAR */}
        {modo === "add" && (
          <div>
            <button onClick={()=>setModo("lista")} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:12,marginBottom:14}}>← Voltar</button>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div>
                <label style={{fontSize:12,color:C.gold,fontWeight:700,display:"block",marginBottom:4}}>Edital / Concurso</label>
                <select value={edital} onChange={e=>{setEdital(e.target.value);setDisciplina("");}}
                  style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13}}>
                  {opcoesEditais.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,color:C.gold,fontWeight:700,display:"block",marginBottom:4}}>Disciplina</label>
                <select value={disciplina} onChange={e=>setDisciplina(e.target.value)}
                  style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13}}>
                  <option value="">Selecione a disciplina...</option>
                  {discDoEdital().map(d=><option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,color:C.gold,fontWeight:700,display:"block",marginBottom:4}}>Conteudo / Topico</label>
                <input value={conteudo} onChange={e=>setConteudo(e.target.value)} placeholder="Ex: Lancamento por homologacao"
                  style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13}}/>
              </div>
              <div>
                <label style={{fontSize:12,color:C.gold,fontWeight:700,display:"block",marginBottom:4}}>Sua anotacao *</label>
                <textarea value={texto} onChange={e=>setTexto(e.target.value)} rows={6} placeholder="Escreva aqui sua anotacao, resumo, duvida ou macete..."
                  style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13,resize:"vertical",lineHeight:1.6}}/>
              </div>
              <button onClick={salvarNota} disabled={!texto.trim()}
                style={{background:texto.trim()?C.gold:C.muted,color:"#000",border:"none",borderRadius:8,padding:"12px",cursor:texto.trim()?"pointer":"not-allowed",fontWeight:700,fontSize:14}}>
                {editando ? "Salvar alteracoes" : "💾 Salvar anotacao"}
              </button>
              <p style={{fontSize:11,color:C.muted,margin:0}}>A data e a hora sao registradas automaticamente. As anotacoes ficam salvas no seu dispositivo.</p>
            </div>
          </div>
        )}

        {/* LISTA */}
        {modo === "lista" && (
          <div>
            <button onClick={iniciarAdd} style={{width:"100%",background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"12px",cursor:"pointer",fontWeight:700,fontSize:14,marginBottom:14}}>
              ➕ Nova anotacao
            </button>

            {/* Filtros */}
            {notas.length > 0 && (
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
                <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="🔎 Buscar nas anotacoes..."
                  style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"8px 12px",fontSize:13}}/>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <select value={fEdital} onChange={e=>setFEdital(e.target.value)}
                    style={{flex:1,minWidth:130,background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"7px 10px",fontSize:12}}>
                    {editaisFiltro.map(o=><option key={o} value={o}>{o==="Todos"?"Todos os editais":o}</option>)}
                  </select>
                  <select value={fDisc} onChange={e=>setFDisc(e.target.value)}
                    style={{flex:1,minWidth:130,background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"7px 10px",fontSize:12}}>
                    {discsFiltro.map(o=><option key={o} value={o}>{o==="Todas"?"Todas as disciplinas":o}</option>)}
                  </select>
                </div>
              </div>
            )}

            {notas.length === 0 ? (
              <div style={{textAlign:"center",padding:30,color:C.muted}}>
                <div style={{fontSize:40,marginBottom:10}}>📝</div>
                <p style={{fontSize:13}}>Nenhuma anotacao ainda. Crie anotacoes organizadas por edital, disciplina e conteudo.</p>
              </div>
            ) : filtradas.length === 0 ? (
              <div style={{textAlign:"center",padding:20,color:C.muted,fontSize:13}}>Nenhuma anotacao encontrada com esses filtros.</div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                {Object.keys(grupos).map(ed => (
                  <div key={ed}>
                    <div style={{fontWeight:700,color:C.gold,fontSize:14,marginBottom:8,borderBottom:`1px solid ${C.border}`,paddingBottom:5}}>📋 {ed}</div>
                    {Object.keys(grupos[ed]).map(disc => (
                      <div key={disc} style={{marginBottom:10}}>
                        <div style={{fontSize:12,color:C.blue,fontWeight:700,marginBottom:6,marginLeft:2}}>📚 {disc}</div>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          {grupos[ed][disc].map(n => (
                            <div key={n.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
                              {n.conteudo && n.conteudo !== "-" && (
                                <div style={{fontSize:11,color:C.goldL,fontWeight:700,marginBottom:4}}>🔖 {n.conteudo}</div>
                              )}
                              <div style={{fontSize:13,color:C.text,lineHeight:1.65,whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{n.texto}</div>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,gap:8,flexWrap:"wrap"}}>
                                <span style={{fontSize:10,color:C.muted}}>🕐 {n.criadoEm}{n.editadoEm?" (editado "+n.editadoEm+")":""}</span>
                                <div style={{display:"flex",gap:6}}>
                                  <button onClick={()=>iniciarEdit(n)} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.blue,borderRadius:5,padding:"3px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>✏️ Editar</button>
                                  <button onClick={()=>excluir(n.id)} style={{background:"transparent",border:`1px solid ${C.red}`,color:C.red,borderRadius:5,padding:"3px 10px",cursor:"pointer",fontSize:11,fontWeight:700}}>🗑</button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
