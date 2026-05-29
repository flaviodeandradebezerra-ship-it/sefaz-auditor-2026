import { useState } from "react";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035",
  border:"#1b2c44", gold:"#c8a951", goldL:"#f0d080",
  red:"#ef4444", green:"#22c55e", blue:"#3b82f6",
  purple:"#a855f7", text:"#e2e8f0", muted:"#64748b",
};

// Areas de concurso
const AREAS = [
  {id:"fiscal", n:"Fiscal / Tributacao", q:"auditor fiscal tributacao receita sefaz"},
  {id:"tribunais", n:"Tribunais (TJ, TRT, TRF, TRE)", q:"tribunal analista tecnico judiciario"},
  {id:"magistratura", n:"Magistratura (Juiz)", q:"magistratura juiz concurso"},
  {id:"policial", n:"Policial / Seguranca", q:"policia civil militar penal delegado"},
  {id:"saude", n:"Saude", q:"saude enfermeiro medico tecnico"},
  {id:"conselhos", n:"Conselhos de Classe", q:"conselho regional CRM CRC CREA concurso"},
  {id:"agencias", n:"Agencias Reguladoras", q:"agencia reguladora ANS ANEEL ANATEL concurso"},
  {id:"bancos", n:"Bancos Publicos", q:"banco do brasil caixa BNB escriturario concurso"},
  {id:"controle", n:"Controle (TCU, TCE, CGU)", q:"tribunal de contas auditor controle"},
  {id:"legislativo", n:"Legislativo (Camara, Assembleia)", q:"camara assembleia legislativa analista"},
  {id:"administrativa", n:"Administrativa / Geral", q:"analista administrativo tecnico concurso"},
];

// Escolaridade
const ESCOLARIDADE = [
  {id:"fundamental", n:"Fundamental"},
  {id:"medio", n:"Medio / Tecnico"},
  {id:"superior", n:"Superior"},
];

// Esferas
const ESFERAS = [
  {id:"federal", n:"Federal"},
  {id:"estadual", n:"Estadual"},
  {id:"municipal", n:"Municipal"},
];

// Estados brasileiros
const ESTADOS = [
  {uf:"AC",n:"Acre"},{uf:"AL",n:"Alagoas"},{uf:"AP",n:"Amapa"},{uf:"AM",n:"Amazonas"},
  {uf:"BA",n:"Bahia"},{uf:"CE",n:"Ceara"},{uf:"DF",n:"Distrito Federal"},{uf:"ES",n:"Espirito Santo"},
  {uf:"GO",n:"Goias"},{uf:"MA",n:"Maranhao"},{uf:"MT",n:"Mato Grosso"},{uf:"MS",n:"Mato Grosso do Sul"},
  {uf:"MG",n:"Minas Gerais"},{uf:"PA",n:"Para"},{uf:"PB",n:"Paraiba"},{uf:"PR",n:"Parana"},
  {uf:"PE",n:"Pernambuco"},{uf:"PI",n:"Piaui"},{uf:"RJ",n:"Rio de Janeiro"},{uf:"RN",n:"Rio Grande do Norte"},
  {uf:"RS",n:"Rio Grande do Sul"},{uf:"RO",n:"Rondonia"},{uf:"RR",n:"Roraima"},{uf:"SC",n:"Santa Catarina"},
  {uf:"SP",n:"Sao Paulo"},{uf:"SE",n:"Sergipe"},{uf:"TO",n:"Tocantins"},
];

// Principais cidades por estado (capitais + grandes municipios)
const CIDADES = {
  AC:["Rio Branco","Cruzeiro do Sul"],
  AL:["Maceio","Arapiraca"],
  AP:["Macapa","Santana"],
  AM:["Manaus","Parintins"],
  BA:["Salvador","Feira de Santana","Vitoria da Conquista","Camacari"],
  CE:["Fortaleza","Caucaia","Juazeiro do Norte","Sobral","Maracanau"],
  DF:["Brasilia"],
  ES:["Vitoria","Vila Velha","Serra","Cariacica"],
  GO:["Goiania","Aparecida de Goiania","Anapolis"],
  MA:["Sao Luis","Imperatriz"],
  MT:["Cuiaba","Varzea Grande","Rondonopolis"],
  MS:["Campo Grande","Dourados"],
  MG:["Belo Horizonte","Uberlandia","Contagem","Juiz de Fora","Betim"],
  PA:["Belem","Ananindeua","Santarem"],
  PB:["Joao Pessoa","Campina Grande"],
  PR:["Curitiba","Londrina","Maringa","Ponta Grossa","Cascavel"],
  PE:["Recife","Jaboatao dos Guararapes","Olinda","Caruaru"],
  PI:["Teresina","Parnaiba"],
  RJ:["Rio de Janeiro","Sao Goncalo","Duque de Caxias","Niteroi","Nova Iguacu"],
  RN:["Natal","Mossoro","Parnamirim"],
  RS:["Porto Alegre","Caxias do Sul","Pelotas","Canoas","Santa Maria"],
  RO:["Porto Velho","Ji-Parana"],
  RR:["Boa Vista"],
  SC:["Florianopolis","Joinville","Blumenau","Chapeco"],
  SP:["Sao Paulo","Guarulhos","Campinas","Sao Bernardo do Campo","Santo Andre","Osasco","Ribeirao Preto","Sorocaba"],
  SE:["Aracaju","Nossa Senhora do Socorro"],
  TO:["Palmas","Araguaina"],
};

