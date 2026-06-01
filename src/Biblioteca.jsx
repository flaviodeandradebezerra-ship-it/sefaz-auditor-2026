import { useState, useEffect } from "react";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035", border:"#1b2c44",
  gold:"#c8a951", goldL:"#f0d080", red:"#ef4444", green:"#22c55e",
  blue:"#3b82f6", purple:"#a855f7", muted:"#64748b", text:"#e2e8f0", orange:"#f59e0b",
};

const KEY = "sefaz_biblioteca_v1";
const TIPOS = [
  { id:"resumo",  n:"Resumo",        cor:C.gold,   icone:"📝" },
  { id:"lei",     n:"Lei seca",      cor:C.blue,   icone:"⚖️" },
  { id:"jurisp",  n:"Jurisprudencia",cor:C.purple, icone:"🏛️" },
  { id:"macete",  n:"Macete",        cor:C.green,  icone:"💡" },
  { id:"link",    n:"Link/Material", cor:C.orange, icone:"🔗" },
];

function carregar() {
  try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : []; }
  catch (e) { return []; }
}
function salvar(itens) {
  try { localStorage.setItem(KEY, JSON.stringify(itens)); } catch (e) {}
}

export default function Biblioteca({ onClose }) {
  const [itens, setItens] = useState([]);
  const [modo, setModo] = useState("lista"); // lista | novo
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [busca, setBusca] = useState("");
  // form
  const [titulo, setTitulo] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [tipo, setTipo] = useState("resumo");
  const [conteudo, setConteudo] = useState("");
  const [link, setLink] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => { setItens(carregar()); }, []);

  const persistir = (novos) => { setItens(novos); salvar(novos); };

  const limparForm = () => {
    setTitulo(""); setDisciplina(""); setTipo("resumo"); setConteudo(""); setLink(""); setEditId(null);
  };

  const salvarItem = () => {
    if (!titulo.trim()) { alert("De um titulo ao material."); return; }
    if (editId) {
      persistir(itens.map(it => it.id === editId ? { ...it, titulo:titulo.trim(), disciplina:disciplina.trim(), tipo, conteudo:conteudo.trim(), link:link.trim() } : it));
    } else {
      const novo = {
        id: "bib_" + Date.now(),
        titulo: titulo.trim(), disciplina: disciplina.trim() || "Geral",
        tipo, conteudo: conteudo.trim(), link: link.trim(),
        criadoEm: new Date().toISOString(),
      };
      persistir([novo, ...itens]);
    }
    limparForm(); setModo("lista");
  };

  const editarItem = (it) => {
    setTitulo(it.titulo); setDisciplina(it.disciplina); setTipo(it.tipo);
    setConteudo(it.conteudo || ""); setLink(it.link || ""); setEditId(it.id);
    setModo("novo");
  };

  const removerItem = (id) => {
    if (!window.confirm("Remover este material da biblioteca?")) return;
    persistir(itens.filter(it => it.id !== id));
  };

  // disciplinas existentes (para sugestao/agrupamento)
  const disciplinas = [...new Set(itens.map(it => it.disciplina))].sort();

  const filtrados = itens.filter(it => {
    const okTipo = filtroTipo === "Todos" || it.tipo === filtroTipo;
    const q = busca.trim().toLowerCase();
    const okBusca = !q || (it.titulo + " " + it.disciplina + " " + (it.conteudo||"")).toLowerCase().includes(q);
    return okTipo && okBusca;
  });

  const tipoInfo = (id) => TIPOS.find(t => t.id === id) || TIPOS[0];

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,overflowY:"auto",padding:"20px 12px"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:720,margin:"0 auto",background:C.bg,border:`1px solid ${C.gold}44`,borderRadius:14,padding:"20px 18px"}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <h2 style={{color:C.gold,margin:0,fontSize:18}}>📚 Biblioteca de Conhecimento</h2>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <p style={{color:C.muted,fontSize:12,lineHeight:1.6,marginTop:0,marginBottom:14}}>
          Seu acervo pessoal de estudo: guarde resumos, leis secas, jurisprudencias, macetes e materiais — organizados por disciplina. Tudo fica salvo no seu aparelho e entra no backup.
        </p>

        {modo === "lista" && (
          <>
            <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <button onClick={()=>{ limparForm(); setModo("novo"); }}
                style={{background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"9px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>
                + Adicionar material
              </button>
              <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar na biblioteca..."
                style={{flex:1,minWidth:140,background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13}}/>
            </div>

            {/* filtros por tipo */}
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
              {["Todos", ...TIPOS.map(t=>t.id)].map(f => {
                const info = f==="Todos" ? {n:"Todos",cor:C.muted} : tipoInfo(f);
                return (
                  <button key={f} onClick={()=>setFiltroTipo(f)}
                    style={{padding:"5px 11px",borderRadius:14,fontSize:11.5,fontWeight:700,cursor:"pointer",
                      border:`1px solid ${filtroTipo===f?info.cor:C.border}`,
                      background:filtroTipo===f?info.cor+"22":"transparent",
                      color:filtroTipo===f?info.cor:C.muted}}>
                    {f==="Todos" ? "Todos" : (info.icone+" "+info.n)}
                  </button>
                );
              })}
            </div>

            {itens.length === 0 && (
              <div style={{textAlign:"center",padding:"30px 16px",color:C.muted}}>
                <div style={{fontSize:38,marginBottom:8}}>📚</div>
                <p style={{fontSize:13,lineHeight:1.6,margin:0}}>Sua biblioteca esta vazia.<br/>Adicione seu primeiro resumo, lei ou macete e construa seu acervo de estudo.</p>
              </div>
            )}

            {itens.length > 0 && filtrados.length === 0 && (
              <p style={{color:C.muted,fontSize:13,textAlign:"center",padding:"20px 0"}}>Nenhum material encontrado para esse filtro/busca.</p>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {filtrados.map(it => {
                const info = tipoInfo(it.tipo);
                return (
                  <div key={it.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap",marginBottom:4}}>
                          <span style={{background:info.cor+"22",border:`1px solid ${info.cor}`,color:info.cor,borderRadius:12,padding:"2px 9px",fontSize:10.5,fontWeight:700}}>{info.icone} {info.n}</span>
                          <span style={{fontSize:11,color:C.muted}}>{it.disciplina}</span>
                        </div>
                        <div style={{fontWeight:700,color:C.text,fontSize:14}}>{it.titulo}</div>
                      </div>
                      <div style={{display:"flex",gap:4,flexShrink:0}}>
                        <button onClick={()=>editarItem(it)} title="Editar" style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:12}}>✎</button>
                        <button onClick={()=>removerItem(it.id)} title="Remover" style={{background:"transparent",border:`1px solid ${C.border}`,color:C.red,borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:12}}>🗑</button>
                      </div>
                    </div>
                    {it.conteudo && <div style={{color:C.text,fontSize:12.5,lineHeight:1.7,marginTop:8,whiteSpace:"pre-wrap"}}>{it.conteudo}</div>}
                    {it.link && <a href={it.link} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:8,color:info.cor,fontSize:12,fontWeight:700,textDecoration:"none"}}>Abrir material ↗</a>}
                  </div>
                );
              })}
            </div>

            {itens.length > 0 && (
              <div style={{marginTop:16,paddingTop:12,borderTop:`1px solid ${C.border}`,fontSize:11,color:C.muted,textAlign:"center"}}>
                {itens.length} {itens.length===1?"material":"materiais"} · {disciplinas.length} {disciplinas.length===1?"disciplina":"disciplinas"}
              </div>
            )}
          </>
        )}

        {modo === "novo" && (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
              <button onClick={()=>{ limparForm(); setModo("lista"); }} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:12}}>← Voltar</button>
              <h3 style={{color:C.goldL,margin:0,fontSize:15}}>{editId ? "Editar material" : "Novo material"}</h3>
            </div>

            <label style={{fontSize:11,color:C.muted,fontWeight:700}}>Titulo *</label>
            <input value={titulo} onChange={e=>setTitulo(e.target.value)} placeholder="Ex: Principios do Direito Administrativo"
              style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13,marginTop:4,marginBottom:12,boxSizing:"border-box"}}/>

            <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:12}}>
              <div style={{flex:1,minWidth:140}}>
                <label style={{fontSize:11,color:C.muted,fontWeight:700}}>Disciplina</label>
                <input value={disciplina} onChange={e=>setDisciplina(e.target.value)} placeholder="Ex: Direito Tributario" list="bib-disc"
                  style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13,marginTop:4,boxSizing:"border-box"}}/>
                <datalist id="bib-disc">{disciplinas.map(d=><option key={d} value={d}/>)}</datalist>
              </div>
              <div style={{flex:1,minWidth:140}}>
                <label style={{fontSize:11,color:C.muted,fontWeight:700}}>Tipo</label>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>
                  {TIPOS.map(t => (
                    <button key={t.id} onClick={()=>setTipo(t.id)}
                      style={{padding:"5px 9px",borderRadius:12,fontSize:11,fontWeight:700,cursor:"pointer",
                        border:`1px solid ${tipo===t.id?t.cor:C.border}`,
                        background:tipo===t.id?t.cor+"22":"transparent",
                        color:tipo===t.id?t.cor:C.muted}}>
                      {t.icone} {t.n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label style={{fontSize:11,color:C.muted,fontWeight:700}}>Conteudo</label>
            <textarea value={conteudo} onChange={e=>setConteudo(e.target.value)} rows={7}
              placeholder="Cole ou escreva seu resumo, a lei, a jurisprudencia ou o macete aqui..."
              style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"10px 12px",fontSize:13,marginTop:4,marginBottom:12,boxSizing:"border-box",resize:"vertical",lineHeight:1.6}}/>

            <label style={{fontSize:11,color:C.muted,fontWeight:700}}>Link (opcional)</label>
            <input value={link} onChange={e=>setLink(e.target.value)} placeholder="https://... (PDF, video, artigo)"
              style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13,marginTop:4,marginBottom:16,boxSizing:"border-box"}}/>

            <button onClick={salvarItem} style={{width:"100%",background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"12px",cursor:"pointer",fontWeight:700,fontSize:14}}>
              {editId ? "Salvar alteracoes" : "Adicionar a biblioteca"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
