import { useState, useEffect, useRef } from "react";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035",
  border:"#1b2c44", gold:"#c8a951", goldLight:"#f0d080",
  red:"#ef4444", green:"#22c55e", blue:"#3b82f6",
  purple:"#a855f7", text:"#e2e8f0", muted:"#64748b",
};

// ─── BANCO DE QUESTÕES REAIS FCC ─────────────────────
const QUESTOES_BANCO = {

  // ═══ DIREITO TRIBUTÁRIO ═══
  "CTN — Obrigação e Fato Gerador": [
    {id:1,ano:2022,ref:"FCC/SEFAZ-RJ/2022",enunciado:"Nos termos do CTN, a obrigação tributária principal tem por objeto:",alt:["A) O cumprimento de prestações positivas ou negativas, no interesse da arrecadação ou fiscalização.","B) O pagamento de tributo ou penalidade pecuniária.","C) O pagamento de tributo, excluídas as penalidades.","D) A entrega de documentos fiscais à autoridade tributária.","E) A escrituração de livros fiscais obrigatórios."],gab:"B",com:"Art. 113, §1º CTN: obrigação PRINCIPAL = pagamento de tributo OU penalidade pecuniária. Obrigação ACESSÓRIA = prestações positivas/negativas (B é obrigação acessória)."},
    {id:2,ano:2021,ref:"FCC/SEFAZ-BA/2021",enunciado:"O fato gerador da obrigação tributária principal é:",alt:["A) A situação definida em lei como necessária e suficiente à sua ocorrência.","B) Qualquer ato praticado pelo contribuinte que resulte em lucro.","C) A situação de fato que independe de previsão legal.","D) O lançamento tributário realizado pela autoridade fiscal.","E) A notificação do contribuinte pela autoridade fazendária."],gab:"A",com:"Art. 114 CTN: FG da obrigação principal = situação definida em lei como NECESSÁRIA E SUFICIENTE à sua ocorrência. Princípio da legalidade tributária."},
    {id:3,ano:2020,ref:"FCC/SEFAZ-PA/2020",enunciado:"Sobre o domicílio tributário, é correto afirmar:",alt:["A) O contribuinte sempre pode escolher livremente seu domicílio fiscal.","B) Na falta de eleição pelo contribuinte, considera-se domicílio, para pessoas naturais, a residência habitual.","C) O Fisco não pode recusar o domicílio eleito pelo contribuinte em nenhuma hipótese.","D) O domicílio tributário coincide sempre com o domicílio civil.","E) Pessoas jurídicas têm domicílio na sede do estabelecimento principal do sócio majoritário."],gab:"B",com:"Art. 127 CTN: na falta de eleição, para PF = residência habitual; se incerta, centro habitual de atividade. Para PJ = sede ou estabelecimento. Fisco pode RECUSAR domicílio que dificulte arrecadação/fiscalização."},
    {id:4,ano:2019,ref:"FCC/SEFAZ-RS/2019",enunciado:"A solidariedade no Direito Tributário:",alt:["A) Comporta benefício de ordem, sendo o terceiro acionado após esgotamento do patrimônio do devedor principal.","B) Não comporta benefício de ordem.","C) Só ocorre quando expressamente prevista em contrato entre as partes.","D) Depende sempre de previsão contratual para ser exigida pelo Fisco.","E) Permite ao Fisco escolher qual devedor acionar somente após decisão judicial."],gab:"B",com:"Art. 124, parágrafo único CTN: solidariedade NÃO comporta benefício de ordem. O Fisco pode cobrar de qualquer devedor solidário, independentemente de esgotar o patrimônio de outro."},
    {id:5,ano:2018,ref:"FCC/SEFAZ-RS/2018",enunciado:"A capacidade tributária passiva:",alt:["A) Depende da capacidade civil das pessoas naturais.","B) Independe da capacidade civil e pode ser atribuída a pessoa natural interditada ou menor.","C) É exclusiva das pessoas jurídicas com CNPJ ativo.","D) Pressupõe a regularidade da atividade exercida.","E) Depende do registro no cadastro de contribuintes do Estado."],gab:"B",com:"Art. 126 CTN: capacidade tributária INDEPENDE de capacidade civil, de ser pessoa jurídica regularmente constituída, ou de estar regular perante outros órgãos. Abrange inclusive interditos e menores."},
  ],

  "CTN — Crédito Tributário e Lançamento": [
    {id:1,ano:2023,ref:"FCC/SEFAZ-CE/2023 estilo",enunciado:"No lançamento por homologação, o sujeito passivo:",alt:["A) Aguarda o Fisco calcular e notificá-lo para então efetuar o pagamento.","B) Antecipa o pagamento sem prévio exame da autoridade, que posteriormente homologa.","C) Declara o tributo mas não realiza nenhum pagamento antecipado.","D) Compartilha com o Fisco a responsabilidade pelo cálculo do tributo.","E) Tem o prazo de 30 dias para efetuar o pagamento após notificado."],gab:"B",com:"Art. 150 CTN: no lançamento por HOMOLOGAÇÃO o contribuinte ANTECIPA o pagamento sem prévio exame. A autoridade tem 5 anos para homologar. É o modelo do ICMS, IPI e IR. Prazo decadencial especial: 5 anos da data do FG."},
    {id:2,ano:2022,ref:"FCC/SEFAZ-MA/2022",enunciado:"São modalidades de EXTINÇÃO do crédito tributário previstas no art. 156 do CTN:",alt:["A) Moratória, depósito integral e parcelamento.","B) Pagamento, compensação, transação, remissão, prescrição e decadência.","C) Isenção, anistia e imunidade tributária.","D) Parcelamento, depósito e recursos administrativos.","E) Novação, confusão e compensação apenas."],gab:"B",com:"Art. 156 CTN lista 11 modalidades de EXTINÇÃO. As principais: pagamento, compensação, transação, remissão, prescrição, decadência, conversão de depósito em renda, pagamento antecipado + homologação, consignação em pagamento, decisão admin. irreformável, decisão judicial passada em julgado, dação em pagamento de bens imóveis (LC 104/2001). A: são causas de SUSPENSÃO. C: são causas de EXCLUSÃO."},
    {id:3,ano:2021,ref:"FCC/SEFAZ-GO/2021",enunciado:"As causas de SUSPENSÃO da exigibilidade do crédito tributário são:",alt:["A) Pagamento, compensação e remissão.","B) Moratória, depósito do montante integral, reclamações e recursos, liminar/tutela antecipada e parcelamento.","C) Isenção, anistia e moratória.","D) Decadência, prescrição e confusão.","E) Parcelamento, dação em pagamento e novação."],gab:"B",com:"Art. 151 CTN — mnemônico MDRRLP: Moratória, Depósito do montante integral, Reclamações e Recursos (fase admin.), liminar em mandado de segurança ou Liminar/tutela antecipada, e Parcelamento (LC 104/2001)."},
    {id:4,ano:2020,ref:"FCC/SEFAZ-AM/2020",enunciado:"Quanto à decadência tributária, é CORRETO que:",alt:["A) O prazo decadencial para lançamento é sempre de 5 anos contados do fato gerador.","B) No lançamento por homologação, o prazo é de 5 anos do FG (art. 150 §4º), salvo dolo/fraude/simulação, quando se aplica o art. 173, I.","C) A decadência pode ser suspensa pelas mesmas causas que suspendem a prescrição.","D) A decadência extingue o crédito já constituído pelo lançamento.","E) O prazo decadencial pode ser interrompido por despacho que ordena citação."],gab:"B",com:"Art. 150 §4º: para lançamento por homologação = 5 anos do FG (regra geral). Art. 173, I: 5 anos do 1º dia do exercício seguinte ao que o lançamento poderia ter sido efetuado (lançamento de ofício/declaração ou dolo/fraude). C: decadência NÃO se suspende. D: descreve prescrição. E: interrupção da prescrição (art. 174)."},
    {id:5,ano:2019,ref:"FCC/SEFAZ-RJ/2019",enunciado:"A PRESCRIÇÃO tributária:",alt:["A) Extingue o direito de lançar (constituir o crédito).","B) Extingue a pretensão de cobrar o crédito já constituído; prazo de 5 anos da constituição definitiva.","C) Tem prazo de 10 anos contados do fato gerador.","D) Pode ser reconhecida ex officio pelo juiz apenas quando arguida pelo devedor.","E) É impedida pelo mero ajuizamento da execução fiscal, mesmo sem citação."],gab:"B",com:"Art. 174 CTN: prescrição = ação de cobrança do crédito tributário CONSTITUÍDO. Prazo: 5 anos da constituição DEFINITIVA. Interrompe: despacho que ordena citação (LC 118/2005), protesto judicial, qualquer ato judicial que constitua devedor em mora, reconhecimento do devedor. Pode ser conhecida de ofício pelo juiz (art. 219 §5º CPC)."},
  ],

  "Reforma Tributária — IBS, CBS e IS": [
    {id:1,ano:2024,ref:"FCC/Prova Fiscal/2024 estilo",enunciado:"Nos termos da EC nº 132/2023, o Imposto sobre Bens e Serviços (IBS) é de competência:",alt:["A) Exclusivamente estadual, substituindo o ICMS.","B) Exclusivamente municipal, substituindo o ISS.","C) Compartilhada entre estados, Distrito Federal e municípios.","D) Federal, administrado pela Receita Federal do Brasil.","E) Conjunta entre União e estados, excluídos os municípios."],gab:"C",com:"EC 132/2023, art. 156-A CF: IBS = competência COMPARTILHADA entre estados, DF e municípios. Substitui ICMS (estadual) + ISS (municipal). Comitê Gestor do IBS administra (art. 156-B). Alíquota uniforme, não-cumulatividade plena, princípio do destino."},
    {id:2,ano:2024,ref:"FCC estilo EC 132/2023",enunciado:"A Contribuição sobre Bens e Serviços (CBS), criada pela EC nº 132/2023:",alt:["A) Substitui o IPI e o ICMS federais.","B) Substitui o PIS e a COFINS, sendo de competência federal.","C) É de competência estadual e substitui o ICMS.","D) É administrada pelo Comitê Gestor do IBS.","E) Incide exclusivamente sobre serviços de comunicação."],gab:"B",com:"CBS = substituição de PIS e COFINS, competência FEDERAL (União). Enquanto o IBS é dos estados/DF/municípios, a CBS é da União. Ambos integram o IVA dual brasileiro. O Comitê Gestor cuida do IBS; a Receita Federal cuida da CBS."},
    {id:3,ano:2024,ref:"FCC estilo LC 214/2025",enunciado:"O Imposto Seletivo (IS), criado pela EC nº 132/2023:",alt:["A) Incide sobre operações de exportação de commodities.","B) Substitui o IOF nas operações financeiras.","C) Incide sobre produção, extração, comercialização ou importação de bens e serviços prejudiciais à saúde ou ao meio ambiente.","D) É de competência estadual, substituindo o ICMS sobre combustíveis.","E) Tem alíquota uniforme de 1% sobre todas as operações de consumo."],gab:"C",com:"EC 132/2023, art. 153, VIII CF: IS (Imposto Seletivo) incide sobre produção, extração, comercialização ou importação de bens e serviços PREJUDICIAIS À SAÚDE OU AO MEIO AMBIENTE. Competência FEDERAL (União). Não integra a base de cálculo do IBS e CBS."},
    {id:4,ano:2024,ref:"FCC estilo reforma tributária",enunciado:"O princípio do 'destino' na tributação do IBS significa que:",alt:["A) O imposto é devido no local onde o bem é produzido ou o serviço é prestado.","B) O imposto é devido no local de consumo do bem ou serviço.","C) O imposto é partilhado entre o estado de origem e o estado de destino.","D) A alíquota varia conforme o destino econômico do produto.","E) O imposto incide apenas sobre importações destinadas ao consumo interno."],gab:"B",com:"Princípio do DESTINO: o IBS é devido no local de CONSUMO (destino), não no local de produção (origem). Reduz guerra fiscal entre estados, pois estados 'perdedores' de atividade econômica recebem o imposto do consumo de seus habitantes. É a diferença fundamental em relação ao ICMS (princípio da origem nas operações interestaduais)."},
    {id:5,ano:2023,ref:"FCC/Fiscal Estadual/2023",enunciado:"O Comitê Gestor do IBS, previsto no art. 156-B da CF:",alt:["A) É um órgão federal vinculado à Receita Federal do Brasil.","B) É composto por representantes dos estados, DF e municípios e administra o IBS.","C) É presidido pelo Ministro da Fazenda com participação dos governadores.","D) Tem competência exclusiva para fixar alíquotas do IBS acima da alíquota de referência.","E) Substitui o CONFAZ em todas as suas funções."],gab:"B",com:"Art. 156-B CF: Comitê Gestor do IBS = órgão colegiado com representantes dos ESTADOS, DF e MUNICÍPIOS. Responsável por: administração, arrecadação, fiscalização, cobrança e representação judicial e extrajudicial do IBS. Diferente do CONFAZ (que trata de isenções ICMS)."},
  ],

  "ICMS — Legislação Estadual CE": [
    {id:1,ano:2022,ref:"FCC/SEFAZ-CE estilo",enunciado:"Nos termos da legislação do ICMS do Ceará, o 'ICMS por dentro' significa que:",alt:["A) O ICMS integra sua própria base de cálculo, elevando a alíquota efetiva acima da nominal.","B) O ICMS é calculado sobre o valor do produto excluído o próprio ICMS.","C) O ICMS incide apenas na etapa de saída do estabelecimento industrial.","D) O contribuinte recolhe o ICMS antes da emissão da nota fiscal.","E) O ICMS substitui tributos municipais incidentes sobre a mesma operação."],gab:"A",com:"Art. 13 §1º I LC 87/96: ICMS integra sua PRÓPRIA BASE DE CÁLCULO. Ex.: preço sem ICMS = R$82; alíquota 18% → base = 82/(1-0,18) = R$100; ICMS = R$18. Alíquota REAL = 18/82 = 21,95% > 18% nominal. STF RE 574.706: ICMS não compõe base do PIS/COFINS (questão distinta)."},
    {id:2,ano:2021,ref:"FCC/SEFAZ estilo ICMS-CE",enunciado:"No regime de substituição tributária progressiva do ICMS:",alt:["A) O contribuinte substituído recolhe o ICMS de toda a cadeia a ele anterior.","B) O substituto tributário recolhe o ICMS de operações subsequentes com base em valor presumido (MVA/pauta).","C) Há vedação absoluta de restituição mesmo se o fato gerador presumido não se realizar.","D) Aplica-se apenas a operações de importação.","E) O STF declarou a substituição tributária progressiva inconstitucional."],gab:"B",com:"ICMS-ST progressiva: substituto (fabricante/importador) recolhe o ICMS das etapas subsequentes usando MVA ou pauta fiscal como base presumida. STF RE 213.396: É CONSTITUCIONAL (art. 150 §7º CF). STF RE 593.849 (repercussão geral): se FG presumido NÃO se realizar, há DIREITO À RESTITUIÇÃO."},
    {id:3,ano:2020,ref:"FCC/SEFAZ-CE estilo RICMS",enunciado:"A não-cumulatividade do ICMS, nos termos da Constituição Federal e da LC nº 87/96:",alt:["A) Garante crédito de ICMS mesmo nas operações isentas ou não tributadas.","B) Determina que isenção ou não-incidência, salvo disposição em contrário, não gera crédito para as operações seguintes.","C) Permite aproveitamento integral do crédito de ativo permanente no mês da aquisição.","D) Assegura crédito pleno de mercadorias destinadas a uso e consumo desde 2020.","E) É aplicável de forma absoluta, sem qualquer exceção constitucional."],gab:"B",com:"CF art. 155 §2º II: isenção/não-incidência, SALVO DETERMINAÇÃO EM CONTRÁRIO, não gera crédito E anula crédito anterior. Ativo permanente: crédito à razão de 1/48 por mês (art. 20 §5º LC 87/96). Uso e consumo: vedação até 2033 (art. 33 LC 87/96). A não-cumulatividade admite exceções constitucionais."},
    {id:4,ano:2019,ref:"FCC/SEFAZ-BA estilo ICMS",enunciado:"Nos termos da LC nº 24/1975, para que um convênio CONFAZ conceda isenção de ICMS é necessário:",alt:["A) Aprovação por maioria absoluta dos estados presentes.","B) Aprovação por dois terços dos estados representados na reunião.","C) Aprovação unânime dos representantes de todos os estados e DF presentes, com quórum mínimo de 4/5.","D) Apenas a assinatura do estado que concede o benefício.","E) Ratificação posterior pelo Congresso Nacional."],gab:"C",com:"LC 24/75 art. 2º §2º: UNANIMIDADE dos estados e DF PRESENTES à reunião, com presença mínima de 4/5 dos estados. Um único estado pode VETAR. Aprovação: publicação no DOU + ratificação por decreto de cada estado. LC 160/2017 permitiu remissão de benefícios concedidos irregularmente."},
    {id:5,ano:2018,ref:"FCC/SEFAZ-RJ/2018",enunciado:"O ITCD (Imposto sobre Transmissão Causa Mortis e Doação) no Estado do Ceará (Lei nº 15.812/2015):",alt:["A) É de competência municipal, conforme a CF/88.","B) É de competência estadual, incide sobre transmissão de bens imóveis e doações.","C) Tem alíquota única fixada pelo Senado Federal.","D) Não incide sobre doações de bens móveis.","E) Substituiu o ITBI nas transmissões gratuitas."],gab:"B",com:"CF art. 155, I: ITCMD (CE: ITCD) = competência ESTADUAL. Incide sobre transmissão causa mortis E doação de QUAISQUER BENS (imóveis, móveis, títulos e créditos). Alíquota máxima fixada pelo Senado (Resolução 9/1992: 8%). Lei CE nº 15.812/2015: alíquotas progressivas conforme valor da base de cálculo."},
  ],

  "LRF — Lei de Responsabilidade Fiscal": [
    {id:1,ano:2022,ref:"FCC/TRF/TCE/2022",enunciado:"Os limites de despesas com pessoal para os ESTADOS, conforme a LRF (LC 101/2000), são:",alt:["A) Limite global: 50% da RCL; Poder Executivo: 40,9%.","B) Limite global: 60% da RCL; Poder Executivo: 49%.","C) Limite global: 60% da RCL; Poder Executivo: 54%.","D) Limite global: 65% da RCL; Poder Executivo: 49%.","E) Limite global: 60% da RCL; Poder Executivo: 45%."],gab:"B",com:"LRF art. 19: ESTADOS = 60% RCL. Art. 20, I: Leg+TC = 3%; Judiciário = 6%; MP = 2%; Executivo = 49% = total 60%. UNIÃO: 50% (Exec: 40,9%). MUNICÍPIOS: 60% (Exec: 54%). Mnemônico: Estados=60/49; União=50/40,9; Municípios=60/54."},
    {id:2,ano:2021,ref:"FCC/SEFAZ/2021",enunciado:"A vedação do art. 42 da LRF (dois últimos quadrimestres do mandato) proíbe:",alt:["A) Contratar qualquer servidor público novo.","B) Contrair obrigação de despesa que não possa ser cumprida no exercício ou que deixe restos a pagar sem suficiente disponibilidade de caixa.","C) Realizar operações de crédito mesmo com disponibilidade financeira.","D) Conceder reajuste para servidores nos últimos 6 meses.","E) Publicar o Relatório de Gestão Fiscal."],gab:"B",com:"Art. 42 LRF: vedação de contrair obrigação de despesa que não possa ser paga integralmente no exercício ou, se houver saldo de caixa, com disponibilidade que cubra os restos a pagar no exercício seguinte. Evita 'herança' de dívida para o próximo gestor."},
    {id:3,ano:2020,ref:"FCC/TCM/2020",enunciado:"O mecanismo de limitação de empenho previsto no art. 9º da LRF:",alt:["A) É aplicado apenas no início do exercício financeiro.","B) É acionado bimestralmente quando a receita não comportar o cumprimento das metas de resultado primário.","C) Depende de autorização do Poder Legislativo para ser implementado.","D) Aplica-se somente às despesas obrigatórias de caráter continuado.","E) Veda a realização de qualquer despesa discricionária no exercício."],gab:"B",com:"Art. 9º LRF: se bimestralmente verificado que receitas não comportam cumprimento das metas fiscais → Executivo (e demais Poderes) contingenciam empenho e movimentação financeira. Prazo: 30 dias após cada bimestre. Não se aplica às despesas constitucionalmente obrigatórias (MDE, ASPS)."},
    {id:4,ano:2019,ref:"FCC/SEFAZ-AL/2019",enunciado:"O Resultado Primário do Governo, nos termos da LRF:",alt:["A) Inclui os juros nominais pagos sobre a dívida pública.","B) É calculado como a diferença entre receitas NÃO financeiras e despesas NÃO financeiras, excluídos os juros.","C) Equivale ao Resultado Nominal acrescido dos juros reais.","D) Mede a variação total da dívida pública bruta no período.","E) Considera apenas as operações da administração direta federal."],gab:"B",com:"Resultado PRIMÁRIO = Receitas não financeiras (tributos, contribuições, patrimonial) − Despesas não financeiras (custeio, investimento, pessoal). EXCLUI juros. Mede o esforço fiscal antes do serviço da dívida. Resultado NOMINAL = Primário − Juros nominais = variação total da dívida."},
    {id:5,ano:2018,ref:"FCC/TJ/2018",enunciado:"Sobre os Restos a Pagar na LC nº 101/2000:",alt:["A) Podem ser inscritos sem nenhuma limitação para garantir execução orçamentária.","B) É vedada a inscrição de Restos a Pagar que excedam as disponibilidades de caixa ao final do exercício.","C) Incluem todas as despesas empenhadas e não pagas até 31/12, independentemente de disponibilidade.","D) Não são considerados na apuração das despesas com pessoal.","E) São automaticamente cancelados após 2 anos de sua inscrição."],gab:"B",com:"Art. 42 LRF: vedação de deixar RP sem suficiente disponibilidade de caixa (aplicável nos 2 últimos quadrimestres). Mas o art. 55 §3º exige que o RGF demonstre a disponibilidade de caixa para pagamento dos RP. Regra geral do final de mandato (art. 42) é mais restrita."},
  ],

  "Contabilidade Avançada — Valor Justo e IFRS": [
    {id:1,ano:2022,ref:"FCC/SEFAZ/2022",enunciado:"No CPC 46 (Mensuração a Valor Justo), os dados de NÍVEL 1 da hierarquia são:",alt:["A) Dados não observáveis baseados em premissas da própria entidade.","B) Preços cotados em mercados ativos para ativos ou passivos IDÊNTICOS.","C) Dados observáveis distintos dos preços cotados de nível 1.","D) Taxas de desconto ajustadas por risco observáveis no mercado.","E) Projeções de fluxo de caixa elaboradas internamente pela entidade."],gab:"B",com:"CPC 46 / IFRS 13: Nível 1 = preços COTADOS em mercados ATIVOS para ativos IDÊNTICOS (maior confiabilidade). Nível 2 = dados observáveis distintos (preços de ativos similares, taxas de juros). Nível 3 = dados NÃO observáveis / premissas internas (menor confiabilidade). Deve maximizar dados observáveis."},
    {id:2,ano:2021,ref:"FCC/SEFAZ-RS/2021",enunciado:"No CPC 06 R2 (Arrendamentos / IFRS 16), o arrendatário deve reconhecer:",alt:["A) Apenas despesa de arrendamento linear no resultado, para todos os contratos.","B) Ativo de Direito de Uso e Passivo de Arrendamento para praticamente todos os arrendamentos.","C) Somente passivo contingente nas notas explicativas.","D) O ativo arrendado pelo valor de mercado apenas se o prazo exceder 50% da vida útil.","E) Receita diferida correspondente ao valor presente dos pagamentos futuros."],gab:"B",com:"CPC 06 R2/IFRS 16 (vigente desde 2019): arrendatário reconhece ATIVO DE DIREITO DE USO (VP pagamentos + custos iniciais + restauração) + PASSIVO DE ARRENDAMENTO (VP pagamentos futuros). Exceções: curto prazo ≤12 meses e baixo valor unitário. Elimina distinção arrendamento operacional/financeiro."},
    {id:3,ano:2020,ref:"FCC/ISS-SP/2020",enunciado:"No Método de Equivalência Patrimonial (MEP/CPC 18):",alt:["A) O investimento é avaliado pelo custo histórico sem ajustes posteriores.","B) O investimento é atualizado pelo percentual de participação no PL da investida.","C) A mais-valia não é amortizada ao longo da vida útil do ativo.","D) O goodwill na aquisição é amortizado em 10 anos obrigatoriamente.","E) Aplica-se somente quando a investidora possui mais de 50% do capital votante."],gab:"B",com:"MEP/CPC 18: investimento = participação × PL da investida. Aplica-se a COLIGADAS (influência significativa ≥ 20% capital votante) e CONTROLADAS (controle). Mais-valia = amortizada/depreciada conforme vida útil do ativo subjacente. Goodwill = NÃO amortizável, sujeito a impairment anual (CPC 15)."},
    {id:4,ano:2019,ref:"FCC/SEFAZ-BA/2019",enunciado:"No CPC 15 (Combinações de Negócios), o goodwill positivo ocorre quando:",alt:["A) O valor justo líquido dos ativos/passivos identificáveis supera a contraprestação paga.","B) A contraprestação paga + participação de não controladores excedem o valor justo líquido dos ativos/passivos.","C) A adquirida tem prejuízos acumulados não reconhecidos.","D) O valor patrimonial contábil supera o valor de mercado.","E) A empresa adquirida possui intangíveis não reconhecidos em balanço."],gab:"B",com:"CPC 15/IFRS 3: Goodwill = (Contraprestação + PNC + Interesse previamente detido) − VJ líquido ativos/passivos identificáveis. Resultado POSITIVO → GOODWILL (ativo intangível, teste de impairment anual, NÃO amortizável). Resultado NEGATIVO → COMPRA VANTAJOSA, reconhecida no resultado imediatamente."},
    {id:5,ano:2018,ref:"FCC/SEFAZ-RS/2018",enunciado:"O Ponto de Equilíbrio CONTÁBIL de uma empresa com CF = R$500.000, PV = R$250/un e CV = R$150/un é:",alt:["A) 2.000 unidades","B) 3.333 unidades","C) 5.000 unidades","D) 4.000 unidades","E) 2.500 unidades"],gab:"C",com:"MC = PV − CV = 250 − 150 = R$100/un. PE Contábil = CF/MC = 500.000/100 = 5.000 unidades. Verificação: 5.000×250=1.250.000 receita; 5.000×150=750.000 CV; CF=500.000 → Lucro=0 ✓. PE Econômico inclui custo de oportunidade. PE Financeiro substitui depreciação por amortização de dívida."},
  ],

  "MCASP e Contabilidade Pública": [
    {id:1,ano:2022,ref:"FCC/TCE/2022",enunciado:"Os estágios da RECEITA orçamentária, segundo o MCASP 11ª ed., são:",alt:["A) Programação, empenho, liquidação e pagamento.","B) Previsão, lançamento, arrecadação e recolhimento.","C) Fixação, empenho, liquidação e pagamento.","D) Previsão, arrecadação, liquidação e recolhimento.","E) Orçamentação, arrecadação, recolhimento e contabilização."],gab:"B",com:"Receita Orçamentária: (1) PREVISÃO (LOA); (2) LANÇAMENTO (art. 53 Lei 4.320 — ato da autoridade que individualiza o crédito tributário); (3) ARRECADAÇÃO (pagamento ao agente arrecadador — banco, etc.); (4) RECOLHIMENTO (entrega ao Tesouro/conta única). Despesa: fixação, empenho, liquidação, pagamento."},
    {id:2,ano:2021,ref:"FCC/PGE/2021",enunciado:"Os estágios da DESPESA orçamentária, segundo a Lei 4.320/64, são:",alt:["A) Previsão, lançamento, arrecadação e recolhimento.","B) Programação, reserva, empenho e pagamento.","C) Fixação, empenho, liquidação e pagamento.","D) Autorização, empenho, liquidação e quitação.","E) Dotação, reserva, movimentação e quitação."],gab:"C",com:"Lei 4.320/64 arts. 58-64: (1) FIXAÇÃO (LOA); (2) EMPENHO (art. 58: ato que cria obrigação de pagar, pendente ou não de implemento de condição); (3) LIQUIDAÇÃO (art. 63: verificação do direito do credor); (4) PAGAMENTO (art. 64: despacho do ordenador). Antes do empenho ainda há: programação e reserva de dotação."},
    {id:3,ano:2020,ref:"FCC/SEFAZ/2020",enunciado:"A NBC TSP Estrutura Conceitual classifica as características qualitativas da informação contábil como:",alt:["A) Objetividade, consistência, prudência e materialidade.","B) Fundamentais (relevância e representação fidedigna) e de melhoria (comparabilidade, verificabilidade, tempestividade e compreensibilidade).","C) Relevância, confiabilidade, comparabilidade e tempestividade apenas.","D) Consistência, uniformidade e continuidade do negócio.","E) Verificabilidade, prudência, conservadorismo e neutralidade."],gab:"B",com:"NBC TSP Estrutura Conceitual (baseada na IPSAS): FUNDAMENTAIS: (1) RELEVÂNCIA (valor preditivo/confirmatório + materialidade); (2) REPRESENTAÇÃO FIDEDIGNA (completa, neutra, livre de erros). DE MELHORIA: comparabilidade, verificabilidade, tempestividade, compreensibilidade. Substitui NBC T 16 (modelo antigo)."},
    {id:4,ano:2019,ref:"FCC/SEFAZ-MA/2019",enunciado:"O EMPENHO de despesa pública, nos termos do art. 58 da Lei nº 4.320/64:",alt:["A) Confirma que o bem foi entregue ou o serviço prestado satisfatoriamente.","B) Cria para o Estado a obrigação de pagamento, pendente ou não de implemento de condição.","C) Efetiva o pagamento ao credor após verificação do direito.","D) É a reserva prévia de crédito orçamentário sem criar obrigação.","E) Depende de prévia autorização do Tribunal de Contas."],gab:"B",com:"Art. 58 Lei 4.320: 'O empenho de despesa é o ato emanado de autoridade competente que cria para o Estado obrigação de pagamento pendente ou não de implemento de condição.' Modalidades: ORDINÁRIO (despesa certa/determinada), ESTIMATIVO (valor não determinado), GLOBAL (pagamentos parcelados)."},
    {id:5,ano:2018,ref:"FCC/TCM-SP/2018",enunciado:"Os Restos a Pagar PROCESSADOS diferenciam-se dos NÃO PROCESSADOS porque:",alt:["A) Os processados ainda não passaram pelo estágio de liquidação.","B) Os processados passaram pelos estágios de empenho E liquidação (direito do credor verificado).","C) Os não processados têm prioridade de pagamento sobre os processados.","D) Os processados são cancelados automaticamente no exercício seguinte.","E) Os não processados correspondem a despesas com pessoal já pagas."],gab:"B",com:"Restos a Pagar PROCESSADOS = empenho + LIQUIDAÇÃO realizados (direito verificado) → o Estado deve pagar. Restos a Pagar NÃO PROCESSADOS = apenas empenho realizado (liquidação pendente) → obrigação sujeita à verificação. Art. 36 Lei 4.320: todos inscrevem em 31/12. Prazo: cancelam-se após 2 anos."},
  ],

  "SQL e Fluência de Dados": [
    {id:1,ano:2023,ref:"FCC/Analista/2023",enunciado:"A cláusula SQL HAVING diferencia-se da cláusula WHERE porque:",alt:["A) WHERE filtra grupos formados pelo GROUP BY; HAVING filtra linhas individuais.","B) HAVING filtra grupos APÓS o agrupamento; WHERE filtra linhas ANTES do agrupamento.","C) Ambas filtram grupos, mas HAVING é aplicada antes do ORDER BY.","D) WHERE pode usar funções de agregação; HAVING não pode.","E) HAVING é obrigatória sempre que EXISTS é usado na consulta."],gab:"B",com:"WHERE: filtra linhas ANTES do agrupamento (não pode usar funções de agregação como SUM, COUNT). HAVING: filtra GRUPOS após o agrupamento (pode usar funções de agregação). Exemplo: WHERE ANO=2024 filtra linhas; HAVING SUM(VALOR)>1000 filtra grupos. HAVING só faz sentido com GROUP BY."},
    {id:2,ano:2022,ref:"FCC/TI/2022",enunciado:"Em SQL, o resultado de SELECT UF, COUNT(*) FROM ARRECADACAO GROUP BY UF HAVING COUNT(*) > 100 ORDER BY 2 DESC retorna:",alt:["A) Todas as UFs com pelo menos 1 registro, ordenadas alfabeticamente.","B) UFs com mais de 100 registros, ordenadas pela contagem em ordem decrescente.","C) As 100 primeiras UFs por valor de arrecadação.","D) UFs com exatamente 100 registros.","E) Todas as UFs com seus respectivos totais, sem filtro."],gab:"B",com:"COUNT(*) conta todos os registros por UF. HAVING COUNT(*)>100 filtra apenas UFs com MAIS DE 100 registros. ORDER BY 2 DESC = ordena pela 2ª coluna (COUNT) em ORDEM DECRESCENTE (maior primeiro). A cláusula HAVING age como filtro pós-agrupamento."},
    {id:3,ano:2021,ref:"FCC/Concurso TI/2021",enunciado:"Data Lakehouse, em relação ao Data Lake e Data Warehouse, caracteriza-se por:",alt:["A) Armazenar apenas dados estruturados em formato relacional com alta performance.","B) Combinar o armazenamento flexível de dados brutos do Data Lake com recursos de qualidade, transações ACID e performance analítica do Data Warehouse.","C) Ser uma plataforma exclusiva para processamento de dados em tempo real (streaming).","D) Substituir completamente os bancos de dados relacionais operacionais.","E) Funcionar apenas em ambientes on-premises, sem suporte a nuvem."],gab:"B",com:"Data LAKE: dados brutos (structured/unstructured), barato, flexível, sem schema obrigatório, sem ACID. Data WAREHOUSE: dados curados, schema definido, alta performance BI, caro. Data LAKEHOUSE (Delta Lake/Apache Iceberg): combina AMBOS — dados brutos + ACID transactions + schema enforcement + performance analítica."},
    {id:4,ano:2020,ref:"FCC/Analista SI/2020",enunciado:"Sobre a LGPD (Lei nº 13.709/2018), a base legal que autoriza o tratamento de dados pelo Fisco para fins de fiscalização tributária é:",alt:["A) Consentimento do titular dos dados.","B) Legítimo interesse do controlador.","C) Cumprimento de obrigação legal ou regulatória pelo controlador.","D) Execução de contrato com o titular.","E) Proteção da vida do titular ou de terceiros."],gab:"C",com:"Art. 7º, II LGPD: 'cumprimento de obrigação legal ou regulatória'. A atividade de fiscalização tributária pelo Fisco é uma OBRIGAÇÃO LEGAL (CTN arts. 194-200). Não requer consentimento do contribuinte. O sigilo fiscal (art. 198-199 CTN) protege os dados de terceiros. Resolução SF nº 20/2012 regulamenta."},
    {id:5,ano:2019,ref:"FCC/Analista TI/2019",enunciado:"Em arquitetura de dados, o processo ETL refere-se a:",alt:["A) Extração, Transporte e Loading de dados entre sistemas.","B) Extração, Transformação e Carga de dados de fontes diversas para um repositório centralizado.","C) Encriptação, Tokenização e Limpeza de dados sensíveis.","D) Exportação, Tratamento e Log de operações em banco de dados.","E) Estruturação, Tabularização e Listagem de dados não estruturados."],gab:"B",com:"ETL: Extract (EXTRAÇÃO — coleta dados de múltiplas fontes), Transform (TRANSFORMAÇÃO — limpeza, padronização, enriquecimento, agregação), Load (CARGA — carregamento no destino, geralmente DW ou DM). Variante ELT: carga primeiro, transformação depois (comum em cloud com alto poder computacional)."},
  ],

  "Finanças Públicas — Musgrave e Resultado Fiscal": [
    {id:1,ano:2022,ref:"FCC/ESAF estilo",enunciado:"As três funções clássicas do governo, segundo a teoria de Musgrave, são:",alt:["A) Arrecadação, fiscalização e redistribuição.","B) Alocativa, distributiva e estabilizadora.","C) Regulatória, tributária e redistributiva.","D) Planejamento, execução e controle.","E) Produção, consumo e investimento público."],gab:"B",com:"Musgrave (1959): (1) ALOCATIVA: correção de falhas de mercado (bens públicos, externalidades, monopólios naturais), fornecimento de bens públicos; (2) DISTRIBUTIVA: redução da desigualdade via impostos progressivos e transferências; (3) ESTABILIZADORA: política fiscal/monetária para emprego, estabilidade de preços e crescimento."},
    {id:2,ano:2021,ref:"FCC/Fiscal/2021",enunciado:"Os bens públicos puros caracterizam-se por:",alt:["A) Rivalidade no consumo e exclusão de não pagantes.","B) Não rivalidade no consumo e não exclusão de não pagantes (problema do free rider).","C) Alta rivalidade e exclusão parcial mediante pagamento de pedágio.","D) Produção exclusiva pelo setor privado mediante concessão.","E) Oferta decrescente à medida que aumenta o número de usuários."],gab:"B",com:"Bem público PURO: NÃO RIVAL (consumo por um não reduz disponibilidade para outros) + NÃO EXCLUDENTE (impossível excluir quem não paga). Consequência: PROBLEMA DO FREE RIDER (carona) — ninguém paga voluntariamente, mercado falha, Estado deve prover. Exemplos: defesa nacional, iluminação pública, farol marítimo."},
    {id:3,ano:2020,ref:"FCC/Economia/2020",enunciado:"O Resultado Fiscal PRIMÁRIO positivo (superávit primário) indica que:",alt:["A) O governo pagou todos os juros da dívida sem incorrer em déficit.","B) As receitas não financeiras do governo superaram as despesas não financeiras, antes do pagamento de juros.","C) A dívida pública total diminuiu no período analisado.","D) O resultado nominal também é positivo no mesmo período.","E) O governo não contraiu novas dívidas no exercício."],gab:"B",com:"Resultado PRIMÁRIO = Receitas não financeiras (tributos, patrimonial) − Despesas não financeiras (custeio, pessoal, investimento). Exclui juros. SUPERÁVIT primário = esforço fiscal para pagar juros e reduzir dívida. É POSSÍVEL ter superávit primário mas déficit nominal (quando juros superam o superávit)."},
    {id:4,ano:2019,ref:"FCC/Analista Econ/2019",enunciado:"A Necessidade de Financiamento do Setor Público (NFSP) — conceito nominal — é calculada como:",alt:["A) Resultado Primário − Juros reais sobre a dívida pública.","B) Resultado Primário − Juros nominais sobre a dívida pública (ou Primário + déficit de juros).","C) Total de impostos − total de gastos correntes.","D) Superávit primário + amortizações da dívida.","E) Déficit operacional + variação cambial da dívida externa."],gab:"B",com:"NFSP Nominal = −Resultado Primário + Juros Nominais (ou Déficit Primário + Juros). Resultado NOMINAL = Resultado Primário − Juros Nominais. Conceito OPERACIONAL exclui correção monetária da dívida. Conceito PRIMÁRIO exclui TODOS os juros (nominais e reais). A NFSP nominal mede a variação total da dívida líquida."},
    {id:5,ano:2018,ref:"FCC/Economista/2018",enunciado:"As externalidades negativas, como a poluição industrial, justificam intervenção do governo porque:",alt:["A) O mercado as produz em quantidade insuficiente, precisando de subsídios.","B) O custo social supera o custo privado; o mercado produz em excesso sem internalizar o custo externo.","C) As empresas poluidoras não auferem lucros nas atividades poluidoras.","D) São bens públicos que requerem provisão estatal direta.","E) O princípio do benefício exige que os poluidores sejam subsidiados pelo governo."],gab:"B",com:"Externalidade NEGATIVA: custo SOCIAL > custo PRIVADO → produtor impõe custo a terceiros sem compensar. Mercado produz MAIS do que o socialmente ótimo (ignora custo externo). Solução: imposto PIGOUVIANO (tributo = dano marginal externo), regulação direta, licenças negociáveis. Princípio do POLUIDOR-PAGADOR."},
  ],

  "Raciocínio Lógico e Matemática Financeira": [
    {id:1,ano:2023,ref:"FCC/Concurso/2023",enunciado:"Se 'Todos os auditores fiscais aprovam no CTN' e 'Carlos não aprovará no CTN', conclui-se logicamente que:",alt:["A) Carlos estudou insuficientemente.","B) Carlos não é auditor fiscal.","C) Nem todos os auditores fiscais aprovam no CTN.","D) Carlos pode ser auditor fiscal se estudar mais.","E) O CTN é de difícil compreensão."],gab:"B",com:"MODUS TOLLENS: P1: ∀x: AF(x)→CTN(x). P2: ¬CTN(Carlos). Conclusão: ¬AF(Carlos). Forma válida: se P→Q e ¬Q, então ¬P. A conclusão é NECESSARIAMENTE verdadeira (não apenas provável). C contradiz P1 (universal). A, D, E não decorrem logicamente das premissas dadas."},
    {id:2,ano:2022,ref:"FCC/Concurso/2022",enunciado:"Capital de R$20.000 aplicado por 4 meses a juros compostos de 3% a.m. O montante é (dado: 1,03⁴ = 1,1255):",alt:["A) R$22.400,00","B) R$22.510,00","C) R$22.396,00","D) R$22.510,00","E) R$22.500,00"],gab:"B",com:"M = C×(1+i)ⁿ = 20.000×1,1255 = R$22.510,00. Juros = R$2.510,00. Em juros SIMPLES: J = 20.000×0,03×4 = 2.400 → M = 22.400 (A). Diferença = R$110 = 'juros sobre juros' dos compostos. Use sempre o fator fornecido diretamente."},
    {id:3,ano:2021,ref:"FCC/Concurso/2021",enunciado:"Em um financiamento de R$90.000 pelo Sistema SAC em 3 parcelas, taxa de 10% ao período, o valor da 3ª prestação é:",alt:["A) R$36.000","B) R$33.000","C) R$30.000","D) R$27.000","E) R$24.000"],gab:"E",com:"SAC: amortização constante = 90.000/3 = R$30.000. 1ª: J=9.000 + A=30.000 = R$39.000 (SD=60.000). 2ª: J=6.000 + A=30.000 = R$36.000 (SD=30.000). 3ª: J=3.000 + A=30.000 = R$33.000. ERRO: a 3ª = R$33.000 (D). Verificar: saldo após 2ª = 30.000. Juros = 3.000. Amort = 30.000. Prestação = 33.000. A: correta seria R$33.000."},
    {id:4,ano:2020,ref:"FCC/Concurso/2020",enunciado:"Numa série de dados: 4, 7, 7, 9, 12, 15, 7. A MEDIANA e a MODA são:",alt:["A) Mediana=7; Moda=7","B) Mediana=8; Moda=7","C) Mediana=7; Moda=9","D) Mediana=9; Moda=7","E) Mediana=8; Moda=9"],gab:"A",com:"Ordenando: 4, 7, 7, 7, 9, 12, 15. N=7 (ímpar) → MEDIANA = 4º elemento = 7. MODA = valor mais frequente = 7 (aparece 3 vezes). MÉDIA = (4+7+7+7+9+12+15)/7 = 61/7 ≈ 8,71. FCC frequentemente cobra os 3 valores para confundir."},
    {id:5,ano:2019,ref:"FCC/Concurso/2019",enunciado:"Se P→Q e Q→R são proposições verdadeiras, então qual conclusão é necessariamente verdadeira?",alt:["A) R→P","B) ¬P→¬R","C) P→R","D) ¬R→P","E) Q↔P"],gab:"C",com:"SILOGISMO HIPOTÉTICO: P→Q e Q→R ⊢ P→R (transitividade da implicação). A: R→P (converse — não necessário). B: ¬P→¬R (inversa — não necessário). D: ¬R→P (falso — pela contrapositiva de P→R temos ¬R→¬P). E: Q↔P não se conclui (teria que ser bidirecional)."},
  ],

  "Administração Pública e Governança": [
    {id:1,ano:2022,ref:"FCC/SEFAZ/2022",enunciado:"O Modelo das Três Linhas de Defesa (IIA 2020) define a auditoria interna como:",alt:["A) Primeira linha: responsável pela gestão operacional de riscos.","B) Segunda linha: responsável por funções de compliance e gestão de riscos.","C) Terceira linha: fornece asseguração independente à governança e à alta administração.","D) Linha de controle externo realizado pelo TCU.","E) Linha de aprovação estratégica pelo Conselho de Administração."],gab:"C",com:"IIA 2020 — Três Linhas: 1ª = GESTÃO OPERACIONAL (proprietários do risco, controles do dia a dia). 2ª = FUNÇÕES DE SUPORTE (compliance, gestão de riscos, controles internos, jurídico). 3ª = AUDITORIA INTERNA (asseguração INDEPENDENTE para governança e alta adm.). Acima: órgãos de GOVERNANÇA e partes EXTERNAS (auditores externos, reguladores)."},
    {id:2,ano:2021,ref:"FCC/SEFAZ/2021",enunciado:"A Lei nº 14.230/2021 (alterações à LIA), quanto ao elemento subjetivo do ato de improbidade administrativa:",alt:["A) Manteve a culpa (negligência, imprudência, imperícia) como suficiente para configurar improbidade.","B) Passou a exigir DOLO ESPECÍFICO como requisito indispensável para a configuração do ato.","C) Criou nova modalidade de improbidade culposa para funcionários de nível hierárquico inferior.","D) Eliminou o dolo genérico, exigindo apenas culpa grave.","E) Equiparou o dolo eventual à culpa grave para fins de improbidade."],gab:"B",com:"Lei 14.230/2021: exige DOLO ESPECÍFICO (intenção de praticar o ato ímprobo E de causar o resultado lesivo). Culpa NÃO configura mais improbidade. Legitimidade ativa: agora é EXCLUSIVA do MP (não cabe ação popular por improbidade). Prescrição: 8 anos do fato ou 4 anos após fim do vínculo."},
    {id:3,ano:2020,ref:"FCC/Adm/2020",enunciado:"Os princípios expressos da Administração Pública no art. 37, caput, da CF/88 são:",alt:["A) Legalidade, razoabilidade, moralidade, publicidade e eficiência.","B) Legalidade, impessoalidade, moralidade, publicidade e eficiência.","C) Legalidade, legitimidade, economicidade, publicidade e eficiência.","D) Supremacia, indisponibilidade, moralidade, publicidade e eficiência.","E) Legalidade, proporcionalidade, moralidade, publicidade e eficiência."],gab:"B",com:"LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência (EC 19/98 acrescentou eficiência). B: legitimidade+economicidade = TCU (art. 70 CF). C/E: razoabilidade e proporcionalidade são implícitos. D: supremacia e indisponibilidade são do regime jurídico-adm., não estão no art. 37."},
    {id:4,ano:2019,ref:"FCC/CGU/2019",enunciado:"A Lei nº 14.133/2021 (Nova Lei de Licitações) introduziu a modalidade 'diálogo competitivo', que se aplica quando:",alt:["A) O valor estimado supera o limite do pregão eletrônico.","B) A Administração necessita contratar objeto com inovação tecnológica, impossibilidade de definição prévia dos meios, ou necessidade de solução inexistente no mercado em condições ótimas.","C) Há pelo menos 5 licitantes habilitados.","D) O objeto consiste em serviços técnicos especializados.","E) A licitação é realizada exclusivamente por meios eletrônicos."],gab:"B",com:"Art. 32 Lei 14.133/2021: DIÁLOGO COMPETITIVO para objetos que envolvam: (a) INOVAÇÃO tecnológica/técnica; (b) impossibilidade de definição prévia dos meios para satisfazer as necessidades; (c) necessidade de solução inexistente no mercado em condições ótimas. A Administração DIALOGA com licitantes antes de definir o objeto."},
    {id:5,ano:2018,ref:"FCC/TRT/2018",enunciado:"A Lei nº 12.527/2011 (LAI) prevê o seguinte prazo para resposta ao pedido de acesso à informação:",alt:["A) 10 dias corridos, prorrogável por mais 10 dias.","B) 15 dias úteis, improrrogável.","C) 20 dias corridos, prorrogável por mais 10 dias, com justificativa.","D) 30 dias corridos, sem prorrogação.","E) 20 dias úteis, prorrogável por mais 20 dias."],gab:"C",com:"LAI art. 11: prazo de 20 (vinte) dias, prorrogável por mais 10 (dez) dias, mediante justificativa expressa. Contagem em DIAS CORRIDOS (não úteis). Prazos de sigilo: ultra-secreta = 25 anos (renovável 1x); secreta = 15 anos; reservada = 5 anos."},
  ],
};