// Bancas - geram links de busca diretos
const BANCAS = [
  {id:"cebraspe", n:"Cebraspe", cor:"#1d4ed8", url:q=>`https://www.cebraspe.org.br/concursos/em-andamento`},
  {id:"fcc", n:"FCC", cor:"#dc2626", url:q=>`https://www.concursosfcc.com.br/index.html`},
  {id:"fgv", n:"FGV", cor:"#059669", url:q=>`https://conhecimento.fgv.br/concursos/inscricoes-abertas`},
  {id:"vunesp", n:"Vunesp", cor:"#7c3aed", url:q=>`https://www.vunesp.com.br/`},
  {id:"idecan", n:"IDECAN", cor:"#ea580c", url:q=>`https://www.idecan.org.br/concursos`},
  {id:"google", n:"Google", cor:"#0891b2", url:q=>`https://www.google.com/search?q=${encodeURIComponent(q)}`},
  {id:"pci", n:"PCI Concursos", cor:"#0d9488", url:q=>`https://www.pciconcursos.com.br/concursos/${encodeURIComponent(q)}`},
];

export default function ConfigConcursos({ onClose }) {
  const [area, setArea] = useState(null);
  const [escol, setEscol] = useState(null);
  const [esfera, setEsfera] = useState(null);
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [horasDia, setHorasDia] = useState(3);

  // Monta a query de busca
  const montarQuery = () => {
    const partes = ["concurso 2026"];
    if (area) {
      const a = AREAS.find(x=>x.id===area);
      if (a) partes.push(a.q);
    }
    if (escol) {
      const e = ESCOLARIDADE.find(x=>x.id===escol);
      if (e) partes.push("nivel "+e.n.toLowerCase());
    }
    if (esfera) {
      const sf = ESFERAS.find(x=>x.id===esfera);
      if (sf) partes.push(sf.n.toLowerCase());
    }
    if (esfera==="municipal" && cidade) partes.push("prefeitura "+cidade);
    if (uf) {
      const est = ESTADOS.find(x=>x.uf===uf);
      if (est) partes.push(est.n);
    }
    return partes.join(" ");
  };

  const query = montarQuery();

  // Plano de revisao baseado em horas/dia (repeticao espacada)
  const planoRevisao = [
    {q:"1o dia", d:"Estude o conteudo novo pela primeira vez"},
    {q:"Apos 1 dia", d:"Primeira revisao (resumo + 10 questoes)"},
    {q:"Apos 7 dias", d:"Segunda revisao (flashcards + questoes erradas)"},
    {q:"Apos 30 dias", d:"Terceira revisao (simulado do tema)"},
    {q:"Apos 90 dias", d:"Revisao final pre-prova"},
  ];

  // Estimativa de cobertura por horas/dia
  const blocosDia = Math.max(1, Math.round(horasDia / 1.5)); // blocos de ~1h30
  const topicosSemana = blocosDia * 7;

  const Secao = ({titulo, children}) => (
    <div style={{marginBottom:18}}>
      <div style={{fontWeight:700,color:C.gold,fontSize:13,marginBottom:8}}>{titulo}</div>
      {children}
    </div>
  );

  const Chip = ({ativo, onClick, children, cor}) => (
    <button onClick={onClick} style={{
      background: ativo ? (cor||C.gold)+"22" : "transparent",
      border:`1px solid ${ativo ? (cor||C.gold) : C.border}`,
      color: ativo ? (cor||C.gold) : C.text,
      borderRadius:8, padding:"7px 12px", cursor:"pointer",
      fontSize:12, fontWeight:ativo?700:400, transition:"all 0.15s"
    }}>{children}</button>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,overflowY:"auto",padding:"20px 12px"}}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:680,margin:"0 auto",background:C.bg,border:`1px solid ${C.gold}44`,borderRadius:14,padding:"20px 18px"}}>

        {/* Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <h2 style={{color:C.gold,margin:0,fontSize:17}}>⚙️ Configurar Busca de Concursos</h2>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <p style={{color:C.muted,fontSize:12,margin:"0 0 18px",lineHeight:1.6}}>
          Selecione seus filtros e gere buscas diretas nas bancas (Cebraspe, FCC, FGV, Vunesp, IDECAN) e no Google. Defina tambem seu tempo de estudo e o plano de revisoes.
        </p>

        {/* AREA */}
        <Secao titulo="1. Area do Concurso">
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {AREAS.map(a=>(
              <Chip key={a.id} ativo={area===a.id} onClick={()=>setArea(area===a.id?null:a.id)}>{a.n}</Chip>
            ))}
          </div>
        </Secao>

        {/* ESCOLARIDADE */}
        <Secao titulo="2. Escolaridade">
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {ESCOLARIDADE.map(e=>(
              <Chip key={e.id} ativo={escol===e.id} onClick={()=>setEscol(escol===e.id?null:e.id)} cor={C.blue}>{e.n}</Chip>
            ))}
          </div>
        </Secao>

        {/* ESFERA */}
        <Secao titulo="3. Esfera">
          <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
            {ESFERAS.map(sf=>(
              <Chip key={sf.id} ativo={esfera===sf.id} onClick={()=>{setEsfera(esfera===sf.id?null:sf.id);setCidade("");}} cor={C.green}>{sf.n}</Chip>
            ))}
          </div>
        </Secao>

        {/* ESTADO (se estadual ou municipal) */}
        {(esfera==="estadual"||esfera==="municipal") && (
          <Secao titulo="4. Estado">
            <select value={uf} onChange={e=>{setUf(e.target.value);setCidade("");}}
              style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13}}>
              <option value="">Selecione o estado...</option>
              {ESTADOS.map(e=><option key={e.uf} value={e.uf}>{e.uf} - {e.n}</option>)}
            </select>
          </Secao>
        )}

        {/* CIDADE (se municipal e estado selecionado) */}
        {esfera==="municipal" && uf && CIDADES[uf] && (
          <Secao titulo="5. Cidade">
            <select value={cidade} onChange={e=>setCidade(e.target.value)}
              style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:13}}>
              <option value="">Todas as cidades de {uf}...</option>
              {CIDADES[uf].map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </Secao>
        )}

        {/* RESUMO DA BUSCA + BANCAS */}
        <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:10,padding:"12px 14px",marginBottom:18}}>
          <div style={{fontSize:11,color:C.muted,marginBottom:4}}>Sua busca:</div>
          <div style={{fontSize:13,color:C.goldL,fontWeight:600,marginBottom:12,wordBreak:"break-word"}}>{query}</div>
          <div style={{fontWeight:700,color:C.gold,fontSize:12,marginBottom:8}}>🔎 Pesquisar nas bancas e sites:</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {BANCAS.map(b=>(
              <a key={b.id} href={b.url(query)} target="_blank" rel="noopener noreferrer"
                style={{background:b.cor+"22",border:`1px solid ${b.cor}`,color:b.cor,borderRadius:8,padding:"8px 13px",fontSize:12,fontWeight:700,textDecoration:"none"}}>
                {b.n} ↗
              </a>
            ))}
          </div>
          <p style={{fontSize:10,color:C.muted,margin:"10px 0 0",lineHeight:1.5}}>
            Cebraspe, FCC, FGV, Vunesp e IDECAN abrem a pagina oficial de concursos da banca. Google e PCI Concursos aplicam seus filtros diretamente na busca.
          </p>
        </div>

        {/* TEMPO DE ESTUDO */}
        <Secao titulo="⏱ Tempo de Estudo por Dia">
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <input type="range" min="1" max="10" value={horasDia} onChange={e=>setHorasDia(Number(e.target.value))}
              style={{flex:1,accentColor:C.gold}}/>
            <span style={{color:C.goldL,fontWeight:700,fontSize:18,minWidth:70,textAlign:"right"}}>{horasDia}h/dia</span>
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px"}}>
            <div style={{fontSize:12,color:C.text,lineHeight:1.7}}>
              Com <strong style={{color:C.gold}}>{horasDia}h/dia</strong> voce cobre cerca de <strong style={{color:C.green}}>{blocosDia} bloco(s)</strong> de estudo (~1h30 cada) por dia, totalizando aproximadamente <strong style={{color:C.green}}>{topicosSemana} sessoes/semana</strong>.
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:6}}>
              Recomendado: 70% conteudo novo + 30% revisao e questoes.
            </div>
          </div>
        </Secao>

        {/* PLANO DE REVISAO */}
        <Secao titulo="🔁 Revisoes e Periodicidade (Repeticao Espacada)">
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {planoRevisao.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"center",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px"}}>
                <span style={{background:C.gold+"22",border:`1px solid ${C.gold}`,color:C.gold,borderRadius:6,padding:"3px 9px",fontSize:11,fontWeight:700,whiteSpace:"nowrap",minWidth:78,textAlign:"center"}}>{r.q}</span>
                <span style={{fontSize:12,color:C.text,lineHeight:1.5}}>{r.d}</span>
              </div>
            ))}
          </div>
          <p style={{fontSize:11,color:C.muted,margin:"10px 0 0",lineHeight:1.5}}>
            A repeticao espacada (revisar em intervalos crescentes: 1, 7, 30 e 90 dias) fixa o conteudo na memoria de longo prazo e e o metodo mais eficaz comprovado para concursos.
          </p>
        </Secao>

        <button onClick={onClose} style={{width:"100%",background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"12px",cursor:"pointer",fontWeight:700,fontSize:14,marginTop:6}}>
          Fechar
        </button>
      </div>
    </div>
  );
}
