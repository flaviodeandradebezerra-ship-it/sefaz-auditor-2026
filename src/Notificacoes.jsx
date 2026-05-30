import { useState, useEffect } from "react";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035", border:"#1b2c44",
  gold:"#c8a951", goldL:"#f0d080", text:"#e8eef7", muted:"#64748b",
  blue:"#3b82f6", green:"#22c55e", red:"#ef4444", purple:"#a855f7", orange:"#f59e0b",
};

const K_VISTAS = "sefaz_notif_vistas_v1";   // ids de notificacoes ja visualizadas
const INTERVALOS = [1, 7, 30, 90];

function carregar(k, fb){ try{ const r=localStorage.getItem(k); return r?JSON.parse(r):fb; }catch(e){ return fb; } }
function salvar(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function hoje(){ return new Date().toISOString().slice(0,10); }
function diasEntre(d1,d2){ return Math.floor((new Date(d2)-new Date(d1))/86400000); }

// Gera a lista de notificacoes a partir do estado atual do app
function gerarNotificacoes(){
  const N = [];
  // 1) REVISOES vencidas (curva do esquecimento)
  const dados = carregar("sefaz_desempenho_v1", {});
  let venc = 0;
  Object.keys(dados).forEach(k => {
    const d = dados[k];
    if (d && d.lastReview && d.status >= 2){
      const rc = Math.min(d.reviewCount||0, INTERVALOS.length-1);
      if (diasEntre(d.lastReview, hoje()) >= INTERVALOS[rc]) venc++;
    }
  });
  if (venc > 0) N.push({ id:"rev:"+hoje()+":"+venc, tipo:"revisao", cor:C.blue, icone:"🔁",
    titulo: venc+" revisao(oes) pendente(s) hoje",
    texto:"Topicos no ponto certo da curva do esquecimento. Abra o Desempenho > Plano de Estudos." });

  // 2) PONTOS FRACOS (aproveitamento < 60% com base relevante)
  const stats = carregar("sefaz_stats_disc_v1", {});
  Object.entries(stats).forEach(([disc, s]) => {
    const tot = (s.ac||0)+(s.er||0);
    const pct = tot>0 ? Math.round((s.ac/tot)*100) : 0;
    if (tot >= 5 && pct < 60){
      N.push({ id:"fraca:"+disc+":"+(pct<40?"crit":"baixo"), tipo:"aviso", cor:C.red, icone:"⚠️",
        titulo:"Ponto fraco: "+disc,
        texto:"Aproveitamento de "+pct+"% em "+tot+" questoes. Priorize esta materia e revise as erradas." });
    }
  });

  // 3) META SEMANAL em risco (passou metade da semana com pouco estudo)
  const cfg = carregar("sefaz_metas_v1", { semanalMin: 600 });
  const metaSem = cfg.semanalMin || 600;
  const diario = carregar("sefaz_diario_v1", []);
  const seteAtras = (()=>{ const dt=new Date(); dt.setDate(dt.getDate()-6); return dt.toISOString().slice(0,10); })();
  const minSem = diario.filter(x=>x.data >= seteAtras).reduce((a,b)=>a+(b.min||0),0);
  if (metaSem > 0 && minSem < metaSem){
    const falta = Math.round((metaSem - minSem)/60);
    N.push({ id:"meta:"+hoje().slice(0,7)+":"+Math.floor(minSem/60), tipo:"meta", cor:C.orange, icone:"🎯",
      titulo:"Meta semanal de estudo",
      texto:"Faltam ~"+falta+"h para a meta de "+Math.floor(metaSem/60)+"h desta semana. Bora avancar!" });
  }

  // 4) EDITAIS adicionados em Meus Editais
  const editais = carregar("sefaz_meus_editais_v1", []);
  (editais||[]).forEach((e, i) => {
    const nome = e && (e.nome || e.titulo || e.name) ? (e.nome || e.titulo || e.name) : ("Edital "+(i+1));
    N.push({ id:"edital:"+(e&&e.id?e.id:nome), tipo:"edital", cor:C.green, icone:"📑",
      titulo:"Edital selecionado: "+nome,
      texto:"Acompanhe os detalhes na aba Meus Editais." });
  });

  // 5) CONCURSOS por area de interesse (configuracoes salvas)
  const cfgConc = carregar("sefaz_config_concursos_v1", null);
  if (cfgConc && Array.isArray(cfgConc.areas) && cfgConc.areas.length){
    const detalhe = [cfgConc.esfera, cfgConc.cidade || cfgConc.uf].filter(Boolean).join(" / ");
    N.push({ id:"concursos:"+cfgConc.areas.join(",")+":"+(cfgConc.atualizadoEm||""), tipo:"concurso", cor:C.purple, icone:"🔎",
      titulo:"Monitorando concursos: "+cfgConc.areas.join(", "),
      texto:"Area de interesse"+(detalhe?(" ("+detalhe+")"):"")+" configurada. Avisaremos de novidades. Veja em Configuracoes." });
  }

  // 5b) LOG de configuracoes salvas pelo usuario (cada salvar gera um aviso)
  const cfgLog = carregar("sefaz_notif_log_v1", []);
  (cfgLog||[]).forEach(item => {
    if (item && item.id) N.push({ id:item.id, tipo:item.tipo||"config", cor:C.green, icone:"⚙️",
      titulo:item.titulo||"Configuracao salva", texto:item.texto||"" });
  });

  // 5c) NOVOS CONCURSOS do feed (atualizado pelo robo agendado), filtrados pela CONFIGURACAO do usuario
  const feed = carregar("sefaz_concursos_feed_v1", null);
  if (feed && Array.isArray(feed.concursos)){
    // area escolhida pelo usuario em Configuracoes; se nao configurou, mostra todas
    const areaSel = (cfgConc && cfgConc.area) ? cfgConc.area : null;
    const areasCustom = (cfgConc && Array.isArray(cfgConc.areasCustom)) ? cfgConc.areasCustom : [];
    const configurou = !!areaSel || areasCustom.length > 0;
    const casaCustom = (c) => {
      if (areasCustom.length === 0) return false;
      const txt = ((c.orgao||"") + " " + (c.cargo||"") + " " + (c.obs||"")).toLowerCase();
      return areasCustom.some(termo => {
        const palavras = termo.toLowerCase().split(/\s+/).filter(p => p.length >= 3);
        return palavras.length > 0 && palavras.some(p => txt.includes(p));
      });
    };
    const STATUS_LABEL = { inscricoes_abertas:"Inscricoes abertas", edital_iminente:"Edital iminente", previsto:"Previsto", detectado:"Detectado — confira a fonte", encerrado:"Encerrado" };
    const STATUS_COR = { inscricoes_abertas:C.green, edital_iminente:C.orange, previsto:C.blue, detectado:C.purple, encerrado:C.muted };
    const relevantes = feed.concursos.filter(c =>
      c.status !== "encerrado" && (!configurou || (areaSel && c.area === areaSel) || casaCustom(c))
    );
    relevantes.forEach(c => {
      const lbl = STATUS_LABEL[c.status] || "Concurso";
      const prazo = c.inscricoes ? (" · inscricoes ate "+c.inscricoes.split(" a ").pop()) : "";
      N.push({
        id:"concurso-feed:"+c.id+":"+(feed.atualizadoEm||""),
        tipo:"concurso", cor: STATUS_COR[c.status]||C.purple, icone:"🆕",
        titulo:"["+lbl+"] "+c.orgao,
        texto:(c.cargo||"")+(c.vagas?(" — "+c.vagas):"")+(c.banca&&c.banca!=="a definir"?(" · banca "+c.banca):"")+prazo
      });
    });
    // se o usuario ainda nao configurou area, sugere configurar para personalizar
    if (!configurou && relevantes.length > 0){
      N.push({ id:"dica:configurar-area", tipo:"info", cor:C.gold, icone:"⚙️",
        titulo:"Personalize seus alertas de concurso",
        texto:"Abra Configuracoes e escolha sua area de interesse para receber so os concursos que importam para voce." });
    }
  }

  // 6) DICA fixa de boas-vindas/uso (sempre presente; some apos vista)
  N.push({ id:"dica:leis-fontes", tipo:"info", cor:C.gold, icone:"⚖️",
    titulo:"Nova aba: Leis, Fontes e Jurisprudencias",
    texto:"Consulte leis secas e comentadas, fontes e jurisprudencias de todo o conteudo programatico." });

  return N;
}

export default function Notificacoes(){
  const [aberto, setAberto] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [vistas, setVistas] = useState([]);

  useEffect(() => {
    setNotifs(gerarNotificacoes());
    setVistas(carregar(K_VISTAS, []));
    // busca o feed de concursos (atualizado pelo robo agendado) e regenera
    fetch("concursos.json?ts=" + Date.now())
      .then(r => r.ok ? r.json() : null)
      .then(feed => {
        if (feed && Array.isArray(feed.concursos)){
          salvar("sefaz_concursos_feed_v1", feed);
          setNotifs(gerarNotificacoes());
        }
      })
      .catch(() => {});
  }, []);

  // recarrega ao abrir (capta mudancas de outras abas)
  const toggle = () => {
    if (!aberto){
      const novas = gerarNotificacoes();
      setNotifs(novas);
      setVistas(carregar(K_VISTAS, []));
    }
    setAberto(a => !a);
  };

  const naoLidas = notifs.filter(n => !vistas.includes(n.id));
  const qtd = naoLidas.length;

  const marcarTodasVistas = () => {
    const todas = Array.from(new Set([...vistas, ...notifs.map(n=>n.id)]));
    setVistas(todas);
    salvar(K_VISTAS, todas);
  };

  // ao abrir o painel, para de piscar: marca as atuais como vistas
  useEffect(() => {
    if (aberto && qtd > 0){
      const t = setTimeout(() => marcarTodasVistas(), 1200);
      return () => clearTimeout(t);
    }
  }, [aberto]);

  return (
    <div style={{position:"relative",display:"inline-block"}}>
      <style>{`@keyframes sefazPulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.25);opacity:.55}}`}</style>
      <button onClick={toggle} title="Notificacoes" style={{position:"relative",padding:"8px 12px",borderRadius:6,border:`1px solid ${qtd>0?C.red:C.border}`,background:"transparent",color:C.gold,cursor:"pointer",fontSize:15,fontWeight:700}}>
        🔔
        {qtd > 0 && (
          <span style={{position:"absolute",top:-7,right:-7,minWidth:18,height:18,padding:"0 5px",borderRadius:9,background:C.red,color:"#fff",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1,animation:"sefazPulse 1s infinite",boxShadow:"0 0 0 2px #0c1525"}}>{qtd>99?"99+":qtd}</span>
        )}
      </button>

      {aberto && (
        <>
          <div onClick={()=>setAberto(false)} style={{position:"fixed",inset:0,zIndex:1400}}/>
          <div style={{position:"absolute",right:0,top:"calc(100% + 8px)",width:330,maxWidth:"90vw",maxHeight:440,overflowY:"auto",background:C.card,border:`1px solid ${C.border}`,borderRadius:10,boxShadow:"0 10px 30px rgba(0,0,0,0.5)",zIndex:1401}}>
            <div style={{position:"sticky",top:0,background:C.card2,borderBottom:`1px solid ${C.border}`,padding:"11px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{color:C.gold,fontWeight:700,fontSize:14}}>🔔 Notificacoes</span>
              {notifs.length>0 && <button onClick={marcarTodasVistas} style={{background:"transparent",border:"none",color:C.blue,cursor:"pointer",fontSize:11,fontWeight:700}}>marcar lidas</button>}
            </div>
            {notifs.length === 0 ? (
              <div style={{padding:"26px 16px",textAlign:"center",color:C.muted,fontSize:13}}>Nenhuma notificacao por enquanto.</div>
            ) : (
              <div>
                {notifs.map((n,i) => {
                  const lida = vistas.includes(n.id);
                  return (
                    <div key={n.id+i} style={{display:"flex",gap:10,padding:"11px 14px",borderBottom:`1px solid ${C.border}`,background:lida?"transparent":C.card2+"88"}}>
                      <span style={{fontSize:17,flexShrink:0}}>{n.icone}</span>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          {!lida && <span style={{width:7,height:7,borderRadius:"50%",background:n.cor,flexShrink:0}}/>}
                          <span style={{color:C.text,fontWeight:700,fontSize:12.5}}>{n.titulo}</span>
                        </div>
                        <div style={{color:C.muted,fontSize:11.5,lineHeight:1.5,marginTop:3}}>{n.texto}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{padding:"9px 14px",fontSize:10,color:C.muted,textAlign:"center"}}>Os avisos sao gerados a partir do seu progresso, editais e configuracoes.</div>
          </div>
        </>
      )}
    </div>
  );
}
