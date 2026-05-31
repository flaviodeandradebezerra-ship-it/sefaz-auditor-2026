import { useState, useEffect, useRef, Component } from "react";
import FlashcardsApp from "./FlashcardsApp.jsx"; // SEFAZ_DISCIPLINAS_V3_COMPLETO_2026
import LeisFontes from "./LeisFontes.jsx";
import Notificacoes from "./Notificacoes.jsx";
import { Q as Q_BANCO } from "./fcData.js";
const TOTAL_Q = Object.values(Q_BANCO).reduce((s,arr)=>s+(arr?arr.length:0),0);
import ConfigConcursos from "./ConfigConcursos.jsx";
import MeusEditais from "./MeusEditais.jsx";
import Anotacoes from "./Anotacoes.jsx";
import MetodoBanca from "./MetodoBanca.jsx";
import Desempenho from "./Desempenho.jsx";

export class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state={erro:null}; }
  static getDerivedStateFromError(error){ return {erro:error}; }
  componentDidCatch(error, info){ console.error("Erro capturado:", error, info); }
  render(){
    if(this.state.erro){
      const secao = this.props.secao || "esta secao";
      return (
        <div style={{padding:20,maxWidth:560,margin:"40px auto"}}>
          <div style={{background:"#0f1829",border:"1px solid #1b2c44",borderRadius:14,padding:28,textAlign:"center"}}>
            <div style={{fontSize:40,marginBottom:8}}>🛠️</div>
            <h3 style={{color:"#f0d080",margin:"0 0 8px",fontSize:18}}>Ops, algo nao carregou em {secao}</h3>
            <p style={{color:"#94a3b8",fontSize:13,lineHeight:1.7,margin:"0 0 18px"}}>
              Tivemos um problema temporario ao exibir esta parte. Seus dados de estudo estao salvos e seguros. Tente recarregar.
            </p>
            <button onClick={()=>{ try{this.setState({erro:null});}catch(e){} window.location.reload(); }}
              style={{background:"#c8a951",color:"#000",border:"none",borderRadius:8,padding:"11px 22px",cursor:"pointer",fontWeight:700,fontSize:14}}>
              ↻ Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════
//  SEFAZ/CE 2026 — PLATAFORMA COMPLETA DE ESTUDOS
//  Login + Guia Estratégico + Banco 50Q + Simulado + Revisão
//  Banca: FCC | Cargo: Auditor-Fiscal da Fazenda Estadual
// ═══════════════════════════════════════════════════════

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035",
  border:"#1b2c44", gold:"#c8a951", goldLight:"#f0d080",
  red:"#ef4444", green:"#22c55e", blue:"#3b82f6",
  purple:"#a855f7", text:"#e2e8f0", muted:"#64748b", danger:"#dc2626",
};

// ─── DADOS DO GUIA ────────────────────────────────────
const guia = {
  concurso:{orgao:"SEFAZ/CE",cargo:"Auditor-Fiscal da Fazenda Estadual – 1ª Classe",banca:"Fundação Carlos Chagas (FCC)",vagas:"A01 (Gestão Fazendária): 60 imediatas + 120 cadastro | B02 (TI): 15 imediatas + 30 cadastro",remuneracao:"R$ 16.136,64",provas:"01/08/2026 (Obj. Gerais) | 02/08/2026 (Obj. Específicos + Discursiva)",inscricoes:"27/04/2026 a 01/06/2026",inscricaoValor:"R$ 230,00",habilitacao:"Nota padronizada ≥ 150 (soma das duas objetivas)",discursivaMin:"≥ 50 pontos (de 100 pontos totais)"},
  etapas:[{nome:"Prova Objetiva – Conhecimentos Gerais",peso:1,data:"01/08/2026 (sábado, tarde)",hab:true},{nome:"Prova Objetiva – Conhecimentos Específicos",peso:2,data:"02/08/2026 (domingo, manhã)",hab:true},{nome:"Prova Discursiva (1 Dissertativa + 2 Estudos de Caso)",peso:1,data:"02/08/2026 (domingo, tarde)",hab:true},{nome:"Avaliação de Títulos",peso:"Classif.",data:"Out/2026",hab:false},{nome:"Sindicância da Vida Pregressa",peso:"Elim.",data:"Out/2026",hab:true}],
  disc_gerais:[{nome:"Língua Portuguesa",q:10,pct:"12,5%",pr:"ALTA",dica:"FCC cobra interpretação, coesão, concordância verbal/nominal, regência. Atenção a pronomes relativos e crase."},{nome:"Matemática Financeira / Estatística / Raciocínio Lógico",q:12,pct:"15%",pr:"MUITO ALTA",dica:"Maior bloco isolado. FCC cobra juros compostos, amortização SAC e Price, probabilidade, combinatória e lógica proposicional."},{nome:"Administração e Governança Pública",q:10,pct:"12,5%",pr:"ALTA",dica:"Governança pública, COBIT, gestão de riscos (modelo 3 linhas), integridade, ética e programa de integridade do CE."},{nome:"Economia",q:10,pct:"12,5%",pr:"ALTA",dica:"Microeconomia: elasticidade, equilíbrio. Macroeconomia: IS-LM, contas nacionais. Tributação: regra de Ramsey, curva de Laffer."},{nome:"Direito Constitucional, Administrativo, Civil e Penal",q:12,pct:"15%",pr:"MUITO ALTA",dica:"FCC cobra Dir. Administrativo (atos, contratos, Lei 14.133/2021). Penal tributário: crimes (Lei 8.137/90) e lavagem."},{nome:"Direito Financeiro",q:8,pct:"10%",pr:"ALTA",dica:"Lei 4.320/64, LRF (LC 101/2000) – despesas, receitas, dívida pública, restos a pagar. PPA, LDO, LOA e princípios orçamentários."},{nome:"Contabilidade Geral e Pública",q:10,pct:"12,5%",pr:"ALTA",dica:"Balanço patrimonial, DRE, DVA, estoques (PEPS/MPM), ativo imobilizado, MCASP 11ª ed., NBC TSP."},{nome:"Auditoria",q:8,pct:"10%",pr:"MÉDIA-ALTA",dica:"Planejamento, risco, materialidade, NBC TA 315, 240, 500, 700. Distinção entre auditoria interna e independente."}],
  disc_especificas:[{nome:"Direito Tributário",q:20,pct:"25%",pr:"CRÍTICA",dica:"CTN completo: obrigação, fato gerador, lançamento, crédito, extinção, exclusão. Reforma: EC 132/2023, LC 214/2025 (IBS/CBS)."},{nome:"Legislação Tributária",q:20,pct:"25%",pr:"CRÍTICA",dica:"ICMS (Lei 18.665/23 e Dec. 33.327/19), ITCD (Lei 15.812/15), IPVA (Lei 12.023/92), FECOP (LC 37/03). LC 87/96, LC 123/06."},{nome:"Contabilidade Avançada e de Custos",q:20,pct:"25%",pr:"CRÍTICA",dica:"Valor justo, AVP, instrumentos financeiros, MEP, goodwill, arrendamento (CPC 06 R2), DVA, DFC. Custos: absorção, variável, ABC, PE."},{nome:"Fluência de Dados",q:10,pct:"12,5%",pr:"ALTA",dica:"SQL (SELECT, GROUP BY, JOIN, agregações), Data Warehouse, Data Lake, LGPD, Big Data, Machine Learning e governança."},{nome:"Finanças Públicas",q:10,pct:"12,5%",pr:"ALTA",dica:"Funções do governo (Musgrave), bens públicos, externalidades, déficit público, resultado primário vs nominal, equidade fiscal."}],
  cronograma:[{semana:"Sem 1–4 (Mai/Jun)",fase:"Base Jurídica e Tributária",foco:["CTN completo (obrigação, fato gerador, crédito, lançamento)","EC 132/2023 e LC 214/2025 – Reforma Tributária (IBS/CBS)","Constituição Federal – Sistema Tributário Nacional","Legislação tributária do CE: ICMS, IPVA, ITCD"],horas:"3–4h/dia"},{semana:"Sem 5–7 (Jun)",fase:"Contabilidade Avançada e de Custos",foco:["IFRS: valor justo, AVP, instrumentos financeiros, arrendamento","MEP, goodwill, consolidação de balanços","Métodos de custeio: absorção, variável, ABC","Ponto de equilíbrio, margem de contribuição, DVA, DFC"],horas:"3–4h/dia"},{semana:"Sem 8–9 (Jun-Jul)",fase:"Contabilidade Pública + Direito Financeiro",foco:["MCASP 11ª edição – procedimentos orçamentários e patrimoniais","NBC TSP estrutura conceitual + principais normas","LRF (LC 101/00) – receita, despesa, dívida","Lei 4.320/64 – restos a pagar, créditos adicionais, fundos"],horas:"3–4h/dia"},{semana:"Sem 10–11 (Jul)",fase:"Direitos + Administração + Economia",foco:["Direito Administrativo: atos, contratos, Lei 14.133/2021","Direito Penal: crimes tributários (Lei 8.137/90), lavagem","Micro e macroeconomia: elasticidade, IS-LM, contas nacionais","Governança pública: COBIT, gestão de riscos, integridade"],horas:"3–4h/dia"},{semana:"Sem 12–13 (Jul)",fase:"Português + Matemática + Auditoria + Fluência",foco:["Raciocínio lógico: proposições, silogismos, sequências","Matemática financeira: juros compostos, amortização SAC/Price","Auditoria: planejamento, risco, NBC TA","SQL básico e intermediário, LGPD, governança de dados"],horas:"3–4h/dia"},{semana:"Sem 14–15 (Jul)",fase:"Revisão Total + Simulados",foco:["Resolver simulados completos da FCC","Revisar pontos fracos identificados","Treinar redação dissertativa e estudo de caso","Revisão de legislação estadual (ICMS, ITCD, IPVA)"],horas:"4–5h/dia"}],
  temas_quentes:[{tema:"Reforma Tributária (EC 132/2023, LC 214/2025, IBS, CBS, IS)",freq:"Certamente cairá em múltiplas questões"},{tema:"ICMS – Legislação do Ceará (Lei 18.665/2023 + Dec. 33.327/2019)",freq:"15–20% das questões específicas"},{tema:"Crédito Tributário (CTN) – lançamento, extinção, suspensão",freq:"FCC cobra em todo concurso fiscal"},{tema:"LRF – receita, despesa, dívida, resultado fiscal",freq:"8–10 questões históricas"},{tema:"MCASP 11ª ed. + NBC TSP – contabilidade pública",freq:"Nova edição, alta probabilidade"},{tema:"MEP, goodwill, valor justo, arrendamento (IFRS/CPC)",freq:"Contabilidade avançada FCC sempre cobra"},{tema:"Lei 14.133/2021 – Nova Lei de Licitações",freq:"Substituiu Lei 8.666, FCC já cobrando"},{tema:"LGPD + Sigilo Fiscal (CTN arts. 198-199)",freq:"Tema novo no edital, certeiro"},{tema:"Crimes contra a Ordem Tributária (Lei 8.137/90)",freq:"Direito Penal tributário"},{tema:"Amortização SAC e Price – Matemática Financeira",freq:"FCC cobra cálculo numérico"}],
  discursivas:[{tema:"Reforma Tributária – IBS e CBS",tipo:"Questão Dissertativa",enunciado:"A EC nº 132/2023 promoveu a maior reforma tributária dos últimos 35 anos. Disserte sobre: (a) diferenças entre IBS e ICMS/ISS; (b) papel do Comitê Gestor do IBS; (c) princípios da não-cumulatividade plena e do destino; (d) impactos para a administração tributária estadual.",roteiro:["ICMS: competência estadual, não-cumulatividade parcial → IBS: competência compartilhada estados/DF/municípios, não-cumulatividade plena, alíquota uniforme.","Comitê Gestor do IBS (art. 156-B CF): órgão colegiado com representantes de estados, DF e municípios. Responsável por administração, arrecadação, fiscalização e cobrança.","Princípio do destino: imposto devido no local de consumo, reduzindo guerra fiscal. Não-cumulatividade plena: crédito integral do imposto pago em etapas anteriores.","Impactos para SEFAZs: transição gradual 2026–2033, atualização de sistemas, capacitação para o novo regime, fim das isenções heterodoxas não aprovadas pelo CONFAZ."],linhas:25},{tema:"Estudo de Caso – ICMS e Auditoria Fiscal",tipo:"Estudo de Caso",enunciado:"A empresa Alfa Comércio Ltda. foi auditada pela SEFAZ/CE. O auditor identificou: (1) créditos de ICMS de mercadorias para uso e consumo; (2) transferências interestaduais sem destaque do ICMS; (3) saídas com redução indevida da base de cálculo. Com base no CTN, LC 87/1996 e Lei 18.665/2023-CE, responda: (a) tratamento correto; (b) como proceder o lançamento; (c) multas e acréscimos aplicáveis.",roteiro:["(1) Uso e consumo: art. 33 LC 87/96 veda crédito até 2033. Glosa dos créditos + lançamento com multa.","(2) Transferências: LC 204/2023 determina tributação. Lançamento de ofício (art. 149 CTN). Auto de Infração.","(3) Redução indevida: apenas convênios CONFAZ (LC 24/75) autorizam benefícios. Lançamento da diferença + multa.","Constituição do crédito por lançamento de ofício (art. 149 CTN). Prazo decadencial: 5 anos (art. 173 CTN)."],linhas:30},{tema:"LRF – Resultado Fiscal e Controle de Despesas",tipo:"Questão Dissertativa",enunciado:"A LRF (LC 101/2000) estabelece normas de responsabilidade fiscal. Disserte sobre: (a) conceitos de resultado primário e nominal; (b) mecanismo de limitação de empenho; (c) vedações nos dois últimos quadrimestres do mandato.",roteiro:["Resultado Primário = Receitas não financeiras − Despesas não financeiras (exclui juros). Mede esforço fiscal. Resultado Nominal = Primário − Juros nominais. Indica variação total da dívida.","Limitação de empenho (art. 9º LRF): se receitas não comportarem metas fiscais bimestrais, o Executivo promove contingenciamento por ato próprio.","Vedações art. 42 LRF: proibição de contrair obrigação que não possa ser paga no exercício ou que deixe restos a pagar sem disponibilidade financeira."],linhas:20}],
  perfil_fcc:["Questões longas e elaboradas, com múltiplas assertivas e casos concretos","Cobra legislação literal, inclusive dispositivos menos óbvios","Muita jurisprudência do STJ e STF em Direito Tributário","Raciocínio Lógico: proposições lógicas, validade de argumentos, tabelas-verdade","Português: interpretação textual profunda + gramática aplicada ao texto","Contabilidade: questões com cálculo numérico explícito","Não costuma repetir questões, mas repete temas e abordagens","Discursivas avaliam domínio técnico + capacidade argumentativa + clareza","Penalidade grave por cópia literal de texto de apoio na discursiva"],
};

// ─── BANCO 50 QUESTÕES com links YouTube e pesquisa ──
const BANCO = [
  {id:1,disc:"Direito Tributário",tema:"Obrigação Tributária",dif:"Média",ref:"FCC/SEFAZ-RS/2018",
   enunciado:"Nos termos do CTN, a obrigação tributária principal tem por objeto:",
   alt:["A) O pagamento de tributo ou penalidade pecuniária.","B) As prestações positivas ou negativas previstas na legislação.","C) O pagamento de tributo somente, excluídas as multas.","D) A entrega de declarações e documentos fiscais.","E) O cumprimento de deveres instrumentais previstos em lei."],
   gab:"A",com:"Art. 113 CTN: a obrigação principal tem por objeto o pagamento de TRIBUTO OU PENALIDADE PECUNIÁRIA. A obrigação acessória (prestações positivas/negativas) é distinta. Atenção: multa É obrigação principal — erro clássico cobrado pela FCC.",
   yt:[{label:"Obrigação Tributária Principal e Acessória – CTN",url:"https://www.youtube.com/results?search_query=obriga%C3%A7%C3%A3o+tribut%C3%A1ria+principal+acess%C3%B3ria+CTN+concurso"}],
   links:[{label:"Art. 113 CTN – Planalto",url:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"},{label:"Obrigação Tributária – Portal FCC",url:"https://www.google.com/search?q=obriga%C3%A7%C3%A3o+tribut%C3%A1ria+principal+acess%C3%B3ria+CTN+FCC"}]},

  {id:2,disc:"Direito Tributário",tema:"Competência Tributária",dif:"Alta",ref:"FCC/SEFAZ-BA/2019",
   enunciado:"Sobre a competência tributária:\nI. É indelegável, salvo atribuição de funções de arrecadar/fiscalizar a outra PJ de direito público.\nII. O não-exercício da competência autoriza outra entidade federativa a exercê-la.\nIII. O DF possui competência cumulativa para tributos estaduais e municipais.\nIV. A competência residual para novos impostos pertence exclusivamente à União.",
   alt:["A) Apenas I e III.","B) Apenas I, III e IV.","C) Apenas II e IV.","D) Todas corretas.","E) Apenas I e II."],
   gab:"B",com:"I: CORRETA – art. 7º CTN: competência é indelegável, mas funções de arrecadar/fiscalizar podem ser delegadas. II: ERRADA – art. 8º CTN: não-exercício NÃO defere a pessoa diversa. III: CORRETA – CF art. 32 §1º: DF acumula competências estaduais e municipais. IV: CORRETA – CF art. 154, I: competência residual da União, via LC, com não-cumulatividade.",
   yt:[{label:"Competência Tributária – Concursos Fiscais",url:"https://www.youtube.com/results?search_query=compet%C3%AAncia+tribut%C3%A1ria+CTN+concurso+fiscal"}],
   links:[{label:"Art. 7º e 8º CTN – Planalto",url:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"},{label:"Competência Tributária – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/competencia-tributaria/"}]},

  {id:3,disc:"Direito Tributário",tema:"Responsabilidade Tributária",dif:"Alta",ref:"FCC/SEFAZ-RJ/2014",
   enunciado:"O sócio-gerente de uma Ltda. pode ser responsabilizado pessoalmente pelos débitos tributários da empresa quando:",
   alt:["A) A sociedade não possui patrimônio suficiente, independentemente de ato ilícito.","B) Agir com excesso de poderes, infração à lei, contrato social ou estatutos (art. 135 CTN).","C) O simples encerramento das atividades configurar dissolução irregular, sem prova de dolo.","D) A empresa for enquadrada no Simples Nacional.","E) O sócio for majoritário e a empresa não recolher o ICMS declarado."],
   gab:"B",com:"Art. 135 CTN: responsabilidade PESSOAL por excesso de poderes ou infração de lei/contrato. Súmula 430 STJ: inadimplemento tributário NÃO gera responsabilidade solidária dos sócios. Súmula 435 STJ: dissolução irregular pode ensejar redirecionamento, exigindo comprovação do ato ilícito.",
   yt:[{label:"Responsabilidade Tributária de Terceiros – Art 135 CTN",url:"https://www.youtube.com/results?search_query=responsabilidade+tribut%C3%A1ria+terceiros+art+135+CTN+concurso"}],
   links:[{label:"Súmula 430 STJ",url:"https://www.stj.jus.br/docs_internet/revista/eletronica/stj-revista-sumulas-2013_33_capSumula430.pdf"},{label:"Art 135 CTN – Planalto",url:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"}]},

  {id:4,disc:"Direito Tributário",tema:"Decadência e Prescrição",dif:"Alta",ref:"FCC/SEFAZ-CE estilo",
   enunciado:"Acerca da decadência e prescrição tributária, é correto afirmar:",
   alt:["A) O prazo decadencial para lançamento de ofício é sempre 5 anos contados do fato gerador, sem exceções.","B) A prescrição extingue o crédito já constituído; seu prazo é de 5 anos da constituição definitiva.","C) O despacho que ordena a citação interrompe a prescrição, sem retroagir ao ajuizamento.","D) A decadência pode ser suspensa pelas mesmas causas que suspendem a exigibilidade do crédito.","E) A prescrição e a decadência tributárias admitem renúncia pelo sujeito passivo."],
   gab:"B",com:"Art. 174 CTN: ação para cobrança prescreve em 5 anos da CONSTITUIÇÃO DEFINITIVA. A: há regra diferenciada no art. 150 §4º e art. 173, I. C: o despacho RETROAGE à data do ajuizamento (art. 174, §único, I – alterado pela LC 118/2005). D: decadência NÃO se suspende. E: são matérias de ordem pública, irrenunciáveis.",
   yt:[{label:"Decadência e Prescrição Tributária – CTN",url:"https://www.youtube.com/results?search_query=decad%C3%AAncia+prescri%C3%A7%C3%A3o+tribut%C3%A1ria+CTN+concurso+fiscal"}],
   links:[{label:"Arts. 173-174 CTN",url:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"},{label:"Decadência e Prescrição – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/decadencia-e-prescricao-tributaria/"}]},

  {id:5,disc:"Direito Tributário",tema:"Exclusão do Crédito",dif:"Média",ref:"FCC/SEFAZ estilo",
   enunciado:"A anistia, como forma de exclusão do crédito tributário, distingue-se da isenção porque:",
   alt:["A) A isenção dispensa o pagamento do tributo; a anistia perdoa a multa já lançada.","B) A anistia abrange infrações cometidas antes de sua vigência; a isenção opera prospectivamente.","C) A isenção exclui o crédito já constituído; a anistia impede a constituição do crédito.","D) A anistia pode ser concedida por decreto; a isenção exige lei específica.","E) A isenção é forma de extinção; a anistia é forma de exclusão do crédito."],
   gab:"B",com:"Art. 180 CTN: anistia abrange exclusivamente INFRAÇÕES cometidas ANTES da lei. Isenção (art. 175-179): exclui tributo FUTURO, antes do lançamento. A: anistia opera ANTES do lançamento (multa já lançada seria remissão). C: invertido. D: ambas exigem lei (art. 150, §6º CF). E: ambas são EXCLUSÃO do crédito.",
   yt:[{label:"Isenção e Anistia Tributária – Diferenças",url:"https://www.youtube.com/results?search_query=isen%C3%A7%C3%A3o+anistia+tribut%C3%A1ria+diferen%C3%A7a+concurso"}],
   links:[{label:"Arts. 175-180 CTN",url:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"},{label:"Exclusão do Crédito Tributário – JusBrasil",url:"https://www.jusbrasil.com.br/artigos/exclusao-do-credito-tributario"}]},

  {id:6,disc:"Direito Tributário",tema:"Lançamento por Homologação",dif:"Média",ref:"FCC/SEFAZ estilo",
   enunciado:"O lançamento por homologação caracteriza-se por:",
   alt:["A) O Fisco notificar o contribuinte a recolher o tributo antes de qualquer atividade do sujeito passivo.","B) A autoridade fiscal lançar de ofício sem participação do contribuinte.","C) O sujeito passivo antecipar o pagamento sem prévio exame da autoridade, que posteriormente homologa expressa ou tacitamente.","D) O contribuinte declarar o tributo sem realizar pagamento antecipado.","E) Autoridade e contribuinte agirem conjuntamente para constituir o crédito."],
   gab:"C",com:"Art. 150 CTN: lançamento por homologação = contribuinte ANTECIPA o pagamento SEM prévio exame da autoridade. Esta tem 5 anos para homologar (tácita ou expressamente). É o modelo do ICMS, IPI, IR. FCC cobra este tema em todo concurso fiscal.",
   yt:[{label:"Modalidades de Lançamento Tributário – FCC",url:"https://www.youtube.com/results?search_query=modalidades+lan%C3%A7amento+tribut%C3%A1rio+homologa%C3%A7%C3%A3o+concurso"}],
   links:[{label:"Art. 150 CTN – Lançamento por Homologação",url:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"},{label:"Lançamento Tributário – Estratégia Concursos",url:"https://www.estrategiaconcursos.com.br/blog/lancamento-tributario/"}]},

  {id:7,disc:"Direito Tributário",tema:"Substituição Tributária",dif:"Alta",ref:"FCC/SEFAZ-CE estilo",
   enunciado:"A substituição tributária 'para frente' (progressiva) no ICMS caracteriza-se por:",
   alt:["A) Atribuir ao adquirente a responsabilidade pelo ICMS das operações anteriores já realizadas.","B) Atribuir ao fabricante/importador a responsabilidade pelo ICMS de operações subsequentes, com base em valor presumido.","C) Ser inconstitucional, pois tributa fato gerador futuro e incerto.","D) Dispensar a emissão de nota fiscal nas operações subsequentes.","E) Aplicar-se exclusivamente a produtos de primeira necessidade."],
   gab:"B",com:"ICMS-ST progressiva: o substituto tributário recolhe antecipadamente o ICMS de toda a cadeia com base em MVA ou pauta fiscal. É CONSTITUCIONAL – art. 150, §7º CF e STF RE 213.396. Se fato gerador não se realizar: direito à restituição. Substituição 'para trás' (regressiva): postergação do pagamento para etapas posteriores.",
   yt:[{label:"Substituição Tributária ICMS – Para Frente e Para Trás",url:"https://www.youtube.com/results?search_query=substitui%C3%A7%C3%A3o+tribut%C3%A1ria+ICMS+frente+concurso+fiscal"}],
   links:[{label:"Art. 150 §7º CF – Substituição Tributária",url:"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"},{label:"ICMS-ST – Portal CONFAZ",url:"https://www.confaz.fazenda.gov.br/"}]},

  {id:8,disc:"Legislação Tributária",tema:"ICMS – Não-Cumulatividade",dif:"Alta",ref:"FCC/SEFAZ-CE estilo",
   enunciado:"Sobre a não-cumulatividade do ICMS (CF art. 155, §2º, I), assinale a correta:",
   alt:["A) O crédito de ICMS é garantido mesmo nas operações isentas ou não tributadas na etapa anterior.","B) A isenção ou não-incidência, salvo determinação em contrário, não implicará crédito para compensação nas operações seguintes.","C) Mercadorias destinadas a uso e consumo geram crédito de ICMS desde a CF/88.","D) O crédito de ativo permanente deve ser aproveitado integralmente no mês da aquisição.","E) A não-cumulatividade no ICMS é absoluta, sem qualquer exceção constitucional."],
   gab:"B",com:"CF art. 155, §2º, II: isenção/não-incidência, SALVO DETERMINAÇÃO EM CONTRÁRIO, não gera crédito. C: uso e consumo — direito suspenso até 2033 (LC 87/96). D: ativo permanente = crédito à razão de 1/48 por mês (art. 20, §5º, LC 87/96). A LC 87/96 (Lei Kandir) regulamenta integralmente.",
   yt:[{label:"Não-Cumulatividade ICMS – Lei Kandir",url:"https://www.youtube.com/results?search_query=n%C3%A3o+cumulatividade+ICMS+lei+kandir+concurso+fiscal"}],
   links:[{label:"LC 87/1996 – Lei Kandir",url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm"},{label:"CF art. 155 §2º",url:"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"}]},

  {id:9,disc:"Legislação Tributária",tema:"Reforma Tributária – IBS/CBS",dif:"Alta",ref:"Edital SEFAZ-CE 2026",
   enunciado:"Acerca da EC nº 132/2023 e LC nº 214/2025:\nI. O IBS substitui o ICMS dos estados e o ISS dos municípios.\nII. A CBS substitui o PIS e a COFINS.\nIII. O IBS tem competência exclusivamente estadual.\nIV. O Comitê Gestor do IBS é composto por representantes dos estados, DF e municípios.\nV. O IS incide sobre bens e serviços prejudiciais à saúde ou ao meio ambiente.",
   alt:["A) Apenas I, II e V.","B) Apenas I, II, IV e V.","C) Apenas II, III e IV.","D) Todas corretas.","E) Apenas I, III e V."],
   gab:"B",com:"I: CORRETA – IBS substitui ICMS + ISS. II: CORRETA – CBS substitui PIS + COFINS. III: ERRADA – IBS é de competência COMPARTILHADA entre estados, DF e municípios (art. 156-A CF). IV: CORRETA – Comitê Gestor do IBS (art. 156-B CF). V: CORRETA – IS (Imposto Seletivo) art. 153, VIII, CF. TEMA DE MÁXIMA PRIORIDADE para 2026.",
   yt:[{label:"Reforma Tributária 2024 – IBS CBS IS Explicado",url:"https://www.youtube.com/results?search_query=reforma+tribut%C3%A1ria+IBS+CBS+IS+EC+132+2023+concurso+fiscal"},{label:"LC 214/2025 – Reforma Tributária Completa",url:"https://www.youtube.com/results?search_query=LC+214+2025+reforma+tribut%C3%A1ria+IBS+CBS+concurso"}],
   links:[{label:"EC 132/2023 – Planalto",url:"https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm"},{label:"LC 214/2025 – Planalto",url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm"},{label:"Reforma Tributária – Receita Federal",url:"https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/legislacao/reforma-tributaria"}]},

  {id:10,disc:"Legislação Tributária",tema:"CONFAZ e Convênios",dif:"Alta",ref:"FCC/SEFAZ-CE estilo",
   enunciado:"Nos termos da LC nº 24/1975, a concessão de isenções e benefícios fiscais de ICMS depende de:",
   alt:["A) Aprovação por maioria simples dos estados no CONFAZ.","B) Aprovação unânime dos estados e DF em reunião do CONFAZ.","C) Lei específica estadual, sem necessidade de convênio.","D) Aprovação por 2/3 dos estados membros do CONFAZ.","E) Decreto do Governador com ratificação pela Assembleia Legislativa."],
   gab:"B",com:"LC 24/75, art. 2º, §2º: UNANIMIDADE de todos os estados e DF presentes na reunião, com presença mínima de 4/5 dos estados. Um único estado pode vetar. A LC 160/2017 permitiu remissão de benefícios concedidos irregularmente. Com a Reforma Tributária (IBS), essa sistemática muda substancialmente.",
   yt:[{label:"CONFAZ e Convênios ICMS – Guerra Fiscal",url:"https://www.youtube.com/results?search_query=CONFAZ+conv%C3%AAnios+ICMS+guerra+fiscal+concurso"}],
   links:[{label:"LC 24/1975 – Planalto",url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp24.htm"},{label:"CONFAZ – Portal Oficial",url:"https://www.confaz.fazenda.gov.br/"}]},

  {id:11,disc:"Contabilidade Avançada",tema:"Valor Justo – CPC 46",dif:"Alta",ref:"FCC/SEFAZ-RS/2018",
   enunciado:"O CPC 46 classifica os dados das técnicas de avaliação em três níveis hierárquicos. Assinale a assertiva correta:",
   alt:["A) Nível 1: preços cotados em mercados ativos para ativos idênticos; Nível 2: dados observáveis; Nível 3: dados não observáveis.","B) Nível 1: premissas internas da entidade; Nível 2: preços cotados; Nível 3: dados de mercado.","C) Nível 1: fluxo de caixa descontado; Nível 2: preços de mercado; Nível 3: valor patrimonial.","D) Os três níveis têm a mesma hierarquia.","E) Nível 1: dados não observáveis; Nível 2: dados observáveis; Nível 3: preços cotados."],
   gab:"A",com:"CPC 46 (IFRS 13): Nível 1 = preços cotados em mercados ativos para ativos IDÊNTICOS (maior confiabilidade). Nível 2 = dados observáveis distintos dos preços cotados (ativos similares, taxas de juros). Nível 3 = dados NÃO observáveis, baseados em premissas da entidade (menor confiabilidade). Deve-se MAXIMIZAR o uso de dados observáveis.",
   yt:[{label:"CPC 46 – Valor Justo – Hierarquia de Níveis",url:"https://www.youtube.com/results?search_query=CPC+46+valor+justo+hierarquia+n%C3%ADveis+concurso+contabilidade"}],
   links:[{label:"CPC 46 – CFC",url:"https://www.cpc.org.br/CPC/Documentos-Emitidos/Pronunciamentos/Pronunciamento?Id=77"},{label:"IFRS 13 – IASB",url:"https://www.ifrs.org/issued-standards/list-of-standards/ifrs-13-fair-value-measurement/"}]},

  {id:12,disc:"Contabilidade Avançada",tema:"Arrendamento – CPC 06 R2",dif:"Alta",ref:"FCC/SEFAZ estilo",
   enunciado:"Com a adoção do CPC 06 (R2), o arrendatário deve reconhecer, para praticamente todos os arrendamentos:",
   alt:["A) Apenas a despesa de arrendamento no resultado, pelo método linear.","B) Um ativo de direito de uso e um passivo de arrendamento, pelo valor presente dos pagamentos futuros.","C) O ativo arrendado pelo valor justo e uma receita diferida correspondente.","D) Um passivo contingente nas notas explicativas, sem reconhecimento no balanço.","E) O ativo arrendado apenas quando o prazo superar 75% da vida útil do bem."],
   gab:"B",com:"CPC 06 R2 (IFRS 16): arrendatário reconhece (i) ATIVO DE DIREITO DE USO: valor presente dos pagamentos + custos iniciais + estimativa de desmontagem; (ii) PASSIVO DE ARRENDAMENTO: valor presente dos pagamentos futuros. Exceções: curto prazo (≤12 meses) e baixo valor. A era o modelo antigo para arrendamentos operacionais.",
   yt:[{label:"CPC 06 R2 – IFRS 16 – Arrendamento Mercantil",url:"https://www.youtube.com/results?search_query=CPC+06+R2+IFRS+16+arrendamento+mercantil+concurso"}],
   links:[{label:"CPC 06 (R2) – CFC",url:"https://www.cpc.org.br/CPC/Documentos-Emitidos/Pronunciamentos/Pronunciamento?Id=57"},{label:"IFRS 16 – IASB",url:"https://www.ifrs.org/issued-standards/list-of-standards/ifrs-16-leases/"}]},

  {id:13,disc:"Contabilidade Avançada",tema:"Combinação de Negócios – CPC 15",dif:"Alta",ref:"FCC/SEFAZ-BA/2019",
   enunciado:"Na aquisição de uma controlada pelo método de aquisição (CPC 15), o goodwill é reconhecido quando:",
   alt:["A) O valor pago for inferior ao valor justo líquido dos ativos/passivos identificáveis (compra vantajosa).","B) A contraprestação + participação de não controladores exceder o valor justo líquido dos ativos/passivos identificáveis.","C) O valor contábil do investimento for superior ao valor patrimonial da investida.","D) A adquirida possuir marca ou carteira de clientes não registrados.","E) A adquirente optar por não testar o goodwill anualmente."],
   gab:"B",com:"CPC 15 (IFRS 3): Goodwill = (Contraprestação + PNC + Interesse previamente detido) − VJL ativos/passivos. Positivo → GOODWILL (intangível, não amortizável, teste de impairment anual). Negativo → COMPRA VANTAJOSA, reconhecida no resultado imediatamente. A: descreve compra vantajosa — o oposto do goodwill.",
   yt:[{label:"CPC 15 – Combinação de Negócios – Goodwill",url:"https://www.youtube.com/results?search_query=CPC+15+combinacao+negocios+goodwill+concurso+contabilidade"}],
   links:[{label:"CPC 15 (R1) – CFC",url:"https://www.cpc.org.br/CPC/Documentos-Emitidos/Pronunciamentos/Pronunciamento?Id=46"},{label:"IFRS 3 – IASB",url:"https://www.ifrs.org/issued-standards/list-of-standards/ifrs-3-business-combinations/"}]},

  {id:14,disc:"Contabilidade de Custos",tema:"Ponto de Equilíbrio",dif:"Média",ref:"FCC/SEFAZ-RJ/2014",
   enunciado:"Uma empresa tem: Preço de venda = R$ 200/un; Custo variável = R$ 120/un; Custos fixos = R$ 400.000/mês. O ponto de equilíbrio contábil (em unidades) e a margem de contribuição unitária são, respectivamente:",
   alt:["A) 2.000 unidades e R$ 80,00.","B) 5.000 unidades e R$ 80,00.","C) 3.333 unidades e R$ 120,00.","D) 2.000 unidades e R$ 120,00.","E) 5.000 unidades e R$ 120,00."],
   gab:"B",com:"MC unitária = PV − CV = 200 − 120 = R$ 80,00. PE contábil = CF/MC = 400.000/80 = 5.000 unidades. Verificação: 5.000×200=1.000.000 receita; 5.000×120=600.000 CV; CF=400.000 → Lucro = 0 ✓. A: seria o PE em receita dividido pelo PV (≠ unidades). FCC cobra cálculo numérico direto.",
   yt:[{label:"Ponto de Equilíbrio – Contabilidade de Custos",url:"https://www.youtube.com/results?search_query=ponto+de+equil%C3%ADbrio+contabilidade+custos+concurso"}],
   links:[{label:"Ponto de Equilíbrio – Khan Academy",url:"https://pt.khanacademy.org/economics-finance-domain/core-finance/accounting-and-financial-stateme/v/fixed-variable-and-marginal-cost"},{label:"Contabilidade de Custos – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/contabilidade-de-custos/"}]},

  {id:15,disc:"Contabilidade Geral e Pública",tema:"Receita Pública – Estágios",dif:"Média",ref:"FCC/SEFAZ estilo MCASP",
   enunciado:"De acordo com o MCASP 11ª ed., os estágios da receita orçamentária são, em ordem:",
   alt:["A) Previsão → Lançamento → Arrecadação → Recolhimento.","B) Fixação → Empenho → Liquidação → Pagamento.","C) Previsão → Empenho → Arrecadação → Recolhimento.","D) Lançamento → Arrecadação → Recolhimento → Fiscalização.","E) Previsão → Arrecadação → Liquidação → Recolhimento."],
   gab:"A",com:"Receita Orçamentária: Previsão (LOA) → Lançamento (ato fiscal, art. 53 Lei 4.320) → Arrecadação (pagamento ao agente arrecadador) → Recolhimento (entrega ao Tesouro). B: são estágios da DESPESA. FCC cobra com frequência a distinção entre os estágios de receita e despesa.",
   yt:[{label:"Estágios da Receita e Despesa Pública – MCASP",url:"https://www.youtube.com/results?search_query=est%C3%A1gios+receita+despesa+p%C3%BAblica+MCASP+concurso+fiscal"}],
   links:[{label:"MCASP 11ª Edição – STN",url:"https://www.gov.br/tesouronacional/pt-br/contabilidade-e-custos/federacao/manualcontabilidadeaplicadaaossetorpublico"},{label:"Lei 4.320/64 – Planalto",url:"https://www.planalto.gov.br/ccivil_03/leis/l4320.htm"}]},

  {id:16,disc:"Contabilidade Geral e Pública",tema:"NBC TSP – Características Qualitativas",dif:"Alta",ref:"FCC/SEFAZ-CE 2026 estilo",
   enunciado:"De acordo com a NBC TSP Estrutura Conceitual, as características qualitativas da informação contábil são:",
   alt:["A) Relevância, representação fidedigna, comparabilidade, verificabilidade, tempestividade e compreensibilidade.","B) Relevância, confiabilidade, consistência e prudência.","C) Objetividade, materialidade, conservadorismo e tempestividade.","D) Fidedignidade, neutralidade, completude e prudência, apenas.","E) Relevância, compreensibilidade, uniformidade e objetividade."],
   gab:"A",com:"NBC TSP Estrutura Conceitual: Características FUNDAMENTAIS: (1) RELEVÂNCIA (valor preditivo + confirmatório + materialidade); (2) REPRESENTAÇÃO FIDEDIGNA (completa, neutra, livre de erros). Características de MELHORIA: comparabilidade, verificabilidade, tempestividade e compreensibilidade. B e D: modelo ANTIGO (NBC T 16.4), já superado.",
   yt:[{label:"NBC TSP – Estrutura Conceitual Setor Público",url:"https://www.youtube.com/results?search_query=NBC+TSP+estrutura+conceitual+caracter%C3%ADsticas+qualitativas+concurso"}],
   links:[{label:"NBC TSP – CFC",url:"https://cfc.org.br/tecnica/normas-brasileiras-de-contabilidade/nbc-tsp-do-setor-publico/"},{label:"IPSAS – IFAC",url:"https://www.ifac.org/public-sector/ipsasb-pronouncements"}]},

  {id:17,disc:"Direito Financeiro",tema:"LRF – Despesas de Pessoal",dif:"Alta",ref:"FCC/SEFAZ-BA/2019",
   enunciado:"A LRF (LC 101/2000) estabelece para o Poder Executivo dos Estados os seguintes limites para despesas com pessoal:",
   alt:["A) Limite global de 60% da RCL para o Estado; Executivo estadual: 49% da RCL.","B) Limite global de 50% da RCL; Executivo estadual: 40% da RCL.","C) Limite global de 60% da RCL; Executivo estadual: 45% da RCL.","D) Limite global de 65% da RCL; Executivo estadual: 49% da RCL.","E) Limite global de 60% da RCL; Executivo estadual: 54% da RCL."],
   gab:"A",com:"LRF art. 19: Estados = 60% RCL. Art. 20, I: Legislativo (incl. TC): 3%; Judiciário: 6%; Executivo: 49%; MP: 2% = 60%. União: 50% (Executivo 40,9%). Municípios: 60% (Executivo 54%). Mnemônico: ESTADOS=60/49 | UNIÃO=50/40,9 | MUNICÍPIOS=60/54. FCC cobra os percentuais literais.",
   yt:[{label:"LRF – Limites de Despesas de Pessoal",url:"https://www.youtube.com/results?search_query=LRF+limite+despesas+pessoal+estados+uni%C3%A3o+munic%C3%ADpios+concurso"}],
   links:[{label:"LC 101/2000 – LRF – Planalto",url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm"},{label:"LRF – Tesouro Nacional",url:"https://www.gov.br/tesouronacional/pt-br/execucao-orcamentaria-e-financeira/lei-de-responsabilidade-fiscal"}]},

  {id:18,disc:"Direito Financeiro",tema:"LRF – Vedações ao Final do Mandato",dif:"Alta",ref:"FCC/SEFAZ-CE estilo",
   enunciado:"A LRF veda ao titular de Poder ou órgão, nos últimos dois quadrimestres do mandato:",
   alt:["A) Contrair qualquer operação de crédito, mesmo com disponibilidade financeira.","B) Contrair obrigação de despesa que não possa ser cumprida integralmente no exercício ou que tenha parcelas no exercício seguinte sem suficiente disponibilidade de caixa.","C) Conceder reajuste salarial para servidores públicos.","D) Realizar transferências voluntárias para outros entes.","E) Publicar relatório de gestão fiscal."],
   gab:"B",com:"Art. 42, LRF: vedação de contrair obrigação de despesa que não possa ser paga no exercício ou que deixe restos a pagar sem disponibilidade financeira. É a cláusula de responsabilidade na transição de governo. Art. 21: vedação de aumento de pessoal nos 180 dias anteriores ao fim do mandato. A publicidade (E) é OBRIGATÓRIA em qualquer momento.",
   yt:[{label:"LRF – Art 42 – Vedações Final de Mandato",url:"https://www.youtube.com/results?search_query=LRF+art+42+veda%C3%A7%C3%B5es+final+mandato+concurso+fiscal"}],
   links:[{label:"Art. 42 LRF – Planalto",url:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm"},{label:"LRF Comentada – STN",url:"https://www.gov.br/tesouronacional/pt-br/execucao-orcamentaria-e-financeira/lei-de-responsabilidade-fiscal"}]},

  {id:19,disc:"Auditoria",tema:"Fraude e Erro – NBC TA 240",dif:"Alta",ref:"FCC/SEFAZ estilo",
   enunciado:"Segundo a NBC TA 240 (R1), é correto afirmar:",
   alt:["A) O auditor tem responsabilidade primária pela prevenção e detecção de fraudes.","B) A administração é a principal responsável pela prevenção; o auditor planeja a auditoria para obter segurança razoável de que as DCs estão livres de distorção relevante, inclusive por fraude.","C) Fraude imaterial dispensa o auditor de comunicar a administração.","D) O auditor deve garantir que todas as fraudes sejam detectadas.","E) Fraude e erro têm o mesmo tratamento na auditoria."],
   gab:"B",com:"NBC TA 240: responsabilidade PRIMÁRIA = administração (sistema de controles internos). Auditor obtém SEGURANÇA RAZOÁVEL (não absoluta) sobre distorções RELEVANTES. Fraude (intencional) ≠ Erro (involuntário). Qualquer fraude, mesmo imaterial, deve ser comunicada à administração. 'Todas as fraudes' é impossível — segurança razoável, não absoluta.",
   yt:[{label:"NBC TA 240 – Fraude e Erro em Auditoria",url:"https://www.youtube.com/results?search_query=NBC+TA+240+fraude+erro+auditoria+concurso"}],
   links:[{label:"NBC TA 240 (R1) – CFC",url:"https://cfc.org.br/tecnica/normas-brasileiras-de-contabilidade/nbc-ta-de-auditoria-independente/"},{label:"Auditoria – Fraude e Erro – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/auditoria-contabil/"}]},

  {id:20,disc:"Auditoria",tema:"Controles Internos – COSO",dif:"Alta",ref:"FCC/SEFAZ-CE 2026 estilo",
   enunciado:"O framework COSO 2013 define três categorias de objetivos do controle interno. Essas categorias são:",
   alt:["A) Operacional, conformidade e prestação de contas.","B) Eficiência, eficácia e economicidade.","C) Operacional, de relatórios e de conformidade.","D) Estratégico, tático e operacional.","E) Financeiro, legal e reputacional."],
   gab:"C",com:"COSO 2013 — três categorias de objetivos: (1) OPERACIONAL: eficiência/eficácia das operações, salvaguarda de ativos; (2) RELATÓRIOS (Reporting): confiabilidade dos relatórios financeiros e não financeiros; (3) CONFORMIDADE (Compliance): leis e regulamentos. 5 componentes: Ambiente de Controle, Avaliação de Riscos, Atividades de Controle, Informação e Comunicação, Monitoramento. B: critérios do TCU.",
   yt:[{label:"COSO 2013 – Framework de Controle Interno",url:"https://www.youtube.com/results?search_query=COSO+2013+framework+controle+interno+concurso+fiscal"}],
   links:[{label:"COSO Framework – Site Oficial",url:"https://www.coso.org/pages/ic.aspx"},{label:"Controles Internos COSO – TCU",url:"https://portal.tcu.gov.br/governanca/governancapublica/"}]},

  {id:21,disc:"Economia",tema:"Elasticidade-Preço da Demanda",dif:"Média",ref:"FCC/SEFAZ estilo",
   enunciado:"Se a elasticidade-preço da demanda de um bem é |Ed| = 0,4, pode-se afirmar que:",
   alt:["A) A demanda é elástica — variação % no preço gera variação maior na quantidade.","B) A demanda é inelástica — variação % no preço gera variação proporcionalmente menor na quantidade.","C) A demanda é unitária — o efeito do preço sobre a quantidade é neutro.","D) A demanda é perfeitamente inelástica — a quantidade não varia com o preço.","E) A demanda é perfeitamente elástica — qualquer variação de preço zera a demanda."],
   gab:"B",com:"|Ed| = 0,4 < 1 → INELÁSTICA. Aumento de 1% no preço reduz quantidade em apenas 0,4%. Implicação tributária: bens inelásticos suportam alíquotas maiores com menor perda de arrecadação (menor peso morto) — Regra de Ramsey. Exemplos: cigarros, combustíveis, medicamentos essenciais.",
   yt:[{label:"Elasticidade-Preço da Demanda – Economia",url:"https://www.youtube.com/results?search_query=elasticidade+pre%C3%A7o+demanda+economia+concurso+fiscal"}],
   links:[{label:"Elasticidade – Khan Academy PT",url:"https://pt.khanacademy.org/economics-finance-domain/microeconomics/elasticity-tutorial"},{label:"Tributação e Elasticidade – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/economia-para-concursos/"}]},

  {id:22,disc:"Economia",tema:"Curva de Laffer",dif:"Média",ref:"FCC/SEFAZ estilo",
   enunciado:"A Curva de Laffer demonstra que:",
   alt:["A) Aumentos de alíquota sempre resultam em aumentos proporcionais de arrecadação.","B) Existe uma alíquota ótima além da qual aumentos de alíquota reduzem a arrecadação total, pois os agentes alteram seu comportamento.","C) A arrecadação é máxima quando a alíquota é zero.","D) A relação entre alíquota e arrecadação é sempre linear e positiva.","E) Reduções de alíquota sempre aumentam a arrecadação pela expansão da base tributária."],
   gab:"B",com:"Curva de Laffer: alíquota 0% → arrecadação 0; alíquota 100% → arrecadação 0 (ninguém trabalha/declara); ponto máximo entre esses extremos. Acima da alíquota ótima, aumentar a tributação REDUZ a arrecadação (evasão, informalidade, retração). Redução de alíquota pode aumentar arrecadação se a economia estiver além do ponto ótimo — mas não é garantido.",
   yt:[{label:"Curva de Laffer – Tributação e Arrecadação",url:"https://www.youtube.com/results?search_query=curva+de+laffer+tributa%C3%A7%C3%A3o+arrecada%C3%A7%C3%A3o+concurso+fiscal"}],
   links:[{label:"Curva de Laffer – Enciclopédia do Investidor",url:"https://www.google.com/search?q=curva+de+laffer+explica%C3%A7%C3%A3o"},{label:"Economia da Tributação – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/economia-para-concursos/"}]},

  {id:23,disc:"Administração e Governança Pública",tema:"Modelo das Três Linhas",dif:"Alta",ref:"FCC/SEFAZ-CE 2026 estilo",
   enunciado:"O Modelo das Três Linhas (IIA 2020) distribui responsabilidades da seguinte forma:",
   alt:["A) 1ª linha: auditoria interna; 2ª linha: gestão de riscos e compliance; 3ª linha: controle externo.","B) 1ª linha: gestão operacional (proprietários de risco); 2ª linha: funções de gestão de risco e compliance; 3ª linha: auditoria interna.","C) 1ª linha: conselho de administração; 2ª linha: alta administração; 3ª linha: auditoria interna.","D) 1ª linha: controle externo; 2ª linha: auditoria interna; 3ª linha: gestão operacional.","E) 1ª linha: compliance; 2ª linha: auditoria interna; 3ª linha: controle externo."],
   gab:"B",com:"Modelo das Três Linhas (IIA 2020): 1ª LINHA = gestão operacional (quem assume e gerencia riscos no dia a dia). 2ª LINHA = funções especializadas de suporte: compliance, controle interno, gestão de riscos. 3ª LINHA = AUDITORIA INTERNA (avaliação independente). Acima: Órgãos de Governança (conselho) e Partes Externas (auditores externos, reguladores).",
   yt:[{label:"Modelo das Três Linhas de Defesa – Governança Pública",url:"https://www.youtube.com/results?search_query=tr%C3%AAs+linhas+defesa+governan%C3%A7a+p%C3%BAblica+IIA+concurso"}],
   links:[{label:"IIA – Modelo das Três Linhas 2020",url:"https://www.theiia.org/en/standards/the-iiapositional-papers/the-iia-three-lines-model/"},{label:"Governança Pública – TCU",url:"https://portal.tcu.gov.br/governanca/governancapublica/"}]},

  {id:24,disc:"Administração e Governança Pública",tema:"Improbidade Administrativa – Lei 14.230/2021",dif:"Alta",ref:"FCC/SEFAZ-CE 2026 estilo",
   enunciado:"Com as alterações da Lei nº 14.230/2021 à LIA (Lei 8.429/1992), é correto afirmar:",
   alt:["A) A improbidade pode ser configurada por conduta culposa (imprudência, negligência ou imperícia).","B) O dolo específico passou a ser requisito para a configuração de ato de improbidade.","C) O MP perdeu a legitimidade para propor ação de improbidade — qualquer cidadão pode ajuizá-la.","D) A prescrição para propositura da ação continua sendo de 5 anos após o término do mandato.","E) As sanções da LIA independem da ocorrência de dano ao erário."],
   gab:"B",com:"Lei 14.230/2021 – principais mudanças: (B) CORRETA – exige DOLO ESPECÍFICO; culpa NÃO configura mais improbidade. (A) ERRADA – culpa foi excluída. (C) ERRADA – legitimidade ativa agora é EXCLUSIVA do MP. (D) ERRADA – prescrição: 8 anos do fato ou 4 anos após término do vínculo. (E) ERRADA – nas modalidades que exigem lesão ao erário, o dano é elementar.",
   yt:[{label:"Lei 14.230/2021 – Nova Lei de Improbidade Administrativa",url:"https://www.youtube.com/results?search_query=lei+14230+2021+nova+lei+improbidade+administrativa+concurso"}],
   links:[{label:"Lei 14.230/2021 – Planalto",url:"https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14230.htm"},{label:"Improbidade Administrativa – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/improbidade-administrativa/"}]},

  {id:25,disc:"Direito Constitucional, Administrativo, Civil e Penal",tema:"Princípios da Administração Pública",dif:"Média",ref:"FCC estilo",
   enunciado:"Os princípios expressos da Administração Pública previstos no art. 37, caput, da CF/88 são:",
   alt:["A) Legalidade, impessoalidade, moralidade, publicidade e eficiência.","B) Legalidade, legitimidade, economicidade, publicidade e eficiência.","C) Legalidade, impessoalidade, moralidade, proporcionalidade e eficiência.","D) Legalidade, razoabilidade, moralidade, publicidade e eficiência.","E) Supremacia do interesse público, autotutela, indisponibilidade, publicidade e eficiência."],
   gab:"A",com:"LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência (EC 19/98 incluiu eficiência). B: legitimidade e economicidade = controle externo (art. 70 CF). C e D: proporcionalidade e razoabilidade são princípios IMPLÍCITOS. E: supremacia e indisponibilidade são do regime jurídico-administrativo, não estão no art. 37.",
   yt:[{label:"Princípios da Administração Pública – LIMPE",url:"https://www.youtube.com/results?search_query=princ%C3%ADpios+administra%C3%A7%C3%A3o+p%C3%BAblica+LIMPE+concurso"}],
   links:[{label:"CF/88 art. 37 – Planalto",url:"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"},{label:"Princípios Admin. Pública – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/principios-da-administracao-publica/"}]},

  {id:26,disc:"Direito Constitucional, Administrativo, Civil e Penal",tema:"Nova Lei de Licitações",dif:"Alta",ref:"FCC/SEFAZ-CE 2026 estilo",
   enunciado:"A Lei nº 14.133/2021 introduziu o 'diálogo competitivo', que se aplica quando:",
   alt:["A) O valor estimado for superior ao limite do pregão eletrônico.","B) A Administração precisar contratar objeto que envolva inovação tecnológica, impossibilidade de definir meios para satisfazer as necessidades, ou necessidade de solução que não existe no mercado.","C) Houver pelo menos 3 licitantes e o objeto for de natureza comum.","D) A licitação for realizada exclusivamente por meios eletrônicos com disputa por lances.","E) O objeto consistir em serviços técnicos especializados de natureza intelectual."],
   gab:"B",com:"Art. 32, Lei 14.133/21: DIÁLOGO COMPETITIVO para objetos que envolvam: inovação tecnológica/técnica; impossibilidade de definição prévia dos meios; necessidade de solução inexistente no mercado em condições ótimas. A Administração DIALOGA com licitantes antes de definir o objeto. Modalidade nova, cobrada nas provas pós-2021.",
   yt:[{label:"Nova Lei de Licitações 14.133/2021 – Diálogo Competitivo",url:"https://www.youtube.com/results?search_query=lei+14133+2021+di%C3%A1logo+competitivo+licita%C3%A7%C3%B5es+concurso"}],
   links:[{label:"Lei 14.133/2021 – Planalto",url:"https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm"},{label:"Nova Lei de Licitações – TCU",url:"https://portal.tcu.gov.br/licitacoes-e-contratos/"}]},

  {id:27,disc:"Língua Portuguesa",tema:"Concordância Verbal",dif:"Média",ref:"FCC estilo",
   enunciado:"Assinale a alternativa em que a concordância verbal está correta:",
   alt:["A) Fazem dez anos que o auditor trabalha na Sefaz.","B) Houveram muitas irregularidades detectadas na auditoria.","C) Os dados e o relatório que foram enviados à autoridade competente constam do processo.","D) A maioria dos contribuintes declararam seus rendimentos dentro do prazo.","E) É necessário maiores esclarecimentos sobre o lançamento tributário."],
   gab:"C",com:"C: CORRETA – sujeito composto 'os dados e o relatório' → verbo no plural 'constam'. A: 'fazer' com sentido de tempo decorrido é IMPESSOAL → 'Faz dez anos'. B: 'haver' = existir é IMPESSOAL → 'Houve irregularidades'. D: 'a maioria de + plural' → padrão formal FCC = singular 'declarou'. E: 'necessário' concorda com o sujeito → 'São necessários maiores esclarecimentos'.",
   yt:[{label:"Concordância Verbal – Questões FCC",url:"https://www.youtube.com/results?search_query=concord%C3%A2ncia+verbal+quest%C3%B5es+FCC+concurso"}],
   links:[{label:"Concordância Verbal – Gramática",url:"https://www.google.com/search?q=concord%C3%A2ncia+verbal+regras+gramatica+portuguesa"},{label:"Português para Concursos – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/portugues/"}]},

  {id:28,disc:"Matemática Financeira e Raciocínio Lógico",tema:"Juros Compostos",dif:"Média",ref:"FCC estilo",
   enunciado:"Um capital de R$ 10.000,00 é aplicado à taxa de 2% ao mês (juros compostos). Qual o montante após 3 meses? (Dado: 1,02³ = 1,0612)",
   alt:["A) R$ 10.600,00","B) R$ 10.612,00","C) R$ 10.620,00","D) R$ 10.200,00","E) R$ 10.060,12"],
   gab:"B",com:"M = C × (1+i)ⁿ = 10.000 × 1,0612 = R$ 10.612,00. Juros = R$ 612,00. Em juros SIMPLES: J = 10.000×0,02×3 = 600 → M = 10.600 (A: seria juros simples). A diferença de R$ 12 = 'juros sobre juros' característico dos compostos. FCC fornece o fator — use-o diretamente.",
   yt:[{label:"Juros Compostos – Matemática Financeira para Concursos",url:"https://www.youtube.com/results?search_query=juros+compostos+matem%C3%A1tica+financeira+concurso+fiscal"}],
   links:[{label:"Matemática Financeira – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/matematica-financeira/"},{label:"Juros Compostos – Khan Academy PT",url:"https://pt.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial"}]},

  {id:29,disc:"Matemática Financeira e Raciocínio Lógico",tema:"Sistema SAC",dif:"Alta",ref:"FCC/SEFAZ-RS/2018",
   enunciado:"Empréstimo de R$ 60.000,00 amortizado em 3 parcelas pelo SAC, taxa de 10% ao período. A 2ª prestação é:",
   alt:["A) R$ 26.000,00","B) R$ 24.000,00","C) R$ 22.000,00","D) R$ 20.000,00","E) R$ 18.000,00"],
   gab:"B",com:"Amortização constante = 60.000/3 = R$ 20.000. 1ª prestação: Juros=6.000 + Amort=20.000 = R$ 26.000. SD após 1ª = R$ 40.000. 2ª prestação: Juros=4.000 + Amort=20.000 = R$ 24.000 ✓. SD após 2ª = R$ 20.000. 3ª: Juros=2.000 + Amort=20.000 = R$ 22.000. No SAC as prestações são DECRESCENTES; no Price (francês) são CONSTANTES.",
   yt:[{label:"Sistema SAC vs Price – Amortização – Matemática Financeira",url:"https://www.youtube.com/results?search_query=sistema+SAC+Price+amortiza%C3%A7%C3%A3o+matem%C3%A1tica+financeira+concurso"}],
   links:[{label:"Amortização SAC – Calculadora",url:"https://www.calcule.online/amortizacao-sac"},{label:"Matemática Financeira – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/matematica-financeira/"}]},

  {id:30,disc:"Fluência de Dados",tema:"SQL – HAVING vs WHERE",dif:"Média",ref:"FCC/SEFAZ-CE 2026 estilo",
   enunciado:"Considere: SELECT UF, SUM(VALOR_ICMS) AS TOTAL FROM ARRECADACAO WHERE ANO=2024 GROUP BY UF HAVING SUM(VALOR_ICMS) > 1000000 ORDER BY TOTAL DESC. Essa consulta retorna:",
   alt:["A) Soma do ICMS de todas as UFs em 2024, sem filtro de valor.","B) ICMS individual de cada contribuinte por UF.","C) Total de ICMS por UF em 2024, apenas para UFs com arrecadação > R$ 1.000.000, em ordem decrescente.","D) Média do ICMS por UF em 2024, filtrado pelo HAVING.","E) Número de registros por UF em ordem crescente."],
   gab:"C",com:"WHERE ANO=2024: filtra linhas ANTES do agrupamento. GROUP BY UF: agrupa por estado. HAVING SUM > 1M: filtra GRUPOS após agrupamento (≠ WHERE). ORDER BY TOTAL DESC: ordena do maior para o menor. HAVING filtra grupos; WHERE filtra linhas individuais — distinção crítica e recorrente em provas de Fluência de Dados.",
   yt:[{label:"SQL – HAVING vs WHERE – Diferença",url:"https://www.youtube.com/results?search_query=SQL+HAVING+vs+WHERE+diferen%C3%A7a+concurso+banco+dados"}],
   links:[{label:"SQL Tutorial – W3Schools PT",url:"https://www.w3schools.com/sql/"},{label:"SQL para Concursos – Estratégia",url:"https://www.estrategiaconcursos.com.br/blog/tecnologia-da-informacao/"}]},
];

// IDs para o simulado (30 questões do banco)
const SIM_IDS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
const SIM_QS = BANCO.filter(q => SIM_IDS.includes(q.id));
const DISCS = [...new Set(BANCO.map(q => q.disc))];
const COR_DISC = {"Direito Tributário":"#ef4444","Legislação Tributária":"#f97316","Contabilidade Avançada":"#8b5cf6","Contabilidade de Custos":"#a855f7","Contabilidade Geral e Pública":"#6366f1","Direito Financeiro":"#14b8a6","Auditoria":"#22c55e","Economia":"#3b82f6","Administração e Governança Pública":"#f59e0b","Direito Constitucional, Administrativo, Civil e Penal":"#ec4899","Língua Portuguesa":"#84cc16","Matemática Financeira e Raciocínio Lógico":"#06b6d4","Fluência de Dados":"#d946ef","Finanças Públicas":"#10b981"};
const COR_PR = {"CRÍTICA":"#dc2626","MUITO ALTA":"#ef4444","ALTA":"#f59e0b","MÉDIA-ALTA":"#10b981"};

// Sugestões de estudo por disciplina
const SUGESTOES = {
  "Direito Tributário":"Revise o CTN completo com foco em obrigação tributária, lançamento, crédito tributário, decadência e prescrição. Estude a Reforma Tributária (EC 132/2023 e LC 214/2025) — é prioridade absoluta para 2026.",
  "Legislação Tributária":"Faça leitura integral da LC 87/96 (Lei Kandir) e da legislação do ICMS do Ceará (Lei 18.665/2023 e Dec. 33.327/2019). Estude os convênios CONFAZ e a sistemática do Simples Nacional.",
  "Contabilidade Avançada":"Revise CPC 46 (valor justo), CPC 06 R2 (arrendamento), CPC 15 (combinações de negócios), CPC 48 (instrumentos financeiros) e CPC 07 (subvenções). Resolva questões com cálculo numérico.",
  "Contabilidade de Custos":"Pratique cálculos de ponto de equilíbrio (contábil, econômico e financeiro), margem de contribuição e os três métodos de custeio (absorção, variável e ABC).",
  "Contabilidade Geral e Pública":"Estude o MCASP 11ª edição na íntegra, especialmente os procedimentos orçamentários e patrimoniais. Revise a NBC TSP Estrutura Conceitual e as principais NBC TSPs.",
  "Direito Financeiro":"Leia a LRF (LC 101/2000) com foco nos limites de despesas de pessoal, vedações ao final do mandato e resultado fiscal. Revise a Lei 4.320/64 — estágios da receita e despesa.",
  "Auditoria":"Estude as NBC TAs indicadas no edital (NBC TA 240, 300, 315, 500, 700). Domine o COSO 2013 e o Modelo das Três Linhas de Defesa (IIA 2020).",
  "Economia":"Revise elasticidades, estruturas de mercado, curva de Laffer, regra de Ramsey e as funções clássicas do governo de Musgrave. Estude macroeconomia: IS-LM, PIB e resultado fiscal.",
  "Administração e Governança Pública":"Aprofunde o Modelo das Três Linhas (IIA 2020), gestão de riscos (ISO 31000), COBIT e o programa de integridade do Poder Executivo do Ceará. Revise a Lei 14.230/2021 (improbidade).",
  "Direito Constitucional, Administrativo, Civil e Penal":"Foque na Nova Lei de Licitações (14.133/2021), Lei de Improbidade (8.429/1992 c/ alterações da 14.230/2021) e crimes contra a ordem tributária (Lei 8.137/90). Revise os princípios do art. 37 CF.",
  "Língua Portuguesa":"Pratique questões da FCC de concordância verbal e nominal, regência verbal e nominal, e interpretação de texto. A banca cobra gramática dentro do contexto textual.",
  "Matemática Financeira e Raciocínio Lógico":"Pratique juros compostos, amortização SAC e Price com cálculos numéricos completos. Para raciocínio lógico: proposições, silogismos e validade de argumentos são prioritários.",
  "Fluência de Dados":"Estude SQL (SELECT, GROUP BY, HAVING, JOIN, funções de agregação). Revise as arquiteturas de dados (DW, Data Lake, Lakehouse) e a LGPD, especialmente as bases legais para tratamento de dados.",
  "Finanças Públicas":"Revise as funções de Musgrave (alocativa, distributiva, estabilizadora), bens públicos, externalidades e a diferença entre resultado primário e nominal. Estude tributação e equidade.",
};

// ─── TELA DE LOGIN ────────────────────────────────────

function Bdg({children,cor=C.gold,bg}){return <span style={{background:bg||cor+"22",border:`1px solid ${cor}`,borderRadius:4,padding:"2px 8px",fontSize:11,color:cor,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;}
function fmt(s){const m=Math.floor(s/60),sec=s%60;return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;}

const TABS_GUIA=["Visão Geral","Disciplinas","Cronograma","Banco de Questões","Discursivas","Estratégia FCC","🎯 Simulados por Disciplina","⚖️ Leis, Fontes e Jurisprudências"];

// ─── COMPONENTE DE FEEDBACK IMEDIATO ─────────────────
function FeedbackQuestao({q, resposta, onProxima, isUltima, onFinalizar}) {
  const acertou = resposta === q.gab;
  const altCorreta = q.alt.find(a => a[0] === q.gab);
  const altSelecionada = q.alt.find(a => a[0] === resposta);
  return (
    <div style={{marginTop:16}}>
      {/* Banner acertou/errou */}
      <div style={{background:acertou?"#16a34a22":"#dc262622",border:`2px solid ${acertou?C.green:C.red}`,borderRadius:12,padding:"16px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:14}}>
        <span style={{fontSize:36}}>{acertou?"✅":"❌"}</span>
        <div>
          <div style={{fontWeight:700,fontSize:18,color:acertou?C.green:C.red,marginBottom:4}}>
            {acertou?"Você acertou! Excelente!":"Você errou. Não desanime!"}
          </div>
          {!acertou&&(
            <div style={{fontSize:13,color:C.text}}>
              <span style={{color:C.muted}}>Sua resposta: </span>
              <span style={{color:C.red,fontWeight:700}}>{resposta}) {altSelecionada?.slice(3)}</span>
              <span style={{color:C.muted,margin:"0 8px"}}>|</span>
              <span style={{color:C.muted}}>Resposta correta: </span>
              <span style={{color:C.green,fontWeight:700}}>{q.gab}) {altCorreta?.slice(3)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Comentário explicativo */}
      <div style={{background:"#0f2647",border:"1px solid #1e3a5f",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
        <div style={{fontWeight:700,color:"#7bb3e8",marginBottom:8,fontSize:13,display:"flex",alignItems:"center",gap:6}}>
          📖 Comentário do Professor
        </div>
        <p style={{margin:0,fontSize:12,color:C.text,lineHeight:1.9}}>{q.com}</p>
        <div style={{marginTop:8,fontSize:11,color:C.muted,fontStyle:"italic"}}>📚 Referência: {q.ref}</div>
      </div>

      {/* Links YouTube */}
      {q.yt&&q.yt.length>0&&(
        <div style={{background:"#1a0a0a",border:"1px solid #7f1d1d",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
          <div style={{fontWeight:700,color:"#f87171",marginBottom:8,fontSize:12,display:"flex",alignItems:"center",gap:6}}>
            ▶️ Videoaulas Recomendadas
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {q.yt.map((l,i)=>(
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                style={{display:"flex",alignItems:"center",gap:8,background:"#7f1d1d22",border:"1px solid #7f1d1d",borderRadius:6,padding:"7px 10px",textDecoration:"none",color:"#fca5a5",fontSize:12,transition:"background 0.2s"}}>
                <span style={{fontSize:16}}>🎬</span>
                <span>{l.label}</span>
                <span style={{marginLeft:"auto",fontSize:10,color:"#7f1d1d"}}>YouTube →</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Links de pesquisa */}
      {q.links&&q.links.length>0&&(
        <div style={{background:"#0a1520",border:"1px solid #1e3a5f",borderRadius:10,padding:"12px 14px",marginBottom:16}}>
          <div style={{fontWeight:700,color:"#93c5fd",marginBottom:8,fontSize:12,display:"flex",alignItems:"center",gap:6}}>
            🔗 Fontes e Links de Pesquisa
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {q.links.map((l,i)=>(
              <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                style={{display:"flex",alignItems:"center",gap:6,background:"#1e3a5f",border:"1px solid #2d5a8e",borderRadius:6,padding:"6px 10px",textDecoration:"none",color:"#93c5fd",fontSize:11}}>
                🌐 {l.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Botão próxima/finalizar */}
      <div style={{display:"flex",justifyContent:"flex-end"}}>
        {isUltima
          ? <button onClick={onFinalizar} style={{background:C.green,color:"#fff",border:"none",borderRadius:8,padding:"11px 26px",cursor:"pointer",fontWeight:700,fontSize:14}}>Ver Resultado Final →</button>
          : <button onClick={onProxima} style={{background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"11px 26px",cursor:"pointer",fontWeight:700,fontSize:14}}>Próxima Questão →</button>
        }
      </div>
    </div>
  );
}

// ─── COMPONENTE RESULTADO FINAL ───────────────────────
function ResultadoFinal({simResp, onReiniciar, onGuia, historico=[]}) {
  const total = SIM_QS.length;
  let ac=0, er=0, br=0;
  const pd = {};
  const erradas = [];

  SIM_QS.forEach(q => {
    const resp = simResp[q.id];
    const d = q.disc;
    if (!pd[d]) pd[d] = {ac:0,er:0,tot:0};
    pd[d].tot++;
    if (!resp) { br++; pd[d].er++; }
    else if (resp === q.gab) { ac++; pd[d].ac++; }
    else { er++; pd[d].er++; erradas.push(q.disc); }
  });

  const pct = Math.round((ac/total)*100);
  const aprov = ac >= Math.round(total*0.6);

  // Disciplinas com pior desempenho
  const discOrdenadas = Object.entries(pd).sort((a,b) => {
    const pa = a[1].ac/a[1].tot, pb = b[1].ac/b[1].tot;
    return pa - pb;
  });
  const piores = discOrdenadas.filter(([,d]) => (d.ac/d.tot) < 0.6);

  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"Georgia,serif"}}>
      <div style={{background:"linear-gradient(135deg,#080e1a,#0d1b33)",borderBottom:`2px solid ${C.gold}`,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <Bdg cor={C.gold}>RESULTADO FINAL – SIMULADO SEFAZ/CE 2026</Bdg>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onReiniciar} style={{background:C.gold,color:"#000",border:"none",borderRadius:6,padding:"7px 14px",cursor:"pointer",fontWeight:700,fontSize:12}}>🔄 Novo Simulado</button>
          <button onClick={onGuia} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"7px 12px",cursor:"pointer",fontSize:12}}>← Guia</button>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"22px 14px"}}>
        {/* Placar geral */}
        <div style={{background:C.card,border:`2px solid ${aprov?C.green:C.red}`,borderRadius:14,padding:"28px 22px",marginBottom:22,textAlign:"center"}}>
          <div style={{fontSize:52,marginBottom:8}}>{aprov?"🏆":"📚"}</div>
          <h2 style={{margin:"0 0 4px",color:aprov?C.green:C.red,fontSize:22}}>{aprov?"Parabéns! Aprovado no Simulado!":"Você precisa de mais estudo. Não desista!"}</h2>
          <p style={{color:C.muted,margin:"0 0 20px",fontSize:13}}>{total} questões • Critério de aprovação: 60% de acertos</p>
          <div style={{display:"flex",justifyContent:"center",gap:18,flexWrap:"wrap"}}>
            {[{l:"Acertos",v:ac,c:C.green},{l:"Erros",v:er,c:C.red},{l:"Em branco",v:br,c:C.muted},{l:"Aproveitamento",v:pct+"%",c:pct>=60?C.gold:C.red}].map(it=>(
              <div key={it.l} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 20px",minWidth:90}}>
                <div style={{fontSize:28,fontWeight:700,color:it.c}}>{it.v}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>{it.l}</div>
              </div>
            ))}
          </div>
          {/* Barra de aproveitamento */}
          <div style={{margin:"20px auto 0",maxWidth:400}}>
            <div style={{height:10,background:C.border,borderRadius:5}}>
              <div style={{height:"100%",width:`${pct}%`,background:pct>=70?C.green:pct>=50?"#f59e0b":C.red,borderRadius:5,transition:"width 1s"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,color:C.muted}}>
              <span>0%</span><span style={{color:C.green}}>≥60% = aprovado</span><span>100%</span>
            </div>
          </div>
        </div>

        {/* Histórico de simulados */}
        {historico.length > 1 && (
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px",marginBottom:20}}>
            <h3 style={{color:C.gold,margin:"0 0 12px",fontSize:15}}>📈 Evolução dos Simulados</h3>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {historico.map((h,i)=>(
                <div key={i} style={{background:C.card2,border:`1px solid ${h.pct>=60?C.green:C.red}`,borderRadius:8,padding:"10px 14px",textAlign:"center",minWidth:70}}>
                  <div style={{fontSize:10,color:C.muted,marginBottom:2}}>Simulado {i+1}</div>
                  <div style={{fontSize:22,fontWeight:700,color:h.pct>=60?C.green:C.red}}>{h.pct}%</div>
                  <div style={{fontSize:10,color:C.muted}}>{h.ac}/{h.total} acertos</div>
                  {h.data && <div style={{fontSize:9,color:C.muted,marginTop:2}}>{h.data}</div>}
                </div>
              ))}
              {historico.length >= 2 && (
                <div style={{display:"flex",alignItems:"center",padding:"0 10px",color:C.muted,fontSize:12}}>
                  {historico[historico.length-1].pct > historico[0].pct
                    ? <span style={{color:C.green}}>📈 +{historico[historico.length-1].pct - historico[0].pct}pp de melhora!</span>
                    : historico[historico.length-1].pct < historico[0].pct
                    ? <span style={{color:C.red}}>📉 Revise os temas errados</span>
                    : <span>➡️ Desempenho estável</span>
                  }
                </div>
              )}
            </div>
          </div>
        )}

        {/* Desempenho por disciplina */}
        <h3 style={{color:C.gold,margin:"0 0 12px",fontSize:16}}>📊 Desempenho por Disciplina</h3>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:24}}>
          {discOrdenadas.map(([d,dt])=>{
            const p=Math.round((dt.ac/dt.tot)*100), cor=p>=70?C.green:p>=50?"#f59e0b":C.red;
            return (
              <div key={d} style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${cor}`,borderRadius:8,padding:"10px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,flexWrap:"wrap",gap:3}}>
                  <span style={{fontSize:12,color:C.text,fontWeight:600}}>{d}</span>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <span style={{fontSize:11,color:C.muted}}>{dt.ac} acerto(s) / {dt.tot} questão(ões)</span>
                    <span style={{fontSize:13,fontWeight:700,color:cor}}>{p}%</span>
                  </div>
                </div>
                <div style={{height:6,background:C.border,borderRadius:3}}>
                  <div style={{height:"100%",width:`${p}%`,background:cor,borderRadius:3}}/>
                </div>
              </div>
            );
          })}
        </div>

        {/* Análise e sugestão de estudos */}
        {piores.length>0&&(
          <div style={{marginBottom:24}}>
            <h3 style={{color:C.gold,margin:"0 0 12px",fontSize:16}}>🎯 Análise e Sugestão de Estudos</h3>
            <div style={{background:C.card,border:`1px solid ${C.gold}55`,borderRadius:10,padding:"16px"}}>
              <p style={{margin:"0 0 14px",fontSize:13,color:C.text,lineHeight:1.7}}>
                Com base no seu desempenho, as seguintes disciplinas precisam de atenção prioritária:
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {piores.map(([d,dt])=>{
                  const p=Math.round((dt.ac/dt.tot)*100);
                  const urgencia = p<30?"🔴 URGENTE":p<50?"🟠 ALTA PRIORIDADE":"🟡 ATENÇÃO";
                  return (
                    <div key={d} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:"13px 15px"}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:4}}>
                        <div style={{fontWeight:700,color:C.goldLight,fontSize:13}}>{urgencia} {d}</div>
                        <Bdg cor={p<30?C.red:p<50?"#f97316":"#f59e0b"}>{p}% de acertos</Bdg>
                      </div>
                      <p style={{margin:0,fontSize:12,color:C.muted,lineHeight:1.7}}>{SUGESTOES[d]||"Revise o conteúdo programático desta disciplina conforme o edital do concurso."}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Se zerou todas */}
        {piores.length===0&&(
          <div style={{background:"#16a34a22",border:`1px solid ${C.green}`,borderRadius:10,padding:"16px 18px",marginBottom:24}}>
            <div style={{fontWeight:700,color:C.green,fontSize:15,marginBottom:6}}>🏆 Desempenho Excelente em Todas as Disciplinas!</div>
            <p style={{margin:0,fontSize:12,color:C.text,lineHeight:1.7}}>Você atingiu ≥60% em todas as disciplinas. Continue mantendo a regularidade dos estudos e resolva mais questões para consolidar o conhecimento. Faça revisões semanais dos temas mais cobrados pela FCC.</p>
          </div>
        )}

        {/* Próximos passos */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px",marginBottom:24}}>
          <h4 style={{color:C.gold,margin:"0 0 12px",fontSize:14}}>📌 Próximos Passos Recomendados</h4>
          {[
            "Retorne ao Banco de Questões e filtre pelas disciplinas em que errou mais para praticar questões adicionais.",
            "Acesse os links e videoaulas exibidos nas questões erradas durante o simulado.",
            "Use o Cronograma de Estudos do Guia para organizar sua semana de revisão.",
            "Faça um novo simulado após 7 dias de estudo focado e compare seu desempenho.",
            "Revise os modelos de Provas Discursivas na aba 'Discursivas' do Guia.",
          ].map((p,i)=>(
            <div key={i} style={{display:"flex",gap:8,marginBottom:7}}>
              <span style={{color:C.gold,fontSize:14,minWidth:18}}>{i+1}.</span>
              <span style={{fontSize:12,color:C.text,lineHeight:1.6}}>{p}</span>
            </div>
          ))}
        </div>

        <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={onReiniciar} style={{background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"12px 28px",cursor:"pointer",fontWeight:700,fontSize:14}}>🔄 Novo Simulado</button>
          <button onClick={onGuia} style={{background:"transparent",color:C.gold,border:`1px solid ${C.gold}`,borderRadius:8,padding:"12px 28px",cursor:"pointer",fontWeight:700,fontSize:14}}>📋 Voltar ao Guia</button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ════════════════════════════════════════════════════════
export default function App() {
  const [modo, setModo] = useState("guia");
  const [tab, setTab] = useState(0);
  const [filtDisc, setFiltDisc] = useState("Todas");
  const [filtDif, setFiltDif] = useState("Todas");
  const [qAtiva, setQAtiva] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [gabaShow, setGabaShow] = useState({});
  const [qGuiaAtiva, setQGuiaAtiva] = useState(null);
  const [rGuia, setRGuia] = useState({});
  const [gGuia, setGGuia] = useState({});
  const [discAtiva, setDiscAtiva] = useState(null);
  // Simulado
  const [simQ, setSimQ] = useState(0);
  const [simResp, setSimResp] = useState({});
  const [simFeedback, setSimFeedback] = useState(false); // mostra feedback da questão atual
  const [respostaAtual, setRespostaAtual] = useState(null);
  const [tempo, setTempo] = useState(5400); // 1h30min
  const [simAtiva, setSimAtiva] = useState(false);
  const [historico, setHistorico] = useState([]);
  const [showConfig, setShowConfig] = useState(false);
  const [showEditais, setShowEditais] = useState(false);
  const [showNotas, setShowNotas] = useState(false);
  const [showMetodo, setShowMetodo] = useState(false);
  const [showDesempenho, setShowDesempenho] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (simAtiva && modo==="simulado" && !simFeedback && tempo > 0) {
      timerRef.current = setInterval(() => setTempo(t => t-1), 1000);
    } else {
      clearInterval(timerRef.current);
      if (tempo === 0 && simAtiva) setModo("resultado");
    }
    return () => clearInterval(timerRef.current);
  }, [simAtiva, simFeedback, modo, tempo]);

  const iniciarSim = () => {
    setSimResp({}); setSimQ(0); setSimFeedback(false);
    setRespostaAtual(null); setTempo(5400); setSimAtiva(true); setModo("simulado");
  };
  const finalizarSim = () => {
    setSimAtiva(false); clearInterval(timerRef.current);
    const total = SIM_QS.length;
    let ac = 0;
    SIM_QS.forEach(q => { if (simResp[q.id] === q.gab) ac++; });
    const pct = Math.round((ac / total) * 100);
    setHistorico(h => [...h, { ac, total, pct, data: new Date().toLocaleDateString('pt-BR') }]);
    setModo("resultado");
  };

  const confirmarResposta = () => {
    if (!respostaAtual) return;
    setSimResp(r => ({...r, [SIM_QS[simQ].id]: respostaAtual}));
    setSimFeedback(true);
  };

  const proximaQuestao = () => {
    setSimFeedback(false);
    setRespostaAtual(null);
    setSimQ(i => i + 1);
  };

  const bancaFilt = BANCO.filter(q => (filtDisc==="Todas"||q.disc===filtDisc)&&(filtDif==="Todas"||q.dif===filtDif));
  const timerCor = tempo<300?C.red:tempo<900?"#f59e0b":C.green;

  // ── HEADER ──────────────────────────────────────────
  const Header = () => (
    <div style={{background:"linear-gradient(135deg,#080e1a,#0d1b33,#101a30)",borderBottom:`2px solid ${C.gold}`,padding:"14px 18px",position:"sticky",top:0,zIndex:200}}>
      <div style={{maxWidth:960,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
        <div>
          <div style={{display:"flex",gap:6,marginBottom:4,flexWrap:"wrap"}}>
            <Bdg cor={C.gold}>SEFAZ/CE 2026</Bdg>
            <Bdg cor="#3b82f6">FCC</Bdg>
            <Bdg cor="#22c55e">{TOTAL_Q}+ Questões</Bdg>
            <Bdg cor="#a855f7">Simulado Interativo</Bdg>
          </div>
          <h1 style={{margin:0,fontSize:16,color:C.goldLight,fontFamily:"Georgia,serif"}}>Plataforma Completa – Auditor-Fiscal SEFAZ/CE</h1>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          <button onClick={()=>setModo("guia")} style={{padding:"8px 14px",borderRadius:6,border:`1px solid ${modo==="guia"?C.gold:C.border}`,background:modo==="guia"?C.gold+"22":"transparent",color:modo==="guia"?C.gold:C.muted,cursor:"pointer",fontSize:12,fontWeight:700}}>📋 Guia</button>
          <button onClick={iniciarSim} style={{padding:"8px 14px",borderRadius:6,border:`1px solid ${modo==="simulado"?C.gold:C.border}`,background:modo==="simulado"?C.gold+"22":"transparent",color:modo==="simulado"?C.gold:C.muted,cursor:"pointer",fontSize:12,fontWeight:700}}>🎯 Simulado</button>
          <button onClick={()=>setShowEditais(true)} title="Meus Editais" style={{padding:"8px 12px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.gold,cursor:"pointer",fontSize:12,fontWeight:700}}>📑 Meus Editais</button>
          <button onClick={()=>setShowNotas(true)} title="Anotacoes" style={{padding:"8px 12px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.gold,cursor:"pointer",fontSize:12,fontWeight:700}}>📝 Anotacoes</button>
          <button onClick={()=>setShowMetodo(true)} title="Metodo por Banca" style={{padding:"8px 12px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.gold,cursor:"pointer",fontSize:12,fontWeight:700}}>🎓 Metodo</button>
          <button onClick={()=>setShowDesempenho(true)} title="Painel de Desempenho" style={{padding:"8px 12px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.gold,cursor:"pointer",fontSize:12,fontWeight:700}}>📊 Desempenho</button>
          <ErrorBoundary secao="Notificacoes"><Notificacoes /></ErrorBoundary>
          <button onClick={()=>setShowConfig(true)} title="Configurar busca de concursos" style={{padding:"8px 12px",borderRadius:6,border:`1px solid ${C.border}`,background:"transparent",color:C.gold,cursor:"pointer",fontSize:15,fontWeight:700}}>⚙️</button>
        </div>
      </div>
      {showConfig && <ErrorBoundary secao="Configuracoes"><ConfigConcursos onClose={()=>setShowConfig(false)} /></ErrorBoundary>}
      {showEditais && <ErrorBoundary secao="Meus Editais"><MeusEditais onClose={()=>setShowEditais(false)} /></ErrorBoundary>}
      {showNotas && <ErrorBoundary secao="Anotacoes"><Anotacoes onClose={()=>setShowNotas(false)} /></ErrorBoundary>}
      {showMetodo && <ErrorBoundary secao="Metodo por Banca"><MetodoBanca onClose={()=>setShowMetodo(false)} /></ErrorBoundary>}
      {showDesempenho && <ErrorBoundary secao="Painel de Desempenho"><Desempenho onClose={()=>setShowDesempenho(false)} /></ErrorBoundary>}
    </div>
  );

  // ════════════════════════════════════════════════════
  //  RESULTADO
  // ════════════════════════════════════════════════════
  if (modo === "resultado") return <ResultadoFinal simResp={simResp} onReiniciar={iniciarSim} onGuia={()=>setModo("guia")} historico={historico} />;

  // ════════════════════════════════════════════════════
  //  SIMULADO INTERATIVO
  // ════════════════════════════════════════════════════
  if (modo === "simulado") {
    const q = SIM_QS[simQ];
    const respondidas = Object.keys(simResp).length;
    const isUltima = simQ === SIM_QS.length - 1;

    return (
      <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"Georgia,serif"}}>
        {/* Barra do simulado */}
        <div style={{background:"#060c18",borderBottom:`2px solid ${C.gold}`,padding:"10px 18px",position:"sticky",top:0,zIndex:200}}>
          <div style={{maxWidth:900,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <Bdg cor={C.gold}>SIMULADO SEFAZ/CE</Bdg>
              <span style={{fontSize:12,color:C.muted}}>Q{simQ+1}/{SIM_QS.length}</span>
              <span style={{fontSize:12,color:C.muted}}>|</span>
              <span style={{fontSize:12,color:C.green}}>{respondidas} respondidas</span>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <span style={{fontFamily:"monospace",fontSize:20,fontWeight:700,color:timerCor}}>⏱ {fmt(tempo)}</span>
              <button onClick={finalizarSim} style={{background:C.green,color:"#fff",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontWeight:700,fontSize:12}}>Finalizar</button>
              <button onClick={()=>setModo("guia")} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:12}}>← Guia</button>
            </div>
          </div>
          {/* Progresso */}
          <div style={{maxWidth:900,margin:"5px auto 0",height:3,background:C.border,borderRadius:2}}>
            <div style={{height:"100%",width:`${((simQ+1)/SIM_QS.length)*100}%`,background:C.gold,borderRadius:2,transition:"width 0.3s"}}/>
          </div>
        </div>

        <div style={{maxWidth:900,margin:"0 auto",padding:"20px 14px"}}>
          {/* Navegação de bolhas */}
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:18}}>
            {SIM_QS.map((qq,i)=>{
              const resp=simResp[qq.id];
              const isCurr=i===simQ;
              const bg=isCurr?C.gold:resp?(resp===qq.gab?"#16a34a33":"#dc262233"):C.card;
              const bdr=isCurr?C.gold:resp?(resp===qq.gab?C.green:C.red):C.border;
              const col=isCurr?"#000":resp?(resp===qq.gab?C.green:C.red):C.muted;
              return <button key={qq.id} onClick={()=>{if(!simFeedback){setSimQ(i);setRespostaAtual(simResp[qq.id]||null);}}} disabled={simFeedback} style={{width:30,height:30,borderRadius:5,border:`1px solid ${bdr}`,background:bg,color:col,cursor:simFeedback?"not-allowed":"pointer",fontSize:10,fontWeight:700}}>{i+1}</button>;
            })}
          </div>

          {/* Card da questão */}
          <div style={{background:C.card,border:`1px solid ${simFeedback?(respostaAtual===q.gab?C.green:C.red):C.border}`,borderRadius:12,padding:"20px",transition:"border 0.3s"}}>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              <Bdg cor="#3b82f6">Questão {simQ+1} de {SIM_QS.length}</Bdg>
              <Bdg cor={COR_DISC[q.disc]||C.gold}>{q.disc}</Bdg>
              <Bdg cor={q.dif==="Alta"?C.red:"#f59e0b"}>{q.dif}</Bdg>
              <span style={{fontSize:11,color:C.muted,display:"flex",alignItems:"center"}}>{q.tema}</span>
            </div>

            <p style={{fontSize:13,color:C.text,lineHeight:1.9,marginBottom:18,whiteSpace:"pre-line"}}>{q.enunciado}</p>

            {/* Alternativas */}
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {q.alt.map((a,j)=>{
                const L=a[0];
                const isSel=respostaAtual===L;
                const isCorr=simFeedback&&L===q.gab;
                const isErr=simFeedback&&isSel&&L!==q.gab;
                let bg="transparent",bdr=C.border,col=C.text,icon="";
                if(isCorr){bg="#16a34a22";bdr=C.green;col=C.green;icon=" ✅";}
                else if(isErr){bg="#dc262222";bdr=C.red;col=C.red;icon=" ❌";}
                else if(isSel&&!simFeedback){bg=C.gold+"20";bdr=C.gold;col=C.gold;}
                else if(simFeedback){col=C.muted;}
                return (
                  <div key={j}
                    onClick={()=>!simFeedback&&setRespostaAtual(L)}
                    style={{background:bg,border:`2px solid ${bdr}`,borderRadius:8,padding:"11px 14px",cursor:simFeedback?"default":"pointer",color:col,fontSize:13,lineHeight:1.6,transition:"all 0.15s",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span>{a}{icon}</span>
                    {isCorr&&<span style={{fontSize:18}}>✓</span>}
                  </div>
                );
              })}
            </div>

            {/* Botão confirmar */}
            {!simFeedback&&(
              <div style={{display:"flex",justifyContent:"center"}}>
                <button
                  onClick={confirmarResposta}
                  disabled={!respostaAtual}
                  style={{background:respostaAtual?C.gold:"#2d3748",color:respostaAtual?"#000":C.muted,border:"none",borderRadius:8,padding:"12px 32px",cursor:respostaAtual?"pointer":"not-allowed",fontWeight:700,fontSize:14,transition:"all 0.2s"}}>
                  {respostaAtual?"✓ Confirmar Resposta":"Selecione uma alternativa"}
                </button>
              </div>
            )}

            {/* Feedback da questão */}
            {simFeedback&&(
              <FeedbackQuestao
                q={q}
                resposta={respostaAtual}
                onProxima={proximaQuestao}
                isUltima={isUltima}
                onFinalizar={finalizarSim}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ════════════════════════════════════════════════════
  //  GUIA ESTRATÉGICO
  // ════════════════════════════════════════════════════
  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"Georgia,serif"}}>
      <Header />
      {/* Tabs do guia */}
      <div style={{background:"#0c1525",borderBottom:`1px solid ${C.border}`,overflowX:"auto"}}>
        <div style={{maxWidth:960,margin:"0 auto",display:"flex"}}>
          {[...TABS_GUIA,"📚 Banco de Questões"].map((t,i)=>(
            <button key={t} onClick={()=>setTab(i)} style={{padding:"13px 15px",border:"none",background:"transparent",cursor:"pointer",color:tab===i?C.gold:C.muted,borderBottom:tab===i?`2px solid ${C.gold}`:"2px solid transparent",fontSize:12,fontWeight:tab===i?700:400,whiteSpace:"nowrap"}}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:960,margin:"0 auto",padding:"20px 14px"}}>

        {/* TAB 0 – VISÃO GERAL */}
        {tab===0&&(
          <div>
            <div onClick={()=>setTab(6)} style={{cursor:"pointer",background:"linear-gradient(135deg,#a855f722,#3b82f622)",border:`1px solid #a855f7`,borderRadius:10,padding:"14px 16px",marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontWeight:700,color:"#c084fc",fontSize:14,marginBottom:2}}>🎯 Simulado por Disciplina (formato prova)</div>
                <div style={{fontSize:12,color:C.muted}}>Cronometrado, com gabarito comentado — {TOTAL_Q}+ questões estilo FCC</div>
              </div>
              <span style={{background:"#a855f7",color:"#fff",borderRadius:6,padding:"9px 16px",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>Começar →</span>
            </div>
            <h2 style={{color:C.gold,margin:"0 0 16px",fontSize:17}}>📋 Panorama do Concurso</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:10,marginBottom:22}}>
              {Object.entries(guia.concurso).map(([k,v])=>{
                const L={orgao:"Órgão",cargo:"Cargo",banca:"Banca",vagas:"Vagas",remuneracao:"Remuneração",provas:"Datas das Provas",inscricoes:"Inscrições",inscricaoValor:"Taxa",habilitacao:"Nota Mín. Objetivas",discursivaMin:"Nota Mín. Discursiva"};
                return <div key={k} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 14px"}}><div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:3}}>{L[k]}</div><div style={{fontSize:13,color:C.text,lineHeight:1.5}}>{v}</div></div>;
              })}
            </div>
            <h2 style={{color:C.gold,margin:"20px 0 12px",fontSize:17}}>🔥 Temas Mais Quentes</h2>
            {guia.temas_quentes.map((t,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 13px",marginBottom:7,display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{background:i<3?C.danger:i<6?"#f59e0b":C.green,color:"#fff",borderRadius:4,padding:"2px 7px",fontSize:10,fontWeight:700,minWidth:22,textAlign:"center"}}>{i+1}</div>
                <div><div style={{fontWeight:700,color:C.goldLight,fontSize:13}}>{t.tema}</div><div style={{fontSize:11,color:C.muted,marginTop:1}}>{t.freq}</div></div>
              </div>
            ))}
            <h2 style={{color:C.gold,margin:"22px 0 12px",fontSize:17}}>📅 Etapas do Concurso</h2>
            {guia.etapas.map((e,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${e.hab?C.red:C.green}`,borderLeft:`4px solid ${e.hab?C.red:C.green}`,borderRadius:8,padding:"10px 13px",marginBottom:7,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div><div style={{fontWeight:700,color:C.text,fontSize:13}}>{e.nome}</div><div style={{fontSize:11,color:C.muted}}>{e.data}</div></div>
                <div style={{display:"flex",gap:8}}><Bdg cor="#3b82f6">Peso {e.peso}</Bdg><Bdg cor={e.hab?C.red:C.green}>{e.hab?"Eliminatório":"Classificatório"}</Bdg></div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 1 – DISCIPLINAS */}
        
        {/* ── TAB 1: DISCIPLINAS ── */}
        {tab===1&&(
          <div>
            {/* CTA SIMULADO POR DISCIPLINA */}
            <div onClick={()=>setTab(6)} style={{cursor:"pointer",background:"linear-gradient(135deg,#a855f722,#3b82f622)",border:`1px solid #a855f7`,borderRadius:10,padding:"14px 16px",marginBottom:18,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontWeight:700,color:"#c084fc",fontSize:14,marginBottom:2}}>🎯 Simulado por Disciplina (formato prova)</div>
                <div style={{fontSize:12,color:C.muted}}>Junta questões de todos os tópicos de cada disciplina, cronometrado e com gabarito comentado — {TOTAL_Q}+ questões no banco</div>
              </div>
              <span style={{background:"#a855f7",color:"#fff",borderRadius:6,padding:"9px 16px",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>Fazer simulado →</span>
            </div>
            {/* Legenda */}
            <div style={{display:"flex",gap:10,marginBottom:18,padding:"12px 14px",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{fontSize:12,color:C.muted,fontWeight:600}}>LEGENDA:</span>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:12,height:12,borderRadius:2,background:"#22c55e"}}/>
                <span style={{fontSize:12,color:"#22c55e",fontWeight:600}}>CONTEÚDO DO EDITAL</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:12,height:12,borderRadius:2,background:"#ef4444"}}/>
                <span style={{fontSize:12,color:"#ef4444",fontWeight:600}}>ALTA INCIDÊNCIA FCC</span>
              </div>
              <span style={{fontSize:11,color:C.muted}}>• Percentuais baseados em provas FCC fiscais estaduais (2018–2025)</span>
            </div>

            {/* ── CONHECIMENTOS GERAIS ── */}
            <h2 style={{color:C.gold,margin:"0 0 5px",fontSize:16}}>📚 CONHECIMENTOS GERAIS — A01 e B02</h2>
            <p style={{color:C.muted,fontSize:12,margin:"0 0 14px"}}>80 questões | Peso 1 | Provas Gerais + Específicas</p>

            {[
              {
                nome:"Língua Portuguesa", q:10, pct:"12,5%",
                conteudo:[
                  {t:"Redação Oficial. Ortografia e acentuação. Emprego do sinal indicativo de crase.", hot:false},
                  {t:"Compreensão e interpretação de textos de gêneros variados. Relação do texto com seu contexto histórico.", hot:true, inc:"22%"},
                  {t:"Denotação e conotação. Discurso direto, indireto e indireto livre. Intertextualidade. Figuras de linguagem.", hot:false},
                  {t:"Morfossintaxe. Elementos estruturais e processos de formação de palavras. Sinonímia e antonímia.", hot:false},
                  {t:"Pontuação. Pronomes. Concordância nominal e concordância verbal.", hot:true, inc:"18%"},
                  {t:"Flexão nominal e flexão verbal. Vozes do verbo. Correlação de tempos e modos verbais.", hot:false},
                  {t:"Regência nominal e regência verbal.", hot:true, inc:"16%"},
                  {t:"Coordenação e subordinação. Conectivos.", hot:false},
                  {t:"Redação: confronto e reconhecimento de frases corretas e incorretas; organização e reorganização de orações e períodos; equivalência e transformação de estruturas.", hot:true, inc:"15%"},
                ]
              },
              {
                nome:"Matemática Financeira, Estatística e Raciocínio Lógico", q:12, pct:"15%",
                conteudo:[
                  {t:"Juros simples e compostos. Montante e juros. Taxa real e taxa efetiva. Taxas equivalentes. Capitais equivalentes. Capitalização contínua.", hot:true, inc:"20%"},
                  {t:"Descontos: simples, composto. Desconto racional e desconto comercial.", hot:false},
                  {t:"Amortizações: Sistema Francês (Price), Sistema de Amortização Constante (SAC), Sistema Misto.", hot:true, inc:"18%"},
                  {t:"Fluxo de caixa. Valor atual. Taxa interna de retorno.", hot:false},
                  {t:"Estatística Descritiva: gráficos, tabelas, medidas de posição (média, moda, mediana, quartis) e de variabilidade (variância, desvio-padrão, amplitude).", hot:true, inc:"15%"},
                  {t:"Técnicas de Contagem e Análise Combinatória: Combinações, Arranjos e Permutação.", hot:false},
                  {t:"Probabilidades: conceito, espaço amostral, distribuições discretas e contínuas (Bernoulli, binomial, normal, Poisson, qui-quadrado, t de Student, F-Snedecor).", hot:false},
                  {t:"Inferência estatística. Amostragem: amostras casuais e não casuais. Intervalos de confiança. Testes de hipóteses para médias e proporções.", hot:false},
                  {t:"Correlação e regressão linear simples.", hot:false},
                  {t:"Raciocínio Lógico: estrutura lógica; dedução de novas informações; raciocínio verbal, matemático, sequencial; orientação espacial e temporal; formação de conceitos.", hot:true, inc:"17%"},
                ]
              },
              {
                nome:"Administração Pública e Governança Pública", q:10, pct:"12,5%",
                conteudo:[
                  {t:"Reformas Administrativas. Gestão de suprimentos e logística na administração pública.", hot:false},
                  {t:"Processos participativos de gestão pública: orçamento participativo, parceria governo-sociedade, ouvidorias, governança interna e externa.", hot:false},
                  {t:"Novas formas de gestão: formas de supervisão e contratualização de resultados. Controles interno e externo. Responsabilização e Prestação de Contas.", hot:false},
                  {t:"Lei de Acesso à Informação (Lei nº 12.527/2011) — prazos, procedimentos e hipóteses de sigilo.", hot:true, inc:"14%"},
                  {t:"Governança Pública Organizacional: conceito, princípios, diretrizes; teoria da agência; instâncias estratégica, tática e operacional.", hot:false},
                  {t:"Modelo de Gestão do Poder Executivo do Estado do Ceará.", hot:false},
                  {t:"Integridade: conceitos e princípios. Programa de Integridade do Poder Executivo do Estado do Ceará.", hot:false},
                  {t:"Gestão de Riscos: conceito e princípios; modelo de três linhas (IIA 2020); Política de Gestão de Riscos do Poder Executivo do CE.", hot:true, inc:"20%"},
                  {t:"Responsabilidade do agente público: deveres e proibições; Código de Ética e Conduta da Administração Pública Estadual do CE; sanções éticas e disciplinares; PAD; TAC.", hot:false},
                  {t:"Assédio e violência no trabalho: Convenção nº 190/2019 OIT; sistema de combate e prevenção ao assédio moral no Poder Executivo do CE.", hot:false},
                ]
              },
              {
                nome:"Economia", q:10, pct:"12,5%",
                conteudo:[
                  {t:"Microeconomia: teoria do equilíbrio de mercado. Fatores que influenciam oferta e demanda. Efeitos de deslocamentos das curvas.", hot:false},
                  {t:"Elasticidades — preço da procura e da oferta.", hot:true, inc:"14%"},
                  {t:"Equilíbrio da firma no curto prazo: concorrência perfeita, monopólio, oligopólio, concorrência monopolística.", hot:false},
                  {t:"Economia da Tributação: necessidade econômica; formas de tributação; impostos Ad Valorem, específicos e sobre valor adicionado.", hot:false},
                  {t:"Tributação e eficiência; peso morto da tributação; determinantes do peso morto (elasticidades).", hot:true, inc:"16%"},
                  {t:"Tributação Ótima sobre mercadorias: regra de Ramsey.", hot:true, inc:"12%"},
                  {t:"Curva de Laffer.", hot:true, inc:"12%"},
                  {t:"Tributação e equidade: trade-off eficiência x equidade; capacidade contributiva; critério do benefício; incidência econômica dos tributos.", hot:false},
                  {t:"Macroeconomia: Fluxo Circular da Renda; Contabilidade nacional; PIB e agregados macroeconômicos (C, I, G, XL).", hot:true, inc:"16%"},
                  {t:"Determinação do produto de equilíbrio; curvas IS e LM. PIB real x nominal. Deflator do PIB.", hot:false},
                  {t:"Inflação: conceitos, mensuração e correção monetária. Balanço de Pagamentos. Políticas fiscal, monetária e cambial.", hot:false},
                ]
              },
              {
                nome:"Direito Constitucional", q:4, pct:"5%",
                conteudo:[
                  {t:"Constituição Federal de 1988: aplicabilidade das normas (eficácia plena, contida, limitada e programáticas).", hot:false},
                  {t:"Direitos e garantias fundamentais: individuais e coletivos, sociais, de nacionalidade, políticos, partidos políticos.", hot:true, inc:"20%"},
                  {t:"Organização político-administrativa: Estado federal, União, Estados, DF, Municípios.", hot:false},
                  {t:"Administração Pública: disposições gerais e servidores públicos. Poderes Executivo, Legislativo e Judiciário.", hot:false},
                  {t:"Processo legislativo federal, estadual, distrital e municipal. Fiscalização contábil, financeira e orçamentária. CPI.", hot:false},
                  {t:"Controle de constitucionalidade: conceito, sistemas, modalidades, órgãos, sujeitos, efeitos, súmula vinculante, reclamação constitucional.", hot:true, inc:"22%"},
                  {t:"Ordem econômica e financeira. Constituição do Estado do Ceará — Organização do Estado e Ordem Econômica.", hot:false},
                ]
              },
              {
                nome:"Direito Administrativo", q:4, pct:"5%",
                conteudo:[
                  {t:"Conceitos, fontes e objeto do Direito Administrativo. Atos administrativos: conceito, requisitos, atributos, classificação, extinção (cassação, anulação, revogação, convalidação).", hot:false},
                  {t:"Agentes públicos: cargo, emprego e função; provimento, vacância, estabilidade, vitaliciedade, remuneração, deveres, responsabilidade, PAD.", hot:false},
                  {t:"Poderes da Administração: hierárquico, disciplinar, regulamentar, de polícia. Uso e abuso do poder.", hot:false},
                  {t:"Princípios expressos e implícitos da Administração Pública (LIMPE + razoabilidade, proporcionalidade).", hot:true, inc:"18%"},
                  {t:"Responsabilidade civil do Estado: evolução, ato comissivo e omissivo, requisitos, excludentes, reparação do dano, direito de regresso.", hot:false},
                  {t:"Serviços Públicos: concessão, permissão, autorização. PPP: Lei nº 8.987/95 e Lei nº 11.079/2004.", hot:false},
                  {t:"Organização Administrativa: centralização, descentralização, administração direta e indireta, autarquias, fundações, EP, SEM, entidades paraestatais.", hot:false},
                  {t:"Controle da Administração Pública: externo, interno, judicial, legislativo, pelos Tribunais de Contas.", hot:false},
                  {t:"Improbidade Administrativa: Lei nº 8.429/1992 com alterações da Lei nº 14.230/2021 (dolo específico, legitimidade exclusiva do MP).", hot:true, inc:"22%"},
                  {t:"Lei Anticorrupção (Lei nº 12.846/2013). Lei de Licitações e Contratos (Lei nº 14.133/2021) — modalidades, fases, diálogo competitivo.", hot:true, inc:"20%"},
                  {t:"Bens Públicos. LGPD (Lei nº 13.709/2018) aplicada à Administração Pública.", hot:false},
                ]
              },
              {
                nome:"Direito Civil", q:2, pct:"2,5%",
                conteudo:[
                  {t:"LINDB: vigência, aplicação, interpretação e integração das leis. Conflito das leis no tempo e no espaço.", hot:false},
                  {t:"Pessoas naturais e jurídicas: capacidade, personalidade, domicílio. Bens imóveis, móveis e públicos.", hot:false},
                  {t:"Fato jurídico e negócio jurídico: disposições gerais, invalidade. Prescrição e decadência.", hot:false},
                  {t:"Obrigações: adimplemento, inadimplemento e mora. Contratos: princípios e disposições gerais.", hot:false},
                  {t:"Responsabilidade civil objetiva e subjetiva. Direitos de exploração de propriedades.", hot:false},
                  {t:"Regime de bens do casamento. Sucessões: legítima e testamentária, inventário e partilha.", hot:false},
                ]
              },
              {
                nome:"Direito Penal", q:2, pct:"2,5%",
                conteudo:[
                  {t:"Princípios constitucionais e gerais. Aplicação da lei penal. Crime. Imputabilidade. Concurso de pessoas. Penas. Extinção da punibilidade.", hot:false},
                  {t:"Crimes contra a Fé Pública: falsidade de títulos e papéis públicos; falsidade documental; fraudes em certames.", hot:false},
                  {t:"Crimes contra a Administração Pública: por funcionário público e por particular. Crimes em licitações (Lei nº 14.133/2021).", hot:false},
                  {t:"Crimes contra as Finanças Públicas. Crimes contra o estado democrático de direito.", hot:false},
                  {t:"Crimes contra a Ordem Tributária (Lei nº 8.137/1990): por particular e por funcionário; Súmula Vinculante 24.", hot:true, inc:"30%"},
                  {t:"Crime organizado (Lei nº 12.850/2013). Lavagem de dinheiro (Lei nº 9.613/1998). Interceptação telefônica (Lei nº 9.296/1996).", hot:true, inc:"20%"},
                  {t:"Lei de Abuso de Autoridade (Lei nº 13.869/2019). Crimes de preconceito (Lei nº 7.716/1989).", hot:false},
                ]
              },
              {
                nome:"Direito Financeiro", q:8, pct:"10%",
                conteudo:[
                  {t:"Orçamento na CF/1988: PPA, LDO, LOA — objetivos, estrutura, base legal, Anexos de Metas e Riscos Fiscais.", hot:true, inc:"18%"},
                  {t:"Princípios Orçamentários. Processo de aprovação da proposta orçamentária. Emendas parlamentares impositivas.", hot:false},
                  {t:"Créditos Adicionais: suplementares, especiais e extraordinários.", hot:false},
                  {t:"LRF (LC nº 101/2000): Planejamento; Receita Pública; Despesa Pública; Transferências Voluntárias; Destinação de Recursos; Dívida e Endividamento; Gestão Patrimonial.", hot:true, inc:"28%"},
                  {t:"LRF — Limites de despesas com pessoal: União (50%), Estados (60%), Municípios (60%).", hot:true, inc:"22%"},
                  {t:"LRF — Vedações ao final do mandato (art. 42). Limitação de empenho (art. 9º). Resultado Primário e Nominal.", hot:true, inc:"20%"},
                  {t:"Lei nº 4.320/1964: restos a pagar, despesas de exercícios anteriores, fundos especiais, DREM.", hot:true, inc:"16%"},
                ]
              },
              {
                nome:"Contabilidade Geral e Pública", q:10, pct:"12,5%",
                conteudo:[
                  {t:"Conceito, objetivos, usuários e características qualitativas da informação contábil (NBC TG e CPC).", hot:false},
                  {t:"Itens patrimoniais: conceitos de ativo e passivo; critérios de mensuração; classificações e formas de apresentação.", hot:false},
                  {t:"Receitas e despesas: conceitos, mensuração e contabilização.", hot:false},
                  {t:"Estoques: componentes do custo; PEPS, MPM, preço específico; tipos de inventário; tributos em operações comerciais.", hot:false},
                  {t:"Ativo imobilizado: reconhecimento, mensuração inicial e subsequente, depreciação, baixa e venda.", hot:false},
                  {t:"Ativo intangível: reconhecimento, mensuração, amortização.", hot:false},
                  {t:"Redução ao valor recuperável de ativos (impairment): conceito, reconhecimento e reversão.", hot:false},
                  {t:"Provisões, passivos e ativos contingentes: conceito, reconhecimento e mensuração.", hot:false},
                  {t:"Demonstrações contábeis: BP, DRE, DRA, DMPL.", hot:false},
                  {t:"Contabilidade Pública: Lei nº 4.320/1964. MCASP 11ª Edição — Procedimentos Orçamentários, Patrimoniais, Específicos, Demonstrações e PCASP.", hot:true, inc:"22%"},
                  {t:"NBC TSP Estrutura Conceitual e NBC TSP 01 a 34. Decreto nº 10.540/2020.", hot:true, inc:"18%"},
                  {t:"Auditoria: interna x independente x perícia; planejamento; fraude e erro (NBC TA 240); materialidade; riscos; amostragem; papéis de trabalho; pareceres.", hot:true, inc:"16%"},
                  {t:"NBC TA 230, 240, 265, 300, 315, 320, 500, 501, 505, 530, 540, 610, 620, 700.", hot:false},
                ]
              },
            ].map((d,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",marginBottom:10}}>
                <div style={{background:"linear-gradient(90deg,#0f1829,#162035)",padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
                  <div style={{fontWeight:700,color:C.goldLight,fontSize:14}}>{d.nome}</div>
                  <div style={{display:"flex",gap:6}}>
                    <span style={{background:C.gold+"22",border:`1px solid ${C.gold}`,color:C.gold,padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700}}>{d.pct} ({d.q}Q)</span>
                  </div>
                </div>
                <div style={{padding:"10px 14px"}}>
                  {d.conteudo.map((item,j)=>(
                    <div key={j} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}>
                      <span style={{color:item.hot?"#ef4444":"#22c55e",fontSize:12,minWidth:12,marginTop:2}}>▸</span>
                      <div style={{flex:1}}>
                        <span style={{fontSize:12,color:item.hot?"#fca5a5":"#86efac",lineHeight:1.6}}>{item.t}</span>
                        {item.hot&&item.inc&&(
                          <span style={{marginLeft:8,background:"#ef444422",border:"1px solid #ef4444",color:"#ef4444",padding:"1px 6px",borderRadius:3,fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>
                            🔥 {item.inc} das questões
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* ── CONHECIMENTOS ESPECÍFICOS A01 ── */}
            <h2 style={{color:C.gold,margin:"20px 0 5px",fontSize:16}}>🎯 CONHECIMENTOS ESPECÍFICOS — A01 Gestão Fazendária</h2>
            <p style={{color:C.muted,fontSize:12,margin:"0 0 14px"}}>80 questões | <strong style={{color:C.danger}}>Peso 2 (DOBRO!)</strong> | Provas Específicas</p>

            {[
              {
                nome:"Direito Tributário", q:20, pct:"25% (Peso 2 = 50 pts)",
                conteudo:[
                  {t:"Sistema Tributário Nacional na CF/88: Tributação e Orçamento; princípios gerais; limitações do poder de tributar; impostos da União, Estados e Municípios; IBS; repartição das receitas.", hot:true, inc:"15%"},
                  {t:"CTN — Competência Tributária: disposições gerais, limitações, disposições especiais.", hot:true, inc:"12%"},
                  {t:"CTN — Obrigação Tributária: disposições gerais, fato gerador, sujeito ativo e passivo, solidariedade, capacidade tributária, domicílio tributário.", hot:true, inc:"18%"},
                  {t:"CTN — Responsabilidade Tributária: sucessores, terceiros, infrações.", hot:true, inc:"16%"},
                  {t:"CTN — Crédito Tributário: constituição, lançamento e modalidades (ofício, declaração, homologação).", hot:true, inc:"20%"},
                  {t:"CTN — Suspensão da Exigibilidade: moratória, depósito, reclamações/recursos, liminar/tutela antecipada, parcelamento.", hot:true, inc:"18%"},
                  {t:"CTN — Extinção do Crédito Tributário: pagamento, compensação, transação, remissão, prescrição, decadência, dação em pagamento e demais modalidades (art. 156).", hot:true, inc:"22%"},
                  {t:"CTN — Exclusão do Crédito Tributário: isenção e anistia.", hot:true, inc:"14%"},
                  {t:"CTN — Garantias e Privilégios do Crédito Tributário; Administração Tributária: fiscalização, dívida ativa, certidões negativas.", hot:false},
                  {t:"LC nº 24/1975 — Convênios CONFAZ: isenções de ICMS, unanimidade, guerra fiscal.", hot:true, inc:"14%"},
                  {t:"LC nº 87/1996 (Lei Kandir) — ICMS: não-cumulatividade, crédito de ativo permanente (1/48), uso e consumo.", hot:true, inc:"18%"},
                  {t:"LC nº 105/2001 — Sigilo das operações de instituições financeiras.", hot:false},
                  {t:"LC nº 116/2003 — ISSQN e conflito de competência com o ICMS.", hot:false},
                  {t:"LC nº 123/2006 + Res. CGSN 140/2018 — Simples Nacional: MEI, ME, EPP; ICMS-ST fora do DAS.", hot:true, inc:"12%"},
                  {t:"LC nº 160/2017 — Remissão de benefícios fiscais concedidos à margem do CONFAZ.", hot:false},
                  {t:"LC nº 192/2022 — ICMS monofásico sobre combustíveis.", hot:false},
                  {t:"Reforma Tributária: EC nº 132/2023; LC nº 214/2025; IBS (competência compartilhada, Comitê Gestor, alíquota uniforme, não-cumulatividade plena, princípio do destino); CBS; IS; LC nº 227/2026.", hot:true, inc:"28%"},
                ]
              },
              {
                nome:"Legislação Tributária Estadual", q:20, pct:"25% (Peso 2 = 50 pts)",
                conteudo:[
                  {t:"Lei nº 18.665/2023 — ICMS-CE: fato gerador, base de cálculo, alíquotas, contribuintes, responsáveis, obrigações acessórias, substituição tributária.", hot:true, inc:"30%"},
                  {t:"Decreto nº 33.327/2019 — RICMS-CE: regulamentação do ICMS; benefícios fiscais; regimes especiais.", hot:true, inc:"25%"},
                  {t:"ICMS por dentro (cálculo por dentro): integração do tributo na própria base de cálculo.", hot:true, inc:"18%"},
                  {t:"Substituição tributária progressiva e regressiva no ICMS-CE: MVA, pauta fiscal, restituição.", hot:true, inc:"20%"},
                  {t:"Não-cumulatividade do ICMS-CE: crédito fiscal, vedações, ativo permanente.", hot:true, inc:"16%"},
                  {t:"Lei nº 15.812/2015 — ITCD-CE: fato gerador, base de cálculo, alíquotas progressivas, isenções.", hot:true, inc:"14%"},
                  {t:"Lei nº 12.023/1992 — IPVA-CE: fato gerador, base de cálculo, contribuinte, alíquotas.", hot:false},
                  {t:"LC nº 37/2003 — FECOP (Fundo Estadual de Combate à Pobreza): incidência, alíquota adicional de ICMS.", hot:false},
                ]
              },
              {
                nome:"Contabilidade Avançada e de Custos", q:20, pct:"25% (Peso 2 = 50 pts)",
                conteudo:[
                  {t:"Políticas Contábeis, Mudança de Estimativa e Retificação de Erro (CPC 23).", hot:false},
                  {t:"Mensuração a Valor Justo (CPC 46 / IFRS 13): conceitos, hierarquia de níveis 1, 2 e 3.", hot:true, inc:"18%"},
                  {t:"Ajuste a Valor Presente (AVP): conceitos e tratamento contábil.", hot:false},
                  {t:"Instrumentos Financeiros (CPC 48 / IFRS 9): conceito e tratamento. Valores a receber, aplicações financeiras, empréstimos e debêntures.", hot:false},
                  {t:"Propriedade para Investimento (CPC 28 / IAS 40): mensuração inicial e subsequente.", hot:false},
                  {t:"Operações de Arrendamento (CPC 06 R2 / IFRS 16): direito de uso, passivo de arrendamento, exceções (curto prazo e baixo valor).", hot:true, inc:"16%"},
                  {t:"Participações Societárias: coligadas e controladas; influência significativa; Método de Equivalência Patrimonial (MEP); mais-valia, goodwill e compra com deságio.", hot:true, inc:"22%"},
                  {t:"Combinação de Negócios (CPC 15 / IFRS 3): método de aquisição; goodwill x compra vantajosa; impairment anual.", hot:true, inc:"20%"},
                  {t:"Subvenção e Assistência Governamentais (CPC 07 / IAS 20): reconhecimento no resultado, base sistemática; Lei nº 14.789/2023.", hot:true, inc:"14%"},
                  {t:"Conversão de demonstrações contábeis: efeitos das mudanças nas taxas de câmbio (CPC 02).", hot:false},
                  {t:"Demonstrações contábeis: BP, DRE, DRA, DMPL, DFC (método direto e indireto), DVA.", hot:true, inc:"16%"},
                  {t:"Custos: classificação (diretos/indiretos, fixos/variáveis); Custeio por Absorção, Custeio Variável, ABC.", hot:true, inc:"20%"},
                  {t:"Departamentalização. Produção por ordem, produção contínua e produção conjunta.", hot:false},
                  {t:"Custo padrão: conceito, finalidades e variações.", hot:false},
                  {t:"Margem de contribuição; relação CVL; Ponto de Equilíbrio contábil, econômico e financeiro; margem de segurança.", hot:true, inc:"18%"},
                ]
              },
              {
                nome:"Fluência de Dados", q:10, pct:"12,5% (Peso 2 = 25 pts)",
                conteudo:[
                  {t:"Ciência de Dados: conceitos fundamentais; tipos de dados (estruturados, não estruturados, semiestruturados); ciclo de vida; metodologia CRISP.", hot:false},
                  {t:"Big Data e Arquitetura de Dados: Data Warehouse, Data Mart, Data Lake, Data Lakehouse.", hot:true, inc:"18%"},
                  {t:"Pré-processamento: técnicas de preparação, limpeza e transformação de dados.", hot:false},
                  {t:"Banco de Dados Relacionais e NoSQL. Linguagem SQL: DQL, funções de agregação, agrupamento (GROUP BY, HAVING), junção (JOIN), ordenação, restrições e operações lógicas.", hot:true, inc:"25%"},
                  {t:"Análise de dados: agrupamentos, tendências, projeções. Data Mining.", hot:false},
                  {t:"Machine Learning (supervisionado, não supervisionado, semi), Deep Learning, IA e NLP.", hot:false},
                  {t:"Governança de Dados: conceito, tipos (centralizada, compartilhada, colegiada), papéis.", hot:false},
                  {t:"Governança e Ética na IA: transparência, responsabilidade, explicabilidade, privacidade, viés, alucinação.", hot:false},
                  {t:"Segurança da Informação e Proteção de Dados: CIA (confidencialidade, integridade, disponibilidade), rastreabilidade. Anonimização, mascaramento, políticas de retenção.", hot:false},
                  {t:"Conformidade: LGPD (bases legais, tratamento, titular, controlador, operador, DPO); Marco Civil da Internet. Sigilo Fiscal (CTN arts. 198-199); Resolução SF nº 20/2012.", hot:true, inc:"22%"},
                ]
              },
              {
                nome:"Finanças Públicas", q:10, pct:"12,5% (Peso 2 = 25 pts)",
                conteudo:[
                  {t:"Conceito, objetivos, metas e abrangência de Finanças Públicas. Visão clássica das funções do Estado. Evolução das funções do Governo.", hot:false},
                  {t:"Falhas de mercado: bens públicos (não rivalidade, não exclusão), externalidades (positivas e negativas). Papel do Governo.", hot:true, inc:"18%"},
                  {t:"Objetivos da política fiscal. Funções de Musgrave: alocativa, distributiva e estabilizadora.", hot:true, inc:"22%"},
                  {t:"O financiamento dos gastos públicos: tributação e equidade. Tipos de tributos. Déficit público e formas de financiamento.", hot:false},
                  {t:"Resultado Fiscal (NFSP): Resultado Primário (receitas não financeiras − despesas não financeiras, excluídos juros) e Resultado Nominal.", hot:true, inc:"20%"},
                ]
              },
            ].map((d,i)=>(
              <div key={i} style={{background:C.card,border:`2px solid ${C.gold}33`,borderLeft:`4px solid ${C.gold}`,borderRadius:10,overflow:"hidden",marginBottom:10}}>
                <div style={{background:"linear-gradient(90deg,#1a0f00,#251505)",padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
                  <div style={{fontWeight:700,color:C.goldLight,fontSize:14}}>{d.nome}</div>
                  <div style={{display:"flex",gap:6}}>
                    <span style={{background:C.danger+"22",border:`1px solid ${C.danger}`,color:C.danger,padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700}}>{d.pct}</span>
                  </div>
                </div>
                <div style={{padding:"10px 14px"}}>
                  {d.conteudo.map((item,j)=>(
                    <div key={j} style={{display:"flex",gap:8,marginBottom:5,alignItems:"flex-start"}}>
                      <span style={{color:item.hot?"#ef4444":"#22c55e",fontSize:12,minWidth:12,marginTop:2}}>▸</span>
                      <div style={{flex:1}}>
                        <span style={{fontSize:12,color:item.hot?"#fca5a5":"#86efac",lineHeight:1.6}}>{item.t}</span>
                        {item.hot&&item.inc&&(
                          <span style={{marginLeft:8,background:"#ef444422",border:"1px solid #ef4444",color:"#ef4444",padding:"1px 6px",borderRadius:3,fontSize:10,fontWeight:700,whiteSpace:"nowrap"}}>
                            🔥 {item.inc} das questões
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab===2&&(
          <div>
            <h2 style={{color:C.gold,margin:"0 0 5px",fontSize:17}}>📅 Plano de Estudos – 15 Semanas</h2>
            <p style={{color:C.muted,fontSize:12,margin:"0 0 16px"}}>Baseado na prova: 01-02/08/2026 • Início recomendado: maio/2026</p>
            {guia.cronograma.map((c,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",marginBottom:10}}>
                <div style={{background:i<2?"#0d1b2e":i<4?"#151f35":"#1a1535",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><span style={{fontSize:10,color:C.gold,fontWeight:700,fontFamily:"monospace"}}>FASE {i+1} • {c.semana}</span><div style={{fontWeight:700,color:C.text,fontSize:13,marginTop:1}}>{c.fase}</div></div>
                  <Bdg cor={C.gold}>{c.horas}</Bdg>
                </div>
                <div style={{padding:"10px 14px"}}>
                  {c.foco.map((f,j)=><div key={j} style={{display:"flex",gap:7,marginBottom:4}}><span style={{color:C.gold,fontSize:12}}>▸</span><span style={{fontSize:12,color:C.muted,lineHeight:1.5}}>{f}</span></div>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3 – QUESTÕES OBJETIVAS (prévia) */}
        {tab===3&&(
          <div>
            <div style={{background:C.card,border:`1px solid ${C.gold}44`,borderRadius:8,padding:"11px 14px",marginBottom:16}}>
              <p style={{margin:0,fontSize:12,color:C.muted,lineHeight:1.6}}>📌 Prévia de 8 questões comentadas. Para o <strong style={{color:C.green}}>Banco Completo (30Q)</strong> acesse a aba <strong>📚 Banco de Questões</strong>. Para o <strong style={{color:"#a855f7"}}>Simulado Interativo</strong> clique em <strong>🎯 Simulado</strong> no topo — com feedback imediato, links e videoaulas.</p>
            </div>
            <h2 style={{color:C.gold,margin:"0 0 14px",fontSize:17}}>📝 Questões Comentadas – Estilo FCC</h2>
            {BANCO.slice(0,8).map((q,i)=>{
              const at=qGuiaAtiva===q.id;
              return (
                <div key={q.id} style={{background:C.card,border:`1px solid ${at?C.gold:C.border}`,borderRadius:10,overflow:"hidden",marginBottom:8}}>
                  <div onClick={()=>{setQGuiaAtiva(at?null:q.id);setRGuia(r=>({...r,[q.id]:null}));setGGuia(g=>({...g,[q.id]:false}));}} style={{padding:"11px 13px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
                      <span style={{background:"#0f2647",color:"#7bb3e8",border:"1px solid #1e3a5f",borderRadius:4,padding:"2px 7px",fontSize:11,fontWeight:700}}>Q{i+1}</span>
                      <span style={{fontSize:11,color:COR_DISC[q.disc]||C.gold,fontWeight:600}}>{q.disc}</span>
                      <Bdg cor={q.dif==="Alta"?C.red:"#f59e0b"}>{q.dif}</Bdg>
                    </div>
                    <span style={{color:C.muted,fontSize:12}}>{at?"▲":"▼"}</span>
                  </div>
                  {at&&(
                    <div style={{padding:"0 13px 13px",borderTop:`1px solid ${C.border}`}}>
                      <p style={{fontSize:13,color:C.text,lineHeight:1.8,margin:"12px 0 14px",whiteSpace:"pre-line"}}>{q.enunciado}</p>
                      <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
                        {q.alt.map((a,j)=>{
                          const L=a[0],isSel=rGuia[q.id]===L,isCorr=gGuia[q.id]&&L===q.gab,isErr=gGuia[q.id]&&isSel&&L!==q.gab;
                          let bg="transparent",bdr=C.border,col=C.muted;
                          if(isCorr){bg="#16a34a22";bdr=C.green;col=C.green;}
                          else if(isErr){bg="#dc262222";bdr=C.red;col=C.red;}
                          else if(isSel){bg=C.gold+"18";bdr=C.gold;col=C.gold;}
                          return <div key={j} onClick={()=>!gGuia[q.id]&&setRGuia(r=>({...r,[q.id]:L}))} style={{background:bg,border:`1px solid ${bdr}`,borderRadius:6,padding:"8px 11px",cursor:gGuia[q.id]?"default":"pointer",color:col,fontSize:12,lineHeight:1.6}}>{a}</div>;
                        })}
                      </div>
                      {rGuia[q.id]&&!gGuia[q.id]&&<button onClick={()=>setGGuia(g=>({...g,[q.id]:true}))} style={{background:C.gold,color:"#000",border:"none",borderRadius:6,padding:"7px 15px",cursor:"pointer",fontWeight:700,fontSize:12}}>Ver Gabarito</button>}
                      {gGuia[q.id]&&<div style={{background:"#0f2647",border:"1px solid #1e3a5f",borderRadius:8,padding:"10px 12px"}}><div style={{fontWeight:700,color:"#7bb3e8",marginBottom:5,fontSize:12}}>📖 Comentário</div><p style={{margin:0,fontSize:11,color:C.muted,lineHeight:1.8}}>{q.com}</p></div>}
                    </div>
                  )}
                </div>
              );
            })}
            <div style={{textAlign:"center",marginTop:14}}>
              <button onClick={()=>setTab(7)} style={{background:C.gold+"22",border:`1px solid ${C.gold}`,color:C.gold,borderRadius:8,padding:"9px 20px",cursor:"pointer",fontWeight:700,fontSize:13}}>Ver todas as 30 questões →</button>
            </div>
          </div>
        )}

        {/* TAB 4 – DISCURSIVAS */}
        {tab===4&&(
          <div>
            <h2 style={{color:C.gold,margin:"0 0 8px",fontSize:17}}>✍️ Provas Discursivas – Modelos e Roteiros</h2>
            <div style={{background:C.card,border:`1px solid ${C.red}`,borderRadius:8,padding:"11px 13px",marginBottom:16}}>
              <p style={{margin:0,fontSize:12,color:C.text,lineHeight:1.7}}><strong style={{color:C.red}}>⚠️ Regras:</strong> Dissertativa: mín. 15 linhas • Estudo de Caso: mín. 20 linhas • Nota 0 por fuga ao tema, letra ilegível ou cópia • Nota final ≥ 50 pts para habilitar • Proibido lápis, marca-texto e líquido corretivo.</p>
            </div>
            {guia.discursivas.map((q,i)=>{
              const at=discAtiva===i;
              return (
                <div key={i} style={{background:C.card,border:`1px solid ${at?C.gold:C.border}`,borderRadius:10,overflow:"hidden",marginBottom:10}}>
                  <div onClick={()=>setDiscAtiva(at?null:i)} style={{padding:"13px 15px",cursor:"pointer"}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>
                      <Bdg cor={i===0?"#3b82f6":"#a855f7"}>{q.tipo}</Bdg>
                      <span style={{fontSize:13,color:C.gold,fontWeight:700}}>{q.tema}</span>
                    </div>
                    <p style={{margin:0,fontSize:11,color:C.muted}}>Mínimo: {q.linhas} linhas • Clique para ver roteiro</p>
                  </div>
                  {at&&(
                    <div style={{padding:"0 15px 15px",borderTop:`1px solid ${C.border}`}}>
                      <div style={{background:"#0a1020",border:`1px solid ${C.border}`,borderRadius:8,padding:"12px",margin:"12px 0"}}>
                        <p style={{margin:0,fontSize:12,color:C.text,lineHeight:1.9,fontStyle:"italic"}}>{q.enunciado}</p>
                      </div>
                      <h4 style={{color:C.gold,margin:"12px 0 8px",fontSize:13}}>📋 Roteiro de Resposta:</h4>
                      {q.roteiro.map((r,j)=>(
                        <div key={j} style={{display:"flex",gap:9,marginBottom:7,alignItems:"flex-start"}}>
                          <span style={{background:C.gold,color:"#000",borderRadius:"50%",width:19,height:19,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,minWidth:19}}>{j+1}</span>
                          <p style={{margin:0,fontSize:12,color:C.muted,lineHeight:1.7}}>{r}</p>
                        </div>
                      ))}
                      <div style={{background:C.gold+"10",border:`1px solid ${C.gold}44`,borderRadius:8,padding:"10px 13px",marginTop:12}}>
                        <p style={{margin:0,fontSize:11,color:C.gold,lineHeight:1.7}}>💡 <strong>Dica FCC:</strong> Estruture em parágrafos numerados. Evite transcrição literal da lei — parafrase e cite os dispositivos. Use exemplos concretos e mostre domínio técnico.</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 5 – ESTRATÉGIA FCC */}
        {tab===5&&(
          <div>
            <h2 style={{color:C.gold,margin:"0 0 16px",fontSize:17}}>🧠 Perfil da Banca FCC</h2>
            {guia.perfil_fcc.map((p,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 13px",marginBottom:7,display:"flex",gap:9,alignItems:"flex-start"}}>
                <span style={{color:C.gold,fontSize:15,minWidth:16}}>⚡</span>
                <p style={{margin:0,fontSize:13,color:C.text,lineHeight:1.6}}>{p}</p>
              </div>
            ))}
            <h2 style={{color:C.gold,margin:"22px 0 12px",fontSize:17}}>📊 Distribuição de Peso – Provas A01</h2>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px",marginBottom:16}}>
              {[{nome:"Conhecimentos Específicos (peso 2 × 80Q)",pts:160,cor:C.danger},{nome:"Provas Discursivas (peso 1 × 100pts)",pts:100,cor:"#a855f7"},{nome:"Conhecimentos Gerais (peso 1 × 80Q)",pts:80,cor:"#f59e0b"},{nome:"Avaliação de Títulos (máx. 20pts)",pts:20,cor:C.green}].map((it,i)=>{
                const tot=360;
                return <div key={i} style={{marginBottom:11}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,color:C.text}}>{it.nome}</span><span style={{fontSize:12,fontWeight:700,color:it.cor}}>{((it.pts/tot)*100).toFixed(1)}%</span></div><div style={{height:7,background:C.border,borderRadius:3}}><div style={{height:"100%",width:`${(it.pts/tot)*100}%`,background:it.cor,borderRadius:3}}/></div></div>;
              })}
              <p style={{margin:"10px 0 0",fontSize:11,color:C.muted}}>⚠️ Os Conhecimentos Específicos valem o DOBRO das Gerais. Domine Direito Tributário, Legislação Tributária e Contabilidade Avançada.</p>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.green}`,borderRadius:10,padding:"14px 16px",marginBottom:18}}>
              <h3 style={{color:C.green,margin:"0 0 10px",fontSize:14}}>✅ Checklist Final – Semana da Prova</h3>
              {["Leve caneta esferográfica de tinta PRETA ou AZUL com corpo TRANSPARENTE","Leve o DAE (Documento de Arrecadação Estadual) pago","Documento de identidade original com foto (RG, CNH, passaporte)","Chegue 1h antes do fechamento dos portões","Desligue TODO aparelho eletrônico antes de entrar","Proibido: relógio, celular, fone, smartwatch, lápis, borracha, marca-texto","Discursiva: escreva de forma legível, com início, desenvolvimento e conclusão","Respeite os mínimos de linhas: 15 (dissertativa) e 20 (estudo de caso)","Você pode sair apenas após 3h do início. Os 3 últimos candidatos ficam até o fim."].map((c,i)=>(
                <div key={i} style={{display:"flex",gap:7,marginBottom:6}}><span style={{color:C.green,fontSize:12}}>✓</span><span style={{fontSize:12,color:C.text,lineHeight:1.6}}>{c}</span></div>
              ))}
            </div>
            <div style={{textAlign:"center",padding:"16px",background:"linear-gradient(135deg,#0f2647,#1a1f35)",borderRadius:10,border:`1px solid ${C.gold}`}}>
              <p style={{margin:0,fontSize:13,color:C.goldLight,fontStyle:"italic",lineHeight:1.8}}>"Aprovação em concurso fiscal de alto nível não é questão de talento — é questão de método, consistência e profundidade de domínio. Estude a lei, resolva questões, escreva e revise. Todos os dias."</p>
              <p style={{margin:"8px 0 0",fontSize:11,color:C.muted}}>Edital SEFAZ/CE nº 01/2026 • Banca FCC • Provas: 01-02/08/2026</p>
            </div>
          </div>
        )}

        {/* TAB 6 – RESUMOS & FLASHCARDS */}
        {tab===6&&(
          <div>
            <ErrorBoundary secao="Simulados"><FlashcardsApp /></ErrorBoundary>
          </div>
        )}

        {/* TAB 7 – LEIS, FONTES E JURISPRUDÊNCIAS */}
        {tab===7&&(
          <div>
            <ErrorBoundary secao="Leis e Fontes"><LeisFontes /></ErrorBoundary>
          </div>
        )}

        {/* TAB 8 – BANCO COMPLETO */}
        {tab===8&&(
          <div>
            <h2 style={{color:C.gold,margin:"0 0 5px",fontSize:17}}>📚 Banco Completo – 30 Questões Estilo FCC</h2>
            <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
              <span style={{color:C.muted,fontSize:12}}>Disciplina:</span>
              <select value={filtDisc} onChange={e=>setFiltDisc(e.target.value)} style={{background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:6,padding:"5px 9px",fontSize:12}}>
                <option>Todas</option>
                {DISCS.map(d=><option key={d}>{d}</option>)}
              </select>
              <span style={{color:C.muted,fontSize:12}}>Dificuldade:</span>
              {["Todas","Média","Alta"].map(d=>(
                <button key={d} onClick={()=>setFiltDif(d)} style={{padding:"4px 9px",borderRadius:5,border:`1px solid ${filtDif===d?C.gold:C.border}`,background:filtDif===d?C.gold+"22":"transparent",color:filtDif===d?C.gold:C.muted,cursor:"pointer",fontSize:12}}>{d}</button>
              ))}
              <Bdg cor="#3b82f6">{bancaFilt.length} questões</Bdg>
            </div>
            {bancaFilt.map(q=>{
              const at=qAtiva===q.id;
              return (
                <div key={q.id} style={{background:C.card,border:`1px solid ${at?C.gold:C.border}`,borderRadius:10,overflow:"hidden",marginBottom:8}}>
                  <div onClick={()=>{setQAtiva(at?null:q.id);setRespostas(r=>({...r,[q.id]:null}));setGabaShow(g=>({...g,[q.id]:false}));}} style={{padding:"10px 13px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
                      <span style={{background:"#0f2647",color:"#7bb3e8",border:"1px solid #1e3a5f",borderRadius:4,padding:"2px 7px",fontSize:11,fontWeight:700}}>Q{q.id}</span>
                      <span style={{fontSize:11,color:COR_DISC[q.disc]||C.gold,fontWeight:600}}>{q.disc}</span>
                      <Bdg cor={q.dif==="Alta"?C.red:"#f59e0b"}>{q.dif}</Bdg>
                      <span style={{fontSize:10,color:C.muted}}>{q.tema}</span>
                    </div>
                    <span style={{color:C.muted,fontSize:12}}>{at?"▲":"▼"}</span>
                  </div>
                  {at&&(
                    <div style={{padding:"0 13px 13px",borderTop:`1px solid ${C.border}`}}>
                      <p style={{fontSize:13,color:C.text,lineHeight:1.8,margin:"12px 0 14px",whiteSpace:"pre-line"}}>{q.enunciado}</p>
                      <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
                        {q.alt.map((a,j)=>{
                          const L=a[0],isSel=respostas[q.id]===L,isCorr=gabaShow[q.id]&&L===q.gab,isErr=gabaShow[q.id]&&isSel&&L!==q.gab;
                          let bg="transparent",bdr=C.border,col=C.muted;
                          if(isCorr){bg="#16a34a22";bdr=C.green;col=C.green;}
                          else if(isErr){bg="#dc262222";bdr=C.red;col=C.red;}
                          else if(isSel){bg=C.gold+"18";bdr=C.gold;col=C.gold;}
                          return <div key={j} onClick={()=>!gabaShow[q.id]&&setRespostas(r=>({...r,[q.id]:L}))} style={{background:bg,border:`1px solid ${bdr}`,borderRadius:6,padding:"8px 11px",cursor:gabaShow[q.id]?"default":"pointer",color:col,fontSize:12,lineHeight:1.6}}>{a}</div>;
                        })}
                      </div>
                      {respostas[q.id]&&!gabaShow[q.id]&&<button onClick={()=>setGabaShow(g=>({...g,[q.id]:true}))} style={{background:C.gold,color:"#000",border:"none",borderRadius:6,padding:"6px 14px",cursor:"pointer",fontWeight:700,fontSize:12}}>Ver Gabarito</button>}
                      {gabaShow[q.id]&&(
                        <div>
                          <div style={{background:"#0f2647",border:"1px solid #1e3a5f",borderRadius:8,padding:"10px 12px",marginBottom:10}}>
                            <div style={{fontWeight:700,color:"#7bb3e8",marginBottom:5,fontSize:12}}>📖 Comentário</div>
                            <p style={{margin:0,fontSize:11,color:C.muted,lineHeight:1.8}}>{q.com}</p>
                          </div>
                          {q.yt&&q.yt.length>0&&(
                            <div style={{background:"#1a0a0a",border:"1px solid #7f1d1d",borderRadius:8,padding:"9px 12px",marginBottom:8}}>
                              <div style={{fontWeight:700,color:"#f87171",marginBottom:6,fontSize:11}}>▶️ Videoaulas</div>
                              {q.yt.map((l,i)=><a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{display:"block",fontSize:11,color:"#fca5a5",marginBottom:3,textDecoration:"none"}}>🎬 {l.label}</a>)}
                            </div>
                          )}
                          {q.links&&q.links.length>0&&(
                            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                              {q.links.map((l,i)=><a key={i} href={l.url} target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#93c5fd",background:"#1e3a5f",border:"1px solid #2d5a8e",borderRadius:5,padding:"4px 9px",textDecoration:"none"}}>🌐 {l.label}</a>)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
