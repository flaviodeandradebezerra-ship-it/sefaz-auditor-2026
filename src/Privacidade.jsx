import { useState } from "react";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035", border:"#1b2c44",
  gold:"#c8a951", goldL:"#f0d080", red:"#ef4444", green:"#22c55e",
  blue:"#3b82f6", purple:"#a855f7", muted:"#64748b", text:"#e2e8f0",
};

// Todas as chaves de dados do usuario (mesmo conjunto do backup)
const CHAVES_DADOS = [
  "sefaz_desempenho_v1","sefaz_diario_v1","sefaz_erradas_v2","sefaz_stats_disc_v1",
  "sefaz_simulados_v1","sefaz_metas_v1","sefaz_meus_editais_v1","sefaz_anotacoes_v1",
  "sefaz_config_concursos_v1","sefaz_notif_log_v1","sefaz_notif_vistas_v1",
  "sefaz_biblioteca_v1","sefaz_tipoerro_v1","sefaz_trilha_v1","sefaz_ia_cfg_v1",
];

export function apagarTodosDados() {
  let ok = true;
  CHAVES_DADOS.forEach(k => { try { localStorage.removeItem(k); } catch (e) { ok = false; } });
  return ok;
}

export default function Privacidade({ onClose }) {
  const [confirmando, setConfirmando] = useState(false);

  const apagar = () => {
    const sucesso = apagarTodosDados();
    if (sucesso) {
      alert("Todos os seus dados de estudo foram apagados deste dispositivo. O app sera recarregado.");
      window.location.reload();
    } else {
      alert("Nao foi possivel apagar todos os dados neste dispositivo.");
    }
  };

  const Secao = ({ titulo, children }) => (
    <div style={{marginBottom:16}}>
      <div style={{fontWeight:700,color:C.goldL,fontSize:13,marginBottom:5}}>{titulo}</div>
      <div style={{fontSize:12.5,color:C.text,lineHeight:1.75}}>{children}</div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.78)",zIndex:1000,overflowY:"auto",padding:"20px 12px"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:680,margin:"0 auto",background:C.bg,border:`1px solid ${C.gold}44`,borderRadius:14,padding:"20px 18px"}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <h2 style={{color:C.gold,margin:0,fontSize:18}}>🔒 Privacidade e seus dados</h2>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>

        <Secao titulo="Como seus dados ficam guardados">
          Esta plataforma foi feita para funcionar com seus dados salvos <strong>no proprio aparelho</strong> (no navegador). Seu progresso, simulados, editais, anotacoes, trilha e biblioteca <strong>nao sao enviados aos nossos servidores</strong> — ficam so com voce. Por isso, recomendamos usar o <strong>Backup</strong> (no painel Desempenho) para nao perder seus dados ao trocar de aparelho.
        </Secao>

        <Secao titulo="Recursos opcionais que tratam dados">
          <strong>Geracao de questoes por IA:</strong> se voce usar, a chave de API que cadastrar fica <strong>somente no seu aparelho</strong> e a comunicacao e feita direto com o provedor que voce escolher (OpenAI, Anthropic ou Google). Nao recebemos sua chave nem o conteudo gerado.<br/><br/>
          <strong>Login na nuvem (quando ativado):</strong> se optar por criar conta para sincronizar entre aparelhos, seu e-mail e seu progresso passam a ser guardados de forma segura no servico de nuvem. E opcional — o app funciona sem conta.
        </Secao>

        <Secao titulo="Seus direitos (LGPD - Lei 13.709/2018)">
          Voce pode acessar, corrigir, exportar (Backup) e <strong>apagar</strong> seus dados a qualquer momento. Como os dados ficam no seu aparelho, voce tem controle direto sobre eles — inclusive pelo botao abaixo.
        </Secao>

        <Secao titulo="Politica completa">
          A politica de privacidade completa esta disponivel em: <span style={{color:C.muted}}>[inserir link da politica publicada apos validacao juridica]</span>.
        </Secao>

        {/* Apagar dados */}
        <div style={{background:C.red+"12",border:`1px solid ${C.red}55`,borderRadius:10,padding:14,marginTop:18}}>
          <div style={{fontWeight:700,color:C.red,fontSize:13,marginBottom:6}}>Apagar todos os meus dados</div>
          <p style={{fontSize:12,color:C.text,lineHeight:1.6,margin:"0 0 12px"}}>
            Remove deste aparelho todo o seu progresso, simulados, editais, anotacoes, biblioteca, trilha e configuracoes. <strong>Esta acao nao pode ser desfeita.</strong> Considere fazer um Backup antes.
          </p>
          {!confirmando ? (
            <button onClick={()=>setConfirmando(true)} style={{background:"transparent",border:`1px solid ${C.red}`,color:C.red,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>
              🗑 Apagar meus dados
            </button>
          ) : (
            <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:12,color:C.text,fontWeight:600}}>Tem certeza?</span>
              <button onClick={apagar} style={{background:C.red,color:"#fff",border:"none",borderRadius:8,padding:"9px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>Sim, apagar tudo</button>
              <button onClick={()=>setConfirmando(false)} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:8,padding:"9px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Banner de consentimento exibido no primeiro acesso
export function BannerConsentimento({ onAceitar, onVerPolitica }) {
  return (
    <div style={{position:"fixed",left:0,right:0,bottom:0,zIndex:1100,background:C.card,borderTop:`2px solid ${C.gold}`,padding:"16px 18px",boxShadow:"0 -4px 20px rgba(0,0,0,0.4)"}}>
      <div style={{maxWidth:820,margin:"0 auto",display:"flex",gap:14,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{flex:1,minWidth:240,fontSize:12.5,color:C.text,lineHeight:1.6}}>
          🔒 Esta plataforma guarda seus dados de estudo <strong>no seu proprio aparelho</strong> e usa recursos opcionais (IA, nuvem) conforme a nossa Politica de Privacidade, em conformidade com a LGPD.
          <button onClick={onVerPolitica} style={{background:"transparent",border:"none",color:C.gold,cursor:"pointer",fontSize:12.5,fontWeight:700,textDecoration:"underline",padding:0,marginLeft:4}}>Ler politica</button>
        </div>
        <button onClick={onAceitar} style={{background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"11px 22px",cursor:"pointer",fontWeight:700,fontSize:14,flexShrink:0}}>
          Entendi e aceito
        </button>
      </div>
    </div>
  );
}