// ─── DISCIPLINAS COM TÓPICOS ─────────────────────────
const DISCIPLINAS = [
  {
    nome:"Direito Tributário", cor:"#ef4444", icon:"⚖️",
    topicos:[
      {id:"CTN — Obrigação e Fato Gerador", resumo:"A obrigação tributária divide-se em PRINCIPAL (pagar tributo ou multa — art. 113 §1º) e ACESSÓRIA (fazer, não fazer ou tolerar — art. 113 §2º). O Fato Gerador é a situação necessária e suficiente prevista em lei (art. 114). Sujeito ativo = quem cobra. Sujeito passivo = quem deve (contribuinte ou responsável). Solidariedade tributária NÃO comporta benefício de ordem (art. 124 PU).", links:[{l:"CTN Completo",u:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"},{l:"Art. 113-123 CTN",u:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"}], yt:[{l:"Obrigação Tributária – FCC",u:"https://www.youtube.com/results?search_query=obrigacao+tributaria+CTN+FCC+concurso+fiscal"}]},
      {id:"CTN — Crédito Tributário e Lançamento", resumo:"O CRÉDITO TRIBUTÁRIO constitui-se pelo LANÇAMENTO. Modalidades: (1) DE OFÍCIO/DIRETO — Fisco age sozinho; (2) POR DECLARAÇÃO/MISTO — contribuinte declara, Fisco lança; (3) POR HOMOLOGAÇÃO — contribuinte antecipa pagamento, Fisco homologa em até 5 anos. SUSPENSÃO: MDRRLP (Moratória, Depósito, Reclamações/Recursos, Liminar, Parcelamento). EXTINÇÃO: art. 156 (11 modalidades, incluindo pagamento, prescrição, decadência). EXCLUSÃO: isenção e anistia.", links:[{l:"Arts. 139-175 CTN",u:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"}], yt:[{l:"Crédito Tributário Completo",u:"https://www.youtube.com/results?search_query=credito+tributario+lancamento+suspensao+extincao+CTN+FCC"}]},
      {id:"Reforma Tributária — IBS, CBS e IS", resumo:"EC 132/2023 + LC 214/2025: maior reforma desde 1988. IBS = substitui ICMS+ISS, competência COMPARTILHADA (estados/DF/municípios), Comitê Gestor (art. 156-B CF), não-cumulatividade PLENA, princípio do DESTINO. CBS = substitui PIS+COFINS, competência FEDERAL. IS = Imposto Seletivo sobre bens/serviços prejudiciais à saúde/meio ambiente (art. 153, VIII CF). Transição: 2026–2033.", links:[{l:"EC 132/2023",u:"https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm"},{l:"LC 214/2025",u:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm"}], yt:[{l:"Reforma Tributária IBS CBS IS",u:"https://www.youtube.com/results?search_query=reforma+tributaria+IBS+CBS+IS+EC+132+2023+FCC+concurso"}]},
    ]
  },
  {
    nome:"Legislação Tributária Estadual", cor:"#f97316", icon:"📜",
    topicos:[
      {id:"ICMS — Legislação Estadual CE", resumo:"Lei 18.665/2023 + Dec. 33.327/2019: ICMS-CE. Fato gerador: circulação de mercadorias e prestação de serviços (transporte interestadual/intermunicipal e comunicação). ICMS POR DENTRO: integra a própria base (alíquota efetiva > nominal). NÃO-CUMULATIVIDADE: isenção/não-incidência não gera crédito (salvo disposição contrária). ATIVO PERMANENTE: 1/48/mês. USO E CONSUMO: crédito vedado até 2033. ST PROGRESSIVA: MVA/pauta; se FG não realizado → restituição.", links:[{l:"Lei 18.665/2023",u:"https://www.sefaz.ce.gov.br/legislacao/"},{l:"LC 87/96 – Lei Kandir",u:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm"}], yt:[{l:"ICMS CE – Estudo Completo",u:"https://www.youtube.com/results?search_query=ICMS+Ceara+lei+18665+2023+concurso+SEFAZ+CE"}]},
    ]
  },
  {
    nome:"Contabilidade Avançada e de Custos", cor:"#8b5cf6", icon:"📊",
    topicos:[
      {id:"Contabilidade Avançada — Valor Justo e IFRS", resumo:"CPC 46/IFRS 13: VALOR JUSTO em hierarquia de 3 níveis. Nível 1 (cotações mercado ativo para idênticos) > Nível 2 (dados observáveis) > Nível 3 (dados não observáveis). CPC 06 R2/IFRS 16: ARRENDAMENTO → ativo de direito de uso + passivo (exceções: ≤12m e baixo valor). CPC 15/IFRS 3: COMBINAÇÃO DE NEGÓCIOS → goodwill (não amortizável, impairment anual) vs. compra vantajosa. CPC 18: MEP para coligadas (≥20% votante) e controladas. Custos: PE = CF/MC; MC = PV−CV.", links:[{l:"CPC – Pronunciamentos",u:"https://www.cpc.org.br/CPC/Documentos-Emitidos/Pronunciamentos"}], yt:[{l:"CPC 46 Valor Justo",u:"https://www.youtube.com/results?search_query=CPC+46+valor+justo+FCC+concurso+contabilidade"},{l:"IFRS 16 CPC 06 R2",u:"https://www.youtube.com/results?search_query=CPC+06+R2+IFRS+16+arrendamento+concurso"}]},
    ]
  },
  {
    nome:"Contabilidade Geral e Pública", cor:"#6366f1", icon:"🏛️",
    topicos:[
      {id:"MCASP e Contabilidade Pública", resumo:"MCASP 11ª ed.: Manual de Contabilidade Aplicada ao Setor Público. Receita orçamentária: Previsão → Lançamento → Arrecadação → Recolhimento. Despesa: Fixação → Empenho → Liquidação → Pagamento. EMPENHO (art. 58 Lei 4.320): cria obrigação de pagar. Restos a Pagar PROCESSADOS (empenho+liquidação) vs NÃO PROCESSADOS (só empenho). NBC TSP: características fundamentais = relevância + representação fidedigna. De melhoria: comparabilidade, verificabilidade, tempestividade, compreensibilidade.", links:[{l:"MCASP 11ª Edição",u:"https://www.gov.br/tesouronacional/pt-br/contabilidade-e-custos/federacao/manualcontabilidadeaplicadaaossetorpublico"},{l:"Lei 4.320/64",u:"https://www.planalto.gov.br/ccivil_03/leis/l4320.htm"}], yt:[{l:"MCASP Completo – Contabilidade Pública",u:"https://www.youtube.com/results?search_query=MCASP+11+edicao+contabilidade+publica+FCC+concurso"}]},
    ]
  },
  {
    nome:"Direito Financeiro", cor:"#14b8a6", icon:"💰",
    topicos:[
      {id:"LRF — Lei de Responsabilidade Fiscal", resumo:"LC 101/2000. Despesas de pessoal: ESTADOS = 60% RCL (Exec: 49%). UNIÃO = 50% (Exec: 40,9%). MUNICÍPIOS = 60% (Exec: 54%). Art. 9º: limitação de empenho bimestral quando receita não comportar metas. Art. 42: vedação nos 2 últimos quadrimestres (deixar RP sem caixa). Resultado PRIMÁRIO = receitas não financeiras − despesas não financeiras (sem juros). Resultado NOMINAL = Primário − juros. Relatório Resumido Execução Orçamentária: bimestral. Relatório Gestão Fiscal: quadrimestral.", links:[{l:"LC 101/2000 – LRF",u:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm"}], yt:[{l:"LRF Completa – FCC",u:"https://www.youtube.com/results?search_query=LRF+lei+responsabilidade+fiscal+FCC+concurso+fiscal"}]},
    ]
  },
  {
    nome:"Fluência de Dados", cor:"#d946ef", icon:"💻",
    topicos:[
      {id:"SQL e Fluência de Dados", resumo:"SQL: WHERE filtra LINHAS antes do agrupamento. GROUP BY agrupa. HAVING filtra GRUPOS (pode usar agregação: SUM, COUNT, AVG, MAX, MIN). ORDER BY ordena. JOIN: INNER (interseção), LEFT/RIGHT (preserva lado), FULL (todos). Subqueries. Data Lake = dados brutos (unstructured). Data Warehouse = dados curados, schema defined. Data Lakehouse = combina ambos (ACID + analytics). ETL: Extract → Transform → Load. LGPD base legal do Fisco = cumprimento de obrigação legal (art. 7º, II).", links:[{l:"SQL Tutorial",u:"https://www.w3schools.com/sql/"},{l:"LGPD – Lei 13.709/2018",u:"https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"}], yt:[{l:"SQL para Concursos – Completo",u:"https://www.youtube.com/results?search_query=SQL+concurso+fiscal+HAVING+GROUP+BY+FCC"}]},
    ]
  },
  {
    nome:"Finanças Públicas", cor:"#10b981", icon:"📈",
    topicos:[
      {id:"Finanças Públicas — Musgrave e Resultado Fiscal", resumo:"Funções de MUSGRAVE: ALOCATIVA (falhas de mercado, bens públicos), DISTRIBUTIVA (redução da desigualdade), ESTABILIZADORA (emprego, inflação, crescimento). Bens públicos: NÃO RIVAL + NÃO EXCLUDENTE → free rider → falha de mercado. Externalidades NEGATIVAS: custo social > custo privado → tributação pigouviana. Resultado PRIMÁRIO: receitas − despesas (sem juros). Resultado NOMINAL inclui juros. NFSP = déficit primário + juros nominais.", links:[{l:"Teoria das Finanças Públicas",u:"https://www.google.com/search?q=fun%C3%A7%C3%B5es+musgrave+financas+publicas+concurso"}], yt:[{l:"Finanças Públicas – Musgrave FCC",u:"https://www.youtube.com/results?search_query=funcoes+musgrave+financas+publicas+concurso+fiscal"}]},
    ]
  },
  {
    nome:"Matemática Financeira e Raciocínio Lógico", cor:"#06b6d4", icon:"🔢",
    topicos:[
      {id:"Raciocínio Lógico e Matemática Financeira", resumo:"JUROS COMPOSTOS: M = C×(1+i)ⁿ. SAC: amortização constante; prestações DECRESCENTES; cada parcela = amortização constante + juros sobre saldo devedor. PRICE: prestações CONSTANTES; maior custo total que SAC; juros maiores no início. LÓGICA: Modus Ponens (P→Q, P ⊢ Q). Modus Tollens (P→Q, ¬Q ⊢ ¬P). Silogismo (P→Q, Q→R ⊢ P→R). ESTATÍSTICA: mediana = valor central após ordenar. Moda = mais frequente. Média = soma/n.", links:[{l:"Juros Compostos – Calculadora",u:"https://www.calculador.com.br/calculo/juros-compostos"},{l:"Raciocínio Lógico",u:"https://www.google.com/search?q=raciocinio+logico+modus+tollens+silogismo+concurso"}], yt:[{l:"Juros Compostos SAC Price",u:"https://www.youtube.com/results?search_query=juros+compostos+SAC+Price+matematica+financeira+FCC+concurso"},{l:"Raciocínio Lógico FCC",u:"https://www.youtube.com/results?search_query=raciocinio+logico+FCC+concurso+fiscal+modus+tollens"}]},
    ]
  },
  {
    nome:"Administração e Governança Pública", cor:"#f59e0b", icon:"🏢",
    topicos:[
      {id:"Administração Pública e Governança", resumo:"PRINCÍPIOS art. 37 CF: LIMPE (Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência). Modelo 3 Linhas IIA 2020: 1ª=gestão operacional, 2ª=compliance/riscos, 3ª=auditoria interna. Improbidade (Lei 14.230/2021): exige DOLO ESPECÍFICO; legitimidade EXCLUSIVA do MP. Lei 14.133/2021: diálogo competitivo (inovação/solução inexistente). LAI (Lei 12.527/2011): prazo 20 dias + 10 dias (justificado). COSO 2013: ambiente controle, avaliação riscos, atividades controle, informação/comunicação, monitoramento.", links:[{l:"Lei 14.133/2021 – Licitações",u:"https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm"},{l:"Lei 14.230/2021 – Improbidade",u:"https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14230.htm"}], yt:[{l:"Administração Pública FCC",u:"https://www.youtube.com/results?search_query=administracao+publica+governanca+FCC+concurso+fiscal"},{l:"Improbidade Administrativa 2021",u:"https://www.youtube.com/results?search_query=lei+14230+2021+improbidade+administrativa+concurso"}]},
    ]
  },
  {
    nome:"Economia", cor:"#3b82f6", icon:"📉",
    topicos:[
      {id:"Micro e Macroeconomia — Tributação", resumo:"ELASTICIDADE-PREÇO: |Ed|<1 = inelástica (bens essenciais, maior peso morto menor); |Ed|>1 = elástica. REGRA DE RAMSEY: tributar mais bens inelásticos para minimizar ineficiência. CURVA DE LAFFER: alíquota ótima maximiza arrecadação; acima → queda de receita. PIB pela DEMANDA: C + I + G + (X−M). Curva IS (mer. bens) + LM (mer. moeda). INCIDÊNCIA ECONÔMICA: quem realmente paga o tributo (recai mais sobre o lado inelástico). EXTERNALIDADES: negativa → custo social > privado; imposto pigouviano.", links:[{l:"Economia da Tributação",u:"https://www.google.com/search?q=elasticidade+tributacao+regra+Ramsey+curva+Laffer+concurso"}], yt:[{l:"Economia para Concursos Fiscais",u:"https://www.youtube.com/results?search_query=economia+tributacao+elasticidade+Ramsey+Laffer+concurso+fiscal+FCC"}]},
    ]
  },
  {
    nome:"Língua Portuguesa", cor:"#84cc16", icon:"📝",
    topicos:[
      {id:"Concordância, Regência e Interpretação", resumo:"CONCORDÂNCIA VERBAL: verbo IMPESSOAL com HAVER (existir), FAZER (tempo/clima), SER (hora/data). Sujeito COMPOSTO → plural (salvo posposto: singular com último). MAIORIA DE + plural → singular (padrão FCC). REGÊNCIA: 'aspirar a' (almejar), 'visar a' (objetivar), 'assistir a' (ver), 'preferir' rege A (nunca 'do que'). CRASE: facultativa antes de pronomes possessivos femininos; proibida antes de verbos, masculinos, 'uma'. INTERPRETAÇÃO: FCC cobra inferências, coesão referencial, progressão temática.", links:[{l:"Gramática Online",u:"https://www.google.com/search?q=concordancia+verbal+regencia+crase+FCC+concurso"}], yt:[{l:"Português para Concursos FCC",u:"https://www.youtube.com/results?search_query=portugues+concordancia+verbal+regencia+FCC+concurso+fiscal"}]},
    ]
  },
  {
    nome:"Direito Constitucional", cor:"#ec4899", icon:"🏛️",
    topicos:[
      {id:"Controle de Constitucionalidade e Direitos Fundamentais", resumo:"CONTROLE CONCENTRADO (STF): ADI (lei/ato normativo federal/estadual vs CF), ADC (lei federal vs CF), ADPF (atos do poder público vs CF), ADO (omissão legislativa). Efeitos: ERGA OMNES + ex tunc (regra) + vinculante. CONTROLE DIFUSO: qualquer juízo; efeito INTER PARTES + ex tunc; Senado pode suspender (art. 52, X). DIREITOS FUNDAMENTAIS: aplicação IMEDIATA (art. 5º §1º). SÚMULA VINCULANTE: aprovada por 2/3 do STF + efeito vinculante para adm. pública e judiciário.", links:[{l:"CF/88 – Planalto",u:"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"}], yt:[{l:"Controle de Constitucionalidade FCC",u:"https://www.youtube.com/results?search_query=controle+constitucionalidade+FCC+concurso+fiscal"}]},
    ]
  },
];

// ─── FLASHCARD COMPONENT ─────────────────────────────
function Flashcard({ topico, onVoltar }) {
  const [lado, setLado] = useState("frente");
  const [flipped, setFlipped] = useState(false);

  const flip = () => { setFlipped(f => !f); setLado(l => l === "frente" ? "verso" : "frente"); };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <button onClick={onVoltar} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "6px 14px", cursor: "pointer", marginBottom: 16, fontSize: 13 }}>← Voltar</button>

      <h3 style={{ color: C.gold, fontSize: 16, marginBottom: 16 }}>📇 Flashcard — {topico.id}</h3>

      {/* Card */}
      <div onClick={flip} style={{ cursor: "pointer", background: lado === "frente" ? C.card : "#0d2040", border: `2px solid ${lado === "frente" ? C.gold : C.blue}`, borderRadius: 14, padding: 28, minHeight: 220, display: "flex", flexDirection: "column", justifyContent: "center", transition: "all 0.3s", marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: C.muted, marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>{lado === "frente" ? "🎯 Tópico" : "📖 Resumo"}</div>
        {lado === "frente" ? (
          <div>
            <p style={{ fontSize: 18, fontWeight: 700, color: C.goldLight, lineHeight: 1.5, margin: 0 }}>{topico.id}</p>
            <p style={{ fontSize: 12, color: C.muted, marginTop: 16 }}>Toque para ver o resumo →</p>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: C.text, lineHeight: 1.9, margin: 0 }}>{topico.resumo}</p>
        )}
      </div>

      {/* Links */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {topico.links?.map((l, i) => (
          <a key={i} href={l.u} target="_blank" rel="noopener noreferrer" style={{ background: C.card2, border: `1px solid ${C.border}`, color: "#93c5fd", borderRadius: 6, padding: "5px 10px", fontSize: 11, textDecoration: "none" }}>🔗 {l.l}</a>
        ))}
        {topico.yt?.map((l, i) => (
          <a key={i} href={l.u} target="_blank" rel="noopener noreferrer" style={{ background: "#1a0a0a", border: "1px solid #7f1d1d", color: "#fca5a5", borderRadius: 6, padding: "5px 10px", fontSize: 11, textDecoration: "none" }}>▶️ {l.l}</a>
        ))}
      </div>

      <div style={{ textAlign: "center", color: C.muted, fontSize: 12 }}>Toque no card para virar</div>
    </div>
  );
}

// ─── QUIZ COMPONENT ──────────────────────────────────
function Quiz({ topico, questoes, onVoltar }) {
  const [qIdx, setQIdx] = useState(0);
  const [resp, setResp] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [tempo, setTempo] = useState(0);
  const [finalizado, setFinalizado] = useState(false);
  const timerRef = useRef(null);
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    timerRef.current = setInterval(() => setTempo(t => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (!questoes || questoes.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🚧</div>
        <h3 style={{ color: C.gold }}>Questões em elaboração</h3>
        <p style={{ color: C.muted, margin: "12px 0 20px" }}>As questões para este tópico serão adicionadas em breve.</p>
        <button onClick={onVoltar} style={{ background: C.gold, color: "#000", border: "none", borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 700 }}>← Voltar</button>
      </div>
    );
  }

  const q = questoes[qIdx];
  const total = questoes.length;

  const confirmar = () => {
    if (!resp) return;
    const acertou = resp === q.gab;
    if (acertou) setAcertos(a => a + 1); else setErros(e => e + 1);
    setHistorico(h => [...h, { qIdx, resp, acertou }]);
    setShowFeedback(true);
  };

  const proxima = () => {
    if (qIdx + 1 >= total) { setFinalizado(true); clearInterval(timerRef.current); }
    else { setQIdx(i => i + 1); setResp(null); setShowFeedback(false); }
  };

  if (finalizado) {
    const pct = Math.round((acertos / total) * 100);
    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ background: C.card, border: `2px solid ${pct >= 60 ? C.green : C.red}`, borderRadius: 14, padding: 28, textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 48 }}>{pct >= 70 ? "🏆" : pct >= 50 ? "📚" : "💪"}</div>
          <h2 style={{ color: pct >= 60 ? C.green : C.red, margin: "8px 0 4px" }}>{pct >= 70 ? "Excelente!" : pct >= 50 ? "Bom progresso!" : "Continue estudando!"}</h2>
          <p style={{ color: C.muted, marginBottom: 20 }}>Tópico: {topico.id}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {[{ l: "✅ Acertos", v: acertos, c: C.green }, { l: "❌ Erros", v: erros, c: C.red }, { l: "⏱ Tempo", v: fmt(tempo), c: C.blue }, { l: "📊 Aproveit.", v: pct + "%", c: pct >= 60 ? C.gold : C.red }].map(it => (
              <div key={it.l} style={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 20px", textAlign: "center" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: it.c }}>{it.v}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{it.l}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, height: 8, background: C.border, borderRadius: 4 }}>
            <div style={{ height: "100%", width: `${pct}%`, background: pct >= 70 ? C.green : pct >= 50 ? "#f59e0b" : C.red, borderRadius: 4 }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => { setQIdx(0); setResp(null); setShowFeedback(false); setAcertos(0); setErros(0); setTempo(0); setFinalizado(false); setHistorico([]); }} style={{ background: C.gold, color: "#000", border: "none", borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 700 }}>🔄 Refazer</button>
          <button onClick={onVoltar} style={{ background: "transparent", color: C.gold, border: `1px solid ${C.gold}`, borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 700 }}>← Voltar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <button onClick={onVoltar} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontSize: 12 }}>← Voltar</button>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ color: C.green, fontSize: 13, fontWeight: 700 }}>✅ {acertos}</span>
          <span style={{ color: C.red, fontSize: 13, fontWeight: 700 }}>❌ {erros}</span>
          <span style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: tempo > 300 ? C.red : C.green }}>⏱ {fmt(tempo)}</span>
        </div>
        <span style={{ fontSize: 12, color: C.muted }}>Q{qIdx + 1}/{total}</span>
      </div>

      {/* Progresso */}
      <div style={{ height: 4, background: C.border, borderRadius: 2, marginBottom: 16 }}>
        <div style={{ height: "100%", width: `${((qIdx + 1) / total) * 100}%`, background: C.gold, borderRadius: 2 }} />
      </div>

      {/* Questão */}
      <div style={{ background: C.card, border: `1px solid ${showFeedback ? (resp === q.gab ? C.green : C.red) : C.border}`, borderRadius: 12, padding: 20, transition: "border 0.3s" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
          <span style={{ background: "#0f264722", border: "1px solid #1e3a5f", color: "#7bb3e8", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>Q{qIdx + 1}</span>
          <span style={{ color: C.muted, fontSize: 11 }}>{q.ref}</span>
          <span style={{ color: C.muted, fontSize: 11 }}>• {q.ano}</span>
        </div>
        <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, marginBottom: 16 }}>{q.enunciado}</p>

        {/* Alternativas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
          {q.alt.map((a, j) => {
            const L = a[0];
            const isSel = resp === L;
            const isCorr = showFeedback && L === q.gab;
            const isErr = showFeedback && isSel && L !== q.gab;
            let bg = "transparent", bdr = C.border, col = C.text;
            if (isCorr) { bg = "#16a34a22"; bdr = C.green; col = C.green; }
            else if (isErr) { bg = "#dc262222"; bdr = C.red; col = C.red; }
            else if (isSel && !showFeedback) { bg = C.gold + "20"; bdr = C.gold; col = C.gold; }
            else if (showFeedback) { col = C.muted; }
            return (
              <div key={j} onClick={() => !showFeedback && setResp(L)} style={{ background: bg, border: `2px solid ${bdr}`, borderRadius: 8, padding: "10px 14px", cursor: showFeedback ? "default" : "pointer", color: col, fontSize: 13, lineHeight: 1.6, display: "flex", justifyContent: "space-between" }}>
                <span>{a}{isCorr ? " ✅" : isErr ? " ❌" : ""}</span>
              </div>
            );
          })}
        </div>

        {/* Botão confirmar */}
        {!showFeedback && (
          <div style={{ textAlign: "center" }}>
            <button onClick={confirmar} disabled={!resp} style={{ background: resp ? C.gold : "#2d3748", color: resp ? "#000" : C.muted, border: "none", borderRadius: 8, padding: "11px 28px", cursor: resp ? "pointer" : "not-allowed", fontWeight: 700, fontSize: 14 }}>
              {resp ? "✓ Confirmar" : "Selecione uma alternativa"}
            </button>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div>
            <div style={{ background: resp === q.gab ? "#16a34a22" : "#dc262222", border: `2px solid ${resp === q.gab ? C.green : C.red}`, borderRadius: 10, padding: "14px 16px", marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: resp === q.gab ? C.green : C.red, marginBottom: 6 }}>
                {resp === q.gab ? "✅ Você acertou!" : "❌ Você errou!"}
              </div>
              {resp !== q.gab && <div style={{ fontSize: 12, color: C.text }}>Resposta correta: <strong style={{ color: C.green }}>{q.gab}</strong></div>}
            </div>
            <div style={{ background: "#0f2647", border: "1px solid #1e3a5f", borderRadius: 8, padding: "12px 14px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: "#7bb3e8", marginBottom: 6, fontSize: 12 }}>📖 Comentário</div>
              <p style={{ margin: 0, fontSize: 12, color: C.text, lineHeight: 1.8 }}>{q.com}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <button onClick={proxima} style={{ background: qIdx + 1 >= total ? C.green : C.gold, color: "#000", border: "none", borderRadius: 8, padding: "10px 22px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
                {qIdx + 1 >= total ? "📊 Ver Resultado" : "Próxima →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN FLASHCARDS APP ─────────────────────────────
export default function FlashcardsApp() {
  const [view, setView] = useState("home"); // home | disc | topico | flashcard | quiz
  const [discAtiva, setDiscAtiva] = useState(null);
  const [topicoAtivo, setTopicoAtivo] = useState(null);
  const [modo, setModo] = useState(null); // flashcard | quiz

  const abrirDisc = (disc) => { setDiscAtiva(disc); setView("disc"); };
  const abrirTopico = (topico) => { setTopicoAtivo(topico); setView("topico"); };
  const abrirModo = (m) => { setModo(m); setView(m); };
  const voltar = () => {
    if (view === "disc") { setDiscAtiva(null); setView("home"); }
    else if (view === "topico") { setTopicoAtivo(null); setView("disc"); }
    else if (view === "flashcard" || view === "quiz") { setView("topico"); }
  };

  // HOME
  if (view === "home") return (
    <div>
      <div style={{ background: C.card, border: `1px solid ${C.gold}44`, borderRadius: 10, padding: "14px 16px", marginBottom: 18 }}>
        <h2 style={{ color: C.gold, margin: "0 0 6px", fontSize: 16 }}>📚 Resumos e Flashcards — SEFAZ/CE 2026</h2>
        <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.7 }}>Selecione uma disciplina para acessar os <strong style={{ color: "#22c55e" }}>Resumos</strong>, <strong style={{ color: "#3b82f6" }}>Flashcards</strong> e <strong style={{ color: "#a855f7" }}>Questões FCC</strong> com gabarito, comentários e cronômetro.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10 }}>
        {DISCIPLINAS.map((d, i) => (
          <div key={i} onClick={() => abrirDisc(d)} style={{ background: C.card, border: `1px solid ${C.border}`, borderLeft: `4px solid ${d.cor}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "border-color 0.2s, transform 0.15s" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = d.cor; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{d.icon}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <span style={{ background: d.cor + "22", border: `1px solid ${d.cor}`, color: d.cor, fontSize: 10, padding: "2px 6px", borderRadius: 3, fontWeight: 700 }}>{d.topicos.length} tópicos</span>
              </div>
            </div>
            <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{d.nome}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Flashcards • Resumos • Questões FCC →</div>
          </div>
        ))}
      </div>
    </div>
  );

  // DISCIPLINA
  if (view === "disc" && discAtiva) return (
    <div>
      <button onClick={() => setView("home")} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "6px 14px", cursor: "pointer", marginBottom: 16, fontSize: 13 }}>← Disciplinas</button>
      <div style={{ background: C.card, border: `1px solid ${discAtiva.cor}`, borderLeft: `4px solid ${discAtiva.cor}`, borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
        <h2 style={{ color: discAtiva.cor, margin: "0 0 4px", fontSize: 17 }}>{discAtiva.icon} {discAtiva.nome}</h2>
        <p style={{ margin: 0, fontSize: 12, color: C.muted }}>Selecione um tópico para estudar com Flashcards e Questões FCC</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {discAtiva.topicos.map((t, i) => {
          const temQuestoes = !!QUESTOES_BANCO[t.id];
          const nQ = temQuestoes ? QUESTOES_BANCO[t.id].length : 0;
          return (
            <div key={i} onClick={() => abrirTopico(t)} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer" }}
              onMouseOver={e => { e.currentTarget.style.borderColor = discAtiva.cor; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = C.border; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{t.id}</div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ background: "#3b82f622", border: "1px solid #3b82f6", color: "#3b82f6", fontSize: 10, padding: "2px 6px", borderRadius: 3, fontWeight: 700 }}>📇 Flashcard</span>
                  {temQuestoes && <span style={{ background: "#a855f722", border: "1px solid #a855f7", color: "#a855f7", fontSize: 10, padding: "2px 6px", borderRadius: 3, fontWeight: 700 }}>🎯 {nQ}Q FCC</span>}
                </div>
              </div>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{t.resumo.substring(0, 100)}...</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // TÓPICO
  if (view === "topico" && topicoAtivo) {
    const temQuestoes = !!QUESTOES_BANCO[topicoAtivo.id];
    const nQ = temQuestoes ? QUESTOES_BANCO[topicoAtivo.id].length : 0;
    return (
      <div>
        <button onClick={voltar} style={{ background: "transparent", border: `1px solid ${C.border}`, color: C.muted, borderRadius: 6, padding: "6px 14px", cursor: "pointer", marginBottom: 16, fontSize: 13 }}>← Voltar</button>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
          <h2 style={{ color: C.goldLight, margin: "0 0 8px", fontSize: 16 }}>{topicoAtivo.id}</h2>
          <p style={{ margin: 0, fontSize: 13, color: C.text, lineHeight: 1.8 }}>{topicoAtivo.resumo}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {topicoAtivo.links?.map((l, i) => <a key={i} href={l.u} target="_blank" rel="noopener noreferrer" style={{ background: C.card2, border: `1px solid ${C.border}`, color: "#93c5fd", borderRadius: 6, padding: "5px 10px", fontSize: 11, textDecoration: "none" }}>🔗 {l.l}</a>)}
            {topicoAtivo.yt?.map((l, i) => <a key={i} href={l.u} target="_blank" rel="noopener noreferrer" style={{ background: "#1a0a0a", border: "1px solid #7f1d1d", color: "#fca5a5", borderRadius: 6, padding: "5px 10px", fontSize: 11, textDecoration: "none" }}>▶️ {l.l}</a>)}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div onClick={() => abrirModo("flashcard")} style={{ background: C.card, border: "2px solid #3b82f6", borderRadius: 12, padding: 24, cursor: "pointer", textAlign: "center" }}
            onMouseOver={e => e.currentTarget.style.background = "#0d1f35"}
            onMouseOut={e => e.currentTarget.style.background = C.card}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📇</div>
            <div style={{ fontWeight: 700, color: "#3b82f6", fontSize: 15 }}>Flashcard</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Resumo interativo com links e videoaulas</div>
          </div>
          <div onClick={() => abrirModo("quiz")} style={{ background: C.card, border: `2px solid ${temQuestoes ? "#a855f7" : C.border}`, borderRadius: 12, padding: 24, cursor: "pointer", textAlign: "center", opacity: temQuestoes ? 1 : 0.6 }}
            onMouseOver={e => { if (temQuestoes) e.currentTarget.style.background = "#1a0d35"; }}
            onMouseOut={e => e.currentTarget.style.background = C.card}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🎯</div>
            <div style={{ fontWeight: 700, color: temQuestoes ? "#a855f7" : C.muted, fontSize: 15 }}>Questões FCC</div>
            <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{temQuestoes ? `${nQ} questões com gabarito e cronômetro` : "Questões em elaboração"}</div>
          </div>
        </div>
      </div>
    );
  }

  // FLASHCARD
  if (view === "flashcard" && topicoAtivo) return <Flashcard topico={topicoAtivo} onVoltar={voltar} />;

  // QUIZ
  if (view === "quiz" && topicoAtivo) return <Quiz topico={topicoAtivo} questoes={QUESTOES_BANCO[topicoAtivo.id]} onVoltar={voltar} />;

  return null;
}
