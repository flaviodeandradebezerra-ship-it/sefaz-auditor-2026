import { useState } from "react";
import { LEIS } from "./leisData.js";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035", border:"#1b2c44",
  gold:"#c8a951", goldL:"#f0d080", text:"#e8eef7", muted:"#64748b",
  blue:"#3b82f6", green:"#22c55e", red:"#ef4444", purple:"#a855f7", orange:"#f59e0b",
};

const SECOES = [
  {id:"leis", n:"📜 Leis Secas", cor:C.blue},
  {id:"leisComentadas", n:"📝 Leis Comentadas", cor:C.green},
  {id:"fontes", n:"📚 Fontes", cor:C.purple},
  {id:"juris", n:"⚖️ Jurisprudencias", cor:C.orange},
  {id:"jurisComentadas", n:"🔍 Juris. Comentadas", cor:C.gold},
];

export default function LeisFontes(){
  const disciplinas = Object.keys(LEIS);
  const [disc, setDisc] = useState(disciplinas[0]);
  const [sec, setSec] = useState("leis");
  const dados = LEIS[disc] || {};
  const itens = dados[sec] || [];

  return (
    <div>
      <div style={{background:C.card,border:`1px solid ${C.gold}44`,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
        <h2 style={{color:C.gold,margin:"0 0 6px",fontSize:16}}>⚖️ Leis, Fontes e Jurisprudencias</h2>
        <p style={{color:C.muted,fontSize:12,lineHeight:1.7,margin:0}}>
          Base legal de todo o conteudo programatico: leis secas e comentadas, fontes oficiais, jurisprudencias e jurisprudencias comentadas, organizadas por disciplina.
        </p>
      </div>

      {/* Seletor de disciplina */}
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,color:C.muted,marginBottom:6,fontWeight:700}}>DISCIPLINA</div>
        <select value={disc} onChange={e=>setDisc(e.target.value)}
          style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"10px 12px",fontSize:13,fontWeight:600}}>
          {disciplinas.map(d=><option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Sub-abas das 5 secoes */}
      <div style={{display:"flex",gap:7,overflowX:"auto",marginBottom:14,paddingBottom:4}}>
        {SECOES.map(s=>{
          const n = (dados[s.id]||[]).length;
          const ativo = sec===s.id;
          return (
            <button key={s.id} onClick={()=>setSec(s.id)}
              style={{whiteSpace:"nowrap",padding:"8px 13px",borderRadius:7,border:`1px solid ${ativo?s.cor:C.border}`,
                background:ativo?s.cor+"22":"transparent",color:ativo?s.cor:C.muted,cursor:"pointer",fontSize:12,fontWeight:700}}>
              {s.n} {n>0?`(${n})`:""}
            </button>
          );
        })}
      </div>

      {/* Conteudo */}
      {itens.length===0 ? (
        <div style={{textAlign:"center",color:C.muted,fontSize:13,padding:"30px 10px"}}>
          Conteudo em elaboracao para esta secao/disciplina.
        </div>
      ) : (
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {itens.map((it,i)=>{
            if(sec==="leis"){
              return (
                <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.blue}`,borderRadius:8,padding:"12px 14px"}}>
                  <div style={{color:C.blue,fontWeight:700,fontSize:13,marginBottom:5}}>{it.ref}</div>
                  <div style={{color:C.text,fontSize:13,lineHeight:1.65}}>{it.texto}</div>
                </div>
              );
            }
            if(sec==="leisComentadas"){
              return (
                <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.green}`,borderRadius:8,padding:"12px 14px"}}>
                  <div style={{color:C.green,fontWeight:700,fontSize:13,marginBottom:5}}>{it.ref}</div>
                  <div style={{color:C.text,fontSize:13,lineHeight:1.6,marginBottom:8}}>{it.texto}</div>
                  <div style={{background:C.card2,borderRadius:6,padding:"9px 11px"}}>
                    <span style={{color:C.goldL,fontSize:11,fontWeight:700}}>COMENTARIO: </span>
                    <span style={{color:C.text,fontSize:12,lineHeight:1.6}}>{it.comentario}</span>
                  </div>
                </div>
              );
            }
            if(sec==="fontes"){
              return (
                <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.purple}`,borderRadius:8,padding:"12px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                    <span style={{background:C.purple+"22",border:`1px solid ${C.purple}`,color:C.purple,fontSize:10,padding:"2px 8px",borderRadius:4,fontWeight:700}}>{it.tipo}</span>
                    <span style={{color:C.text,fontWeight:700,fontSize:13}}>{it.ref}</span>
                  </div>
                  <div style={{color:C.muted,fontSize:12,lineHeight:1.6}}>{it.desc}</div>
                </div>
              );
            }
            if(sec==="juris"){
              return (
                <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.orange}`,borderRadius:8,padding:"12px 14px"}}>
                  <div style={{color:C.orange,fontWeight:700,fontSize:13,marginBottom:5}}>{it.ref}</div>
                  <div style={{color:C.text,fontSize:13,lineHeight:1.65}}>{it.tese}</div>
                </div>
              );
            }
            // jurisComentadas
            return (
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${C.gold}`,borderRadius:8,padding:"12px 14px"}}>
                <div style={{color:C.gold,fontWeight:700,fontSize:13,marginBottom:5}}>{it.ref}</div>
                <div style={{color:C.text,fontSize:13,lineHeight:1.6,marginBottom:8,fontStyle:"italic"}}>{it.tese}</div>
                <div style={{background:C.card2,borderRadius:6,padding:"9px 11px"}}>
                  <span style={{color:C.goldL,fontSize:11,fontWeight:700}}>COMENTARIO: </span>
                  <span style={{color:C.text,fontSize:12,lineHeight:1.6}}>{it.comentario}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{marginTop:16,padding:"10px 12px",background:C.card2,borderRadius:8,fontSize:11,color:C.muted,lineHeight:1.6}}>
        ⚠️ Material de estudo sintetizado. Sempre confira o texto integral e atualizado das normas nas fontes oficiais (Planalto, SEFAZ-CE, STF, STJ) antes da prova.
      </div>
    </div>
  );
}
