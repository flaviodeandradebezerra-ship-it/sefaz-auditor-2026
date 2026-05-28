import { useState, useEffect, useRef } from "react";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035",
  border:"#1b2c44", gold:"#c8a951", goldL:"#f0d080",
  red:"#ef4444", green:"#22c55e", blue:"#3b82f6",
  purple:"#a855f7", text:"#e2e8f0", muted:"#64748b",
};

// Armazena resumos como arrays de strings (sem template literals multi-linha)
const R = {
  "LP-1": [
    "CONCORDANCIA VERBAL - Casos especiais da FCC:",
    "* HAVER (existir), FAZER (tempo), SER (hora/data) = IMPESSOAL (sempre singular)",
    "  Correto: Houve irregularidades (NUNCA houveram)",
    "  Correto: Faz 10 anos que... (NUNCA fazem)",
    "* MAIORIA DE + plural = singular (padrao FCC)",
    "  Correto: A maioria dos auditores aprovou",
    "* Sujeito composto posposto = singular com o mais proximo",
    "",
    "REGENCIA VERBAL - Os que a FCC mais cobra:",
    "* Aspirar (almejar) = rege A: aspirava AO cargo",
    "* Visar (objetivar) = rege A: visando A evitar",
    "* Assistir (ver) = rege A: assistiu AO julgamento",
    "* Preferir = nunca 'do que': prefere A ou em relacao a",
    "* Informar = informou SOBRE o credito (nao 'informou do')",
    "",
    "CRASE:",
    "* OBRIGATORIA antes de substantivos femininos com preposicao A",
    "  Correto: Encaminhou a Receita Federal",
    "* PROIBIDA antes de masculinos, verbos, pronomes pessoais, 'uma'",
    "  Errado: Entregou a ele (pronome pessoal)",
    "* FACULTATIVA antes de pronomes possessivos femininos (a sua, a minha)",
    "",
    "DICA FCC: Quando ver HAVER ou FAZER em concordancia, suspeite.",
    "A resposta provavelmente envolve o uso impessoal.",
  ],
  "LP-2": [
    "INTERPRETACAO DE TEXTO - Representa 22% das questoes de Portugues:",
    "* FCC pede INFERENCIA: o que o texto permite concluir (nao apenas o explicito)",
    "* Cuidado com alternativas que exageram ou generalizam",
    "",
    "COESAO TEXTUAL:",
    "* REFERENCIAL: pronomes, sinonimos, hiperonimos que retomam elementos",
    "  Ex: O auditor lavrou o auto. Ele (=auditor) o assinou.",
    "* SEQUENCIAL: conectivos logicos entre oracoes",
    "  - Causa: porque, pois, visto que",
    "  - Concessao: embora, ainda que, apesar de",
    "  - Condicao: se, caso, desde que",
    "  - Oposicao: mas, porem, ao passo que, contudo",
    "  - Finalidade: para que, a fim de que",
    "",
    "PONTUACAO:",
    "* Oracao relativa EXPLICATIVA = sempre entre virgulas",
    "  Correto: O ICMS, que e imposto estadual, incide sobre mercadorias.",
    "* NUNCA virgula entre sujeito e verbo",
    "",
    "DICA FCC: Questoes de interpretacao pedem o que o texto PERMITE",
    "concluir, nao o que esta explicitamente dito.",
  ],
  "MAT-1": [
    "JUROS COMPOSTOS: M = C x (1+i)^n",
    "* Rendimento exponencial (juros sobre juros)",
    "* FCC sempre fornece o fator: Ex: 1,02^3 = 1,0612",
    "* Ex: C=10.000 x 1,0612 = M=10.612",
    "",
    "JUROS SIMPLES: J = C x i x n | M = C x (1+i x n)",
    "* Rendimento linear (mesma quantia a cada periodo)",
    "* Ex: C=10.000, i=2%a.m., n=3 -> J=600 -> M=10.600",
    "",
    "SISTEMA SAC (Amortizacao Constante):",
    "* Amortizacao = PV dividido por n (CONSTANTE)",
    "* Juros = saldo devedor x i (DECRESCENTES)",
    "* Prestacao = amortizacao + juros (DECRESCENTE)",
    "Ex com PV=60.000, n=3, i=10%:",
    "  1a: J=6.000 + A=20.000 = R$ 26.000 (SD=40.000)",
    "  2a: J=4.000 + A=20.000 = R$ 24.000 (SD=20.000)",
    "  3a: J=2.000 + A=20.000 = R$ 22.000",
    "",
    "SISTEMA PRICE (Frances):",
    "* Prestacoes CONSTANTES",
    "* Juros decrescentes + amortizacao crescente",
    "* Custo total MAIOR que o SAC",
    "",
    "DICA FCC: Em SAC, monte a tabela linha por linha.",
    "Em juros compostos, use sempre o fator fornecido.",
  ],
  "MAT-2": [
    "MEDIDAS DE POSICAO:",
    "* MEDIA ARITMETICA: soma dividido por n",
    "* MEDIANA: valor central apos ORDENAR os dados",
    "  - n impar = posicao (n+1)/2",
    "  - n par = media das posicoes n/2 e n/2+1",
    "* MODA: valor que MAIS APARECE",
    "",
    "MEDIDAS DE DISPERSAO:",
    "* AMPLITUDE: maximo - minimo",
    "* DESVIO-PADRAO: raiz quadrada da variancia",
    "",
    "PROBABILIDADE:",
    "* P(A) = casos favoraveis / casos possiveis",
    "* P(A ou B) = P(A) + P(B) - P(A e B)",
    "* Complementar: P(A') = 1 - P(A)",
    "",
    "LOGICA PROPOSICIONAL:",
    "* MODUS PONENS: P->Q, P logo Q",
    "* MODUS TOLLENS: P->Q, nao-Q logo nao-P (mais cobrado!)",
    "* SILOGISMO: P->Q, Q->R logo P->R",
    "* De Morgan: nao(P e Q) = nao-P ou nao-Q",
    "",
    "DICA FCC: Questao de mediana? SEMPRE ordene antes.",
    "Confundir mediana com media e o erro mais comum.",
  ],
  "ADM-1": [
    "MODELO DAS 3 LINHAS (IIA 2020):",
    "* 1a LINHA: gestao operacional (donos do risco no dia a dia)",
    "* 2a LINHA: compliance, gestao de riscos, controles internos",
    "* 3a LINHA: AUDITORIA INTERNA (asseguracao INDEPENDENTE)",
    "* ACIMA: orgaos de governanca e partes externas (TCU, auditores externos)",
    "",
    "INTEGRIDADE PUBLICA (CE):",
    "* Programa de Integridade do CE: prevenir, detectar e remediar fraudes",
    "* Codigo de Etica e Conduta da Adm. Publica Estadual",
    "* Assedio moral: Convencao OIT 190/2019",
    "",
    "GESTAO DE RISCOS:",
    "* Processo: identificacao -> analise -> avaliacao -> tratamento",
    "* Tratamento: evitar, reduzir, transferir ou aceitar",
    "",
    "IMPROBIDADE (Lei 14.230/2021):",
    "* Exige DOLO ESPECIFICO (culpa foi excluida)",
    "* Legitimidade ativa: EXCLUSIVA do MP",
    "* Prescricao: 8 anos do fato ou 4 anos apos fim do vinculo",
    "",
    "DICA FCC: Saiba distinguir os papeis das 3 linhas.",
    "Auditoria interna (3a linha) vs gestao de riscos (2a linha).",
  ],
  "ADM-2": [
    "NOVA LEI DE LICITACOES (Lei 14.133/2021) - Modalidades:",
    "* CONCORRENCIA: obras acima R$3,3M, outros acima R$1,43M",
    "* PREGAO: bens e servicos comuns (menor preco)",
    "* DIALOGO COMPETITIVO: inovacao tecnologica ou solucao",
    "  inexistente no mercado em condicoes otimas",
    "  -> Adm. DIALOGA com licitantes ANTES de definir o objeto",
    "* CONCURSO: trabalho tecnico/artistico",
    "* LEILAO: bens imoveis, alienacao",
    "",
    "LEI DE ACESSO A INFORMACAO (Lei 12.527/2011):",
    "* Prazo: 20 dias corridos + 10 dias (com justificativa)",
    "* Sigilo: Reservado=5 anos, Secreto=15 anos, Ultra-secreto=25 anos",
    "* Transparencia ATIVA: publicar proativamente",
    "* Transparencia PASSIVA: responder pedidos",
    "",
    "PRINCIPIOS art. 37 CF - LIMPE:",
    "L-egalidade | I-mpessoalidade | M-oralidade | P-ublicidade | E-ficiencia",
    "",
    "DICA FCC: Dialogo competitivo e a modalidade mais cobrada",
    "da Nova Lei desde 2022. Saiba os 3 criterios de cabimento.",
  ],
  "ECO-1": [
    "ELASTICIDADES:",
    "* ELASTICA: |Ed| > 1 -> quantidade varia MAIS que o preco",
    "* INELASTICA: |Ed| < 1 -> quantidade varia MENOS que o preco",
    "  Ex: |Ed|=0,3 -> aumento de preco AUMENTA a receita total",
    "* Determinantes: substitutos, necessidade, prazo, % do orcamento",
    "",
    "TRIBUTACAO E EFICIENCIA:",
    "* PESO MORTO: perda de bem-estar (maior quanto mais elasticos os lados)",
    "* REGRA DE RAMSEY: aliquota inversamente proporcional a elasticidade",
    "  -> Tributar mais bens INELASTICOS minimiza perda de bem-estar",
    "* CURVA DE LAFFER: aliquota 0% = arrecadacao 0;",
    "  aliquota 100% = arrecadacao 0 (ninguem declara/trabalha)",
    "  Ponto OTIMO entre os extremos",
    "* INCIDENCIA ECONOMICA: recai mais sobre o lado MENOS elastico",
    "",
    "ESTRUTURAS DE MERCADO:",
    "* Concorrencia Perfeita: muitos, produto homogeneo, lucro zero no LP",
    "* Monopolio: um ofertante, poder de preco",
    "* Oligopolio: poucos, interdependencia estrategica",
    "",
    "DICA FCC: Ramsey conflita com equidade pois bens inelasticos",
    "sao geralmente essenciais (mais consumidos pelos pobres).",
  ],
  "ECO-2": [
    "PIB PELA OTICA DA DEMANDA: C + I + G + (X - M)",
    "* C = consumo das familias",
    "* I = investimento (FBCF + variacao de estoques)",
    "* G = gastos do governo",
    "* (X-M) = exportacoes liquidas (saldo comercial)",
    "",
    "TRES OTICAS DO PIB (todas dao o mesmo resultado):",
    "* DEMANDA: C + I + G + (X-M)",
    "* RENDA: Salarios + Lucros + Juros + Alugueis + Tributos",
    "* PRODUCAO: Soma dos Valores Adicionados por setor",
    "",
    "MODELO IS-LM:",
    "* IS (mercado de bens): juros altos -> investimento cai -> PIB cai",
    "  Politica FISCAL (aumento G) desloca IS para direita",
    "* LM (mercado monetario): politica MONETARIA desloca LM",
    "",
    "INFLACAO:",
    "* IPCA: indice oficial (IBGE), familias 1 a 40 salarios minimos",
    "* Valor REAL = valor nominal / (1 + inflacao)",
    "",
    "DICA FCC: O multiplicador keynesiano = 1 / propensao marginal",
    "a poupar. Politica fiscal expansionista desloca IS para direita.",
  ],
  "DCO-1": [
    "CONTROLE CONCENTRADO (STF - via direta):",
    "* ADI: lei/ato federal ou estadual vs CF",
    "* ADC: lei federal - confirmacao de constitucionalidade",
    "* ADPF: atos que violem preceito fundamental (inclusive leis pre-CF/88)",
    "* ADO: omissao inconstitucional do legislador",
    "* Efeitos: ERGA OMNES + EX TUNC + VINCULANTE",
    "  (para todo Judiciario e Adm. Publica direta e indireta)",
    "",
    "CONTROLE DIFUSO (qualquer juizo - via incidental):",
    "* Qualquer juiz pode afastar a norma inconstitucional",
    "* Efeitos: INTER PARTES + EX TUNC",
    "* Para expandir: Senado suspende (art. 52 X) -> erga omnes + ex nunc",
    "",
    "SUMULA VINCULANTE:",
    "* Aprovada por 2/3 do STF (8 ministros)",
    "* Vincula: todo Judiciario + Adm. Publica direta e indireta",
    "* NAO vincula: o proprio STF e o Legislativo (funcao tipica)",
    "",
    "DIREITOS FUNDAMENTAIS (art. 5 CF):",
    "* Aplicacao IMEDIATA (art. 5 paragrafo 1)",
    "* Clausulas petreas: forma federativa, voto direto, sep. poderes, dir. individuais",
    "",
    "DICA FCC: Difuso = inter partes + ex tunc.",
    "Concentrado = erga omnes + ex tunc + vinculante.",
  ],
  "DAD-1": [
    "PRINCIPIOS EXPRESSOS art. 37 CF - LIMPE:",
    "L-egalidade | I-mpessoalidade | M-oralidade | P-ublicidade | E-ficiencia",
    "Implicitos: razoabilidade, proporcionalidade, autotutela",
    "",
    "ATRIBUTOS DOS ATOS ADMINISTRATIVOS:",
    "* PRESUNCAO DE LEGITIMIDADE: presumem-se legais (relativa)",
    "* IMPERATIVIDADE: impoe obrigacoes independente de concordancia",
    "* AUTOEXECUTORIEDADE: executa sem previa intervencao judicial",
    "",
    "EXTINCAO DOS ATOS:",
    "* ANULACAO: vicio de legalidade -> efeitos EX TUNC (retroativo)",
    "  Pode ser pela propria Adm. (Sumula 473 STF) ou Judiciario",
    "* REVOGACAO: conveniencia e oportunidade -> EX NUNC (prospectivo)",
    "  APENAS pela propria Administracao",
    "* CONVALIDACAO: sana vicio sanavel (competencia, forma nao essencial)",
    "",
    "RESPONSABILIDADE CIVIL DO ESTADO (CF art. 37 paragrafo 6):",
    "* Objetiva (teoria do RISCO ADMINISTRATIVO) para atos COMISSIVOS",
    "* Elementos: conduta + dano + nexo causal (SEM necessidade de culpa)",
    "* Excludentes: fato da vitima, caso fortuito, fato de terceiro",
    "* Direito de REGRESSO contra agente com dolo ou culpa",
    "",
    "DICA FCC: Anulacao (ilegalidade, ex tunc) vs Revogacao",
    "(merito, ex nunc). Responsabilidade objetiva nao exige culpa.",
  ],
  "DCI-1": [
    "CRIMES CONTRA ORDEM TRIBUTARIA (Lei 8.137/1990):",
    "* Art. 1 (PARTICULAR): crimes MATERIAIS",
    "  -> SUMULA VINCULANTE 24: so se tipifica APOS lançamento DEFINITIVO",
    "* Art. 2: crimes FORMAIS (consumam com a conduta)",
    "* Mero inadimplemento NAO e crime (apenas civil/administrativo)",
    "",
    "LAVAGEM DE DINHEIRO (Lei 9.613/1998):",
    "* Ocultar ou dissimular origem de bens de INFRACAO PENAL",
    "* Modelo ALL CRIMES (Lei 12.683/2012): qualquer crime ou contravencao",
    "* 3 fases: Colocacao -> Dissimulacao -> Integracao",
    "* Pena: 3 a 10 anos + multa",
    "",
    "LEI ANTICORRUPCAO (Lei 12.846/2013):",
    "* Responsabilidade OBJETIVA das PESSOAS JURIDICAS",
    "* Atos lesivos a administracao nacional ou ESTRANGEIRA",
    "* Acordo de Leniencia: reduz sancoes em troca de colaboracao",
    "",
    "DIREITO CIVIL - PRESCRICAO vs DECADENCIA:",
    "* PRESCRICAO: extingue a PRETENSAO (direito de acao). Pode ser renunciada.",
    "* DECADENCIA: extingue o proprio DIREITO potestativo. Legal = irrenunciavel.",
    "",
    "DICA FCC: SV 24 e o ponto mais cobrado de crimes tributarios.",
    "Art. 1 (materiais) exige lancamento definitivo; art. 2 (formais), nao.",
  ],
  "DFI-1": [
    "LIMITES DE DESPESAS COM PESSOAL (% da RCL):",
    "               GLOBAL    EXECUTIVO",
    "* ESTADOS:      60%        49%  (Leg+TC=3%, Jud=6%, MP=2%)",
    "* UNIAO:        50%        40,9%",
    "* MUNICIPIOS:   60%        54%  (Camara=6%)",
    "",
    "MECANISMOS DE CONTROLE:",
    "* Art. 9 - LIMITACAO DE EMPENHO (contingenciamento):",
    "  Acionado BIMESTRALMENTE quando receita nao comporta metas",
    "  Nao se aplica a despesas constitucionalmente obrigatorias",
    "* Art. 42 - VEDACAO 2 ultimos quadrimestres do mandato:",
    "  Proibido deixar RP sem disponibilidade de caixa",
    "",
    "RESULTADO FISCAL:",
    "* PRIMARIO: receitas nao financeiras - despesas nao financeiras (SEM juros)",
    "  Mede o ESFORCO FISCAL antes do servico da divida",
    "* NOMINAL: Primario - Juros nominais (variacao total da divida)",
    "",
    "RELATORIOS OBRIGATORIOS:",
    "* RREO (Exec. Orcamentaria): BIMESTRAL",
    "* RGF (Gestao Fiscal): QUADRIMESTRAL",
    "",
    "DICA FCC: Estados=60/49; Uniao=50/40,9; Municipios=60/54.",
    "A FCC cobra os TRES com frequencia.",
  ],
  "DFI-2": [
    "CICLO ORCAMENTARIO: PPA -> LDO -> LOA -> Execucao -> Controle",
    "",
    "INSTRUMENTOS:",
    "* PPA (4 anos): diretrizes, objetivos e metas da Administracao",
    "* LDO: orienta LOA + metas fiscais + riscos fiscais",
    "* LOA: autoriza realizacao de receitas e despesas no exercicio",
    "",
    "PRINCIPIOS ORCAMENTARIOS:",
    "* UNIVERSALIDADE: todas as receitas e despesas no orcamento",
    "* ANUALIDADE: vigencia de 1 ano",
    "* UNIDADE: orcamento unico (exceto fiscal, seguridade, EP)",
    "* EXCLUSIVIDADE: LOA nao contem materia estranha",
    "",
    "CREDITOS ADICIONAIS (art. 41 Lei 4.320):",
    "* SUPLEMENTARES: reforco de dotacoes existentes (LOA autoriza)",
    "* ESPECIAIS: novas dotacoes (autorizacao legislativa + fonte)",
    "* EXTRAORDINARIOS: urgentes e improvistos -> DECRETO executivo",
    "  Nao exige indicacao previa de fonte de recursos",
    "",
    "RECEITAS E DESPESAS:",
    "* CORRENTES: tributaria, patrimonial, pessoal, custeio",
    "* CAPITAL: operacoes de credito, alienacao, investimentos",
    "",
    "DICA FCC: Creditos EXTRAORDINARIOS sao os unicos abertos",
    "por decreto sem indicacao previa de fonte. Sempre cobrado!",
  ],
  "CGP-1": [
    "ESTAGIOS DA RECEITA ORCAMENTARIA (MCASP 11a ed.):",
    "1. PREVISAO: constante da LOA",
    "2. LANCAMENTO: individualiza o credito tributario (art. 53 Lei 4.320)",
    "3. ARRECADACAO: pagamento ao agente arrecadador (banco)",
    "4. RECOLHIMENTO: entrega ao Tesouro (conta unica)",
    "",
    "ESTAGIOS DA DESPESA:",
    "1. FIXACAO: dotacao na LOA",
    "2. EMPENHO (art. 58): cria obrigacao de pagar",
    "   Modalidades: ORDINARIO, ESTIMATIVO, GLOBAL",
    "3. LIQUIDACAO (art. 63): verifica direito do credor",
    "4. PAGAMENTO (art. 64): entrega ao credor",
    "",
    "RESTOS A PAGAR:",
    "* PROCESSADOS: empenho + LIQUIDACAO realizados (Estado DEVE pagar)",
    "* NAO PROCESSADOS: apenas empenho (liquidacao pendente)",
    "* Cancelamento: apos 2 exercicios (regra geral)",
    "",
    "NBC TSP - CARACTERISTICAS QUALITATIVAS:",
    "* FUNDAMENTAIS: Relevancia + Representacao Fidedigna",
    "* DE MELHORIA: Comparabilidade, Verificabilidade, Tempestividade",
    "",
    "DICA FCC: RP PROCESSADOS (ja liquidados = Estado deve) vs",
    "NAO PROCESSADOS (liquidacao pendente). Cai em toda prova!",
  ],
  "CGP-2": [
    "ESTOQUES (CPC 16):",
    "* Custo: aquisicao + transformacao + outros necessarios",
    "* PEPS (Primeiro a Entrar, Primeiro a Sair):",
    "  Estoque final valorado a precos mais RECENTES",
    "* MPM (Media Ponderada Movel): recalcula a cada entrada",
    "* CMV = Estoque inicial + Compras - Estoque final",
    "",
    "ATIVO IMOBILIZADO (CPC 27):",
    "* Depreciacao: alocacao sistematica do custo ao longo da vida util",
    "* Metodos: Linha Reta, Saldos Decrescentes, Unidades de Producao",
    "* Impairment: testar recuperabilidade quando houver indicativo",
    "",
    "DEMONSTRACOES CONTABEIS:",
    "* BP (Balanco Patrimonial): Ativo = Passivo + PL",
    "* DRE: Receitas - Despesas = Lucro/Prejuizo",
    "* DFC: fluxos de caixa (operacional, investimento, financiamento)",
    "* DMPL: mutacoes do patrimonio liquido",
    "* DVA: riqueza gerada e distribuicao",
    "",
    "PROVISOES (CPC 25):",
    "* Reconhecer quando: obrigacao presente + saida provavel + estimativa",
    "* Contingencia possivel: so notas explicativas",
    "* Contingencia remota: nada",
    "",
    "DICA FCC: PEPS = estoque final a precos recentes (mais caro em",
    "inflacao). MPM = media ponderada das entradas.",
  ],
  "COA-1": [
    "VALOR JUSTO - CPC 46 / IFRS 13 - Hierarquia:",
    "* NIVEL 1: precos cotados em mercados ATIVOS para ativos IDENTICOS",
    "  (maior confiabilidade)",
    "* NIVEL 2: dados OBSERVAVEIS distintos do nivel 1",
    "  (ativos similares, taxas de mercado)",
    "* NIVEL 3: dados NAO OBSERVAVEIS / premissas internas",
    "  (menor confiabilidade, mais disclosure exigido)",
    "Regra: MAXIMIZAR uso de dados observaveis",
    "",
    "ARRENDAMENTO - CPC 06 R2 / IFRS 16:",
    "* Arrendatario reconhece (exceto prazo <= 12m e baixo valor):",
    "  - ATIVO DE DIREITO DE USO",
    "  - PASSIVO DE ARRENDAMENTO (VP dos pagamentos futuros)",
    "* Extingue distincao operacional vs financeiro para arrendatario",
    "",
    "COMBINACOES DE NEGOCIOS - CPC 15 / IFRS 3:",
    "Goodwill = Contraprestacao + PNC + Interesse previo - VJ liquido ativos",
    "* Positivo: GOODWILL (intangivel, nao amortizavel, impairment anual)",
    "* Negativo: COMPRA VANTAJOSA (reconhecida no RESULTADO imediatamente)",
    "",
    "MEP - CPC 18: Coligadas >= 20% votante e Controladas",
    "* Investimento atualizado pelo % participacao no PL da investida",
    "",
    "DICA FCC: Goodwill formula: Contraprestacao + PNC + Interesse",
    "previo - VJ liquido. Positivo = goodwill; negativo = lucro.",
  ],
  "COA-2": [
    "CLASSIFICACOES DE CUSTOS:",
    "* DIRETOS vs INDIRETOS: identificaveis ou nao ao produto",
    "* FIXOS vs VARIAVEIS: nao variam vs variam com a producao",
    "  Custo fixo UNITARIO diminui com mais producao (diluicao)",
    "  Custo variavel TOTAL aumenta, mas unitario e constante",
    "",
    "MARGEM DE CONTRIBUICAO:",
    "MC unitaria = PV - CVu (Preco - Custo Variavel unitario)",
    "Indice de MC (%) = MC / PV x 100",
    "",
    "PONTOS DE EQUILIBRIO:",
    "* PEC (Contabil): CF / MCu",
    "  Cobre custos contabeis (inclui depreciacao)",
    "* PEE (Economico): (CF + Custo Oportunidade) / MCu",
    "* PEF (Financeiro): (CF - Depreciacao) / MCu",
    "  Cobre apenas saidas de caixa",
    "",
    "METODOS DE CUSTEIO:",
    "* ABSORCAO: rateia TODOS os custos. Exigido pelo fisco.",
    "* VARIAVEL (Direto): apenas custos variaveis nos produtos.",
    "  Melhor para decisao gerencial.",
    "* ABC: custos por ATIVIDADES. Maior precisao.",
    "",
    "DICA FCC: PEC = CF/MCu. Questao favorita: dar CF, PV e CVu",
    "e pedir as 3 modalidades. PEF subtrai depreciacao no CF.",
  ],
  "DTR-1": [
    "OBRIGACAO TRIBUTARIA (arts. 113-138 CTN):",
    "* PRINCIPAL: pagar TRIBUTO ou PENALIDADE",
    "* ACESSORIA: fazer, nao fazer ou tolerar",
    "  Descumprimento converte-se em PRINCIPAL",
    "* Fato Gerador: situacao NECESSARIA E SUFICIENTE prevista em lei",
    "* Solidariedade: NAO comporta beneficio de ordem (art. 124 PU)",
    "",
    "LANCAMENTO - Modalidades:",
    "* DE OFICIO: Fisco age sozinho (IPTU, IPVA)",
    "* POR DECLARACAO: contribuinte declara, Fisco lanca",
    "* POR HOMOLOGACAO: contribuinte antecipa pagamento SEM previo exame",
    "  Prazo homologacao tacita: 5 anos do FG (art. 150 par. 4)",
    "",
    "SUSPENSAO (art. 151 CTN) - MDRRLP:",
    "Moratoria | Deposito integral | Reclamacoes/Recursos |",
    "Liminar/Tutela antecipada | Parcelamento",
    "",
    "EXTINCAO (art. 156 CTN) - 11 modalidades:",
    "Pagamento | Compensacao | Transacao | Remissao |",
    "Prescricao | Decadencia | (+6 outras)",
    "",
    "EXCLUSAO: ISENCAO (exclui tributo) e ANISTIA (exclui multa)",
    "",
    "DICA FCC: Saber diferenciar SUSPENSAO (MDRRLP),",
    "EXTINCAO (art. 156) e EXCLUSAO (isencao e anistia).",
  ],
  "DTR-2": [
    "REFORMA TRIBUTARIA - EC 132/2023 + LC 214/2025:",
    "",
    "IBS (Imposto sobre Bens e Servicos):",
    "* Substitui: ICMS + ISS",
    "* Competencia: COMPARTILHADA (Estados/DF/Municipios)",
    "* Administracao: COMITE GESTOR do IBS (art. 156-B CF)",
    "* Nao-cumulatividade PLENA",
    "* Principio do DESTINO: imposto due no LOCAL DE CONSUMO",
    "* Aliquota: uniforme, cada ente define a propria",
    "",
    "CBS (Contribuicao sobre Bens e Servicos):",
    "* Substitui: PIS + COFINS",
    "* Competencia: FEDERAL (Uniao)",
    "* Administracao: Receita Federal",
    "",
    "IS (Imposto Seletivo):",
    "* Art. 153, VIII CF: bens/servicos PREJUDICIAIS a saude/meio ambiente",
    "* Competencia: FEDERAL (Uniao)",
    "* NAO integra base de calculo do IBS e CBS",
    "",
    "TRANSICAO: 2026 (0,1% teste) -> 2027-2028 -> ... -> 2033 (completo)",
    "",
    "DICA FCC: IBS (estados/municipios, Comite Gestor) vs CBS",
    "(federal, Receita Federal). Principio do destino = consumo.",
  ],
  "DTR-3": [
    "LC 87/1996 - LEI KANDIR (ICMS Nacional):",
    "* NAO-CUMULATIVIDADE: credito do ICMS pago nas etapas anteriores",
    "* Isencao/nao-incidencia: NAO gera credito (salvo disposicao contraria)",
    "* ATIVO PERMANENTE: credito a razao de 1/48 por mes (4 anos)",
    "* USO E CONSUMO: credito VEDADO ate 2033 (art. 33)",
    "",
    "LC 24/1975 - CONFAZ E CONVENIOS:",
    "* Beneficios fiscais ICMS: exigem CONVENIO CONFAZ",
    "* Aprovacao: UNANIMIDADE dos estados e DF PRESENTES",
    "  (minimo 4/5 dos estados). Um estado pode VETAR.",
    "* LC 160/2017: remissao de beneficios sem convenio (guerra fiscal)",
    "",
    "LC 123/2006 - SIMPLES NACIONAL:",
    "* MEI (ate R$ 81k/ano), ME (ate R$ 360k), EPP (ate R$ 4,8M)",
    "* DAS: guia unica reunindo tributos",
    "* ATENCAO: ICMS-ST NAO entra no DAS (recolhido separadamente)",
    "",
    "LC 116/2003 - ISSQN:",
    "* ISS: competencia MUNICIPAL",
    "* Conflito ICMS x ISS: lista anexa da LC 116 define o que e ISS",
    "",
    "DICA FCC: Convenio CONFAZ = UNANIMIDADE.",
    "ICMS-ST fora do DAS = questao classica do Simples Nacional.",
  ],
  "LTE-1": [
    "ICMS-CE (Lei 18.665/2023 + Dec. 33.327/2019 RICMS):",
    "",
    "ICMS POR DENTRO (calculo interno):",
    "* O ICMS integra sua propria base de calculo",
    "* Formula: BC = valor sem ICMS / (1 - aliquota)",
    "* Ex: produto R$ 82, aliquota 18%:",
    "  BC = 82 / 0,82 = R$ 100 -> ICMS = R$ 18",
    "  Aliquota real = 18/82 = 21,95% (maior que 18% nominal)",
    "",
    "SUBSTITUICAO TRIBUTARIA NO CE:",
    "* PROGRESSIVA: fabricante/importador recolhe ICMS das etapas futuras",
    "  Base: MVA (Margem de Valor Agregado) ou pauta fiscal",
    "  Se FG presumido NAO ocorrer: DIREITO A RESTITUICAO (STF RE 593.849)",
    "* REGRESSIVA (diferimento): postergacao para etapa posterior",
    "",
    "NAO-CUMULATIVIDADE NO CE:",
    "* Uso e consumo: VEDADO ate 2033",
    "* Ativo permanente: 1/48 por mes",
    "",
    "OUTROS TRIBUTOS ESTADUAIS DO CE:",
    "* ITCD (Lei 15.812/2015): causa mortis + doacao, aliquotas progressivas",
    "* IPVA (Lei 12.023/1992): propriedade de veiculo em 1 de janeiro",
    "* FECOP (LC 37/2003): adicional ICMS ate 2% sobre produtos superfluos",
    "",
    "DICA FCC: ICMS-CE segue LC 87/96 como norma nacional.",
    "Questoes verificam se voce aplica a lei nacional ao CE.",
  ],
  "FLD-1": [
    "SQL - ORDEM DE EXECUCAO:",
    "FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY",
    "",
    "WHERE vs HAVING:",
    "* WHERE: filtra LINHAS antes do agrupamento (sem funcoes de agregacao)",
    "* HAVING: filtra GRUPOS apos GROUP BY (usa SUM, COUNT, AVG, MAX, MIN)",
    "",
    "TIPOS DE JOIN:",
    "* INNER JOIN: apenas registros com correspondencia em AMBAS as tabelas",
    "* LEFT JOIN: TODOS da esquerda + correspondentes da direita (NULL se nao)",
    "* RIGHT JOIN: inverso do LEFT",
    "* FULL OUTER JOIN: todos de ambas (NULLs onde nao ha correspondencia)",
    "* CROSS JOIN: produto cartesiano",
    "",
    "ARQUITETURA DE DADOS:",
    "* Data Warehouse: dados curados, schema-on-write, otimizado para BI",
    "* Data Lake: dados brutos, schema-on-read, barato e flexivel",
    "* Data Lakehouse: DL + transacoes ACID + performance analitica",
    "* Data Mesh: descentralizacao por dominios",
    "",
    "LGPD - Base legal do Fisco: art. 7, II:",
    "'Cumprimento de obrigacao legal ou regulatoria'",
    "ETL: Extract -> Transform -> Load",
    "CRISP-DM: Entendimento negocio -> Dados -> Preparacao -> Modelagem",
    "",
    "DICA FCC: HAVING vs WHERE e a questao mais cobrada de SQL.",
    "HAVING = apos agrupamento, pode usar SUM/COUNT/AVG.",
  ],
  "FPB-1": [
    "FUNCOES DO GOVERNO (Musgrave, 1959):",
    "1. ALOCATIVA: corrigir FALHAS DE MERCADO",
    "   * Bens publicos (nao rival + nao excludente)",
    "   * Externalidades (subsidiar as positivas, tributar as negativas)",
    "   * Monopolios naturais (regulacao)",
    "2. DISTRIBUTIVA: reduzir DESIGUALDADE",
    "   * Impostos progressivos, transferencias, subsidios",
    "3. ESTABILIZADORA: manter CRESCIMENTO com ESTABILIDADE",
    "   * Politica fiscal anticíclica (expansionista na recessao)",
    "",
    "BENS PUBLICOS PUROS:",
    "* NAO RIVAL: consumo por A nao reduz disponibilidade para B",
    "* NAO EXCLUDENTE: impossivel excluir quem nao paga",
    "* Consequencia: FREE RIDER -> mercado falha -> Estado deve prover",
    "* Exemplos: defesa nacional, iluminacao publica, farol maritimo",
    "",
    "EXTERNALIDADES:",
    "* NEGATIVA (poluicao): custo social > privado -> mais producao que otimo",
    "  Solucao: IMPOSTO PIGOUVIANO (= dano marginal externo)",
    "* POSITIVA (vacinacao): beneficio social > privado -> menos producao",
    "  Solucao: SUBSIDIO ou provisao publica",
    "",
    "RESULTADO FISCAL:",
    "* PRIMARIO: receitas nao financeiras - despesas nao financeiras (sem juros)",
    "* NOMINAL: Primario - Juros nominais",
    "* NFSP: -Resultado Primario + Juros nominais",
    "",
    "DICA FCC: Free rider justifica provisao estatal de bens publicos.",
    "Superavit primario nao significa que a divida caiu.",
  ],
};

// Banco de questoes
const Q = {
"LP-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"Assinale a alternativa com concordância verbal CORRETA:",o:["A) Houveram muitas irregularidades na auditoria.","B) Fazem dois anos que o contribuinte nao declara.","C) Os dados e o relatorio foram encaminhados ao fisco.","D) A maioria dos auditores aprovaram o procedimento.","E) E necessario maiores esclarecimentos sobre o ICMS."],g:"C",c:"C: sujeito composto -> plural. A: HAVER impessoal -> Houve. B: FAZER impessoal -> Faz. D: maioria de + plural -> singular 'aprovou'. E: sujeito = 'maiores esclarecimentos' -> Sao necessarios."},
  {a:2022,r:"FCC/Fiscal/2022",q:"A frase com regencia verbal CORRETA e:",o:["A) O auditor aspirava o cargo de Auditor-Fiscal ha anos.","B) O servidor preferiu o lancamento de oficio do que o por homologacao.","C) O contribuinte informou os auditores da nova legislacao tributaria.","D) O fiscal assistiu o procedimento de auditoria com atencao.","E) O contribuinte pagou o tributo visando a evitar a execucao fiscal."],g:"E",c:"E: 'visar a' (objetivo) = correto. A: 'aspirar a' -> aspirava AO cargo. B: 'preferir' nunca 'do que'. C: 'informar' -> informou SOBRE. D: 'assistir' (ver) -> assistiu AO procedimento."},
  {a:2021,r:"FCC/PGE/2021",q:"Quanto ao emprego da crase, e CORRETO:",o:["A) Entregou os documentos a ele, conforme solicitado.","B) Encaminhou a Receita Federal a documentacao necessaria.","C) Referiu-se a multa aplicada pelo fisco estadual.","D) A decisao foi contraria a implementar novas aliquotas.","E) O prazo a ser cumprido e de 30 dias."],g:"C",c:"C: crase antes de substantivo feminino ('a multa') -> correta. A: antes de pronome pessoal = PROIBIDA. D: antes de infinitivo = PROIBIDA. E: antes de infinitivo = PROIBIDA."},
  {a:2020,r:"FCC/TRF/2020",q:"Na interpretacao de textos, a COESAO REFERENCIAL e realizada por:",o:["A) Conjuncoes que estabelecem relacoes logico-semanticas.","B) Pronomes, sinonimos e expressoes que retomam ou antecipam elementos.","C) A progressao tematica que garante a unidade do texto.","D) Adverbios de modo que qualificam os verbos do texto.","E) Artigos definidos que determinam os substantivos."],g:"B",c:"Coesao REFERENCIAL: mecanismos de retomada (anafora) ou antecipacao (catafora) - pronomes (ele, este), sinonimos, hipero nimos. Diferente de coesao SEQUENCIAL (conectivos)."},
  {a:2019,r:"FCC/ISS/2019",q:"'Se o contribuinte tivesse pago o tributo, nao teria sido autuado' expressa relacao de:",o:["A) Concessao","B) Finalidade","C) Condicao contrafactual (hipotese nao realizada)","D) Causa e efeito no presente","E) Temporalidade"],g:"C",c:"Oracão CONDICIONAL contrafactual: 'tivesse pago' (preteri. mais-que-perf. subj.) + 'teria sido' (cond. composto) = hipotese NAO realizada no passado."},
],
"DTR-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"A obrigacao tributaria ACESSORIA tem por objeto:",o:["A) O pagamento de tributo ou penalidade pecuniaria.","B) Prestacoes positivas ou negativas no interesse da arrecadacao ou fiscalizacao.","C) O pagamento de tributo apenas, excluidas as multas.","D) A entrega de documentos em cartorio competente.","E) O recolhimento de tributo antes do prazo de vencimento."],g:"B",c:"Art. 113 par. 2 CTN: obrigacao ACESSORIA = prestacoes POSITIVAS (fazer: emitir NF, escriturar) ou NEGATIVAS (nao fazer: nao obstruir) no interesse da arrecadacao/fiscalizacao. Descumprimento converte-se em PRINCIPAL (multa)."},
  {a:2022,r:"FCC/Fiscal/2022",q:"As causas de SUSPENSAO da exigibilidade (art. 151 CTN) sao:",o:["A) Pagamento, compensacao, transacao, remissao e prescricao.","B) Moratoria, deposito integral, reclamacoes/recursos, liminar/tutela e parcelamento.","C) Isencao, anistia e moratoria.","D) Decadencia, prescricao e confusao.","E) Parcelamento, dacao em pagamento e novacao."],g:"B",c:"MDRRLP: Moratoria, Deposito do montante integral, Reclamacoes e Recursos (admin.), Liminar em MS ou Tutela Antecipada, Parcelamento. A = extincao. C = exclusao + suspensao. D = extincao."},
  {a:2021,r:"FCC/SEFAZ-GO/2021",q:"A modalidade de lancamento em que o sujeito passivo antecipa o pagamento sem previo exame da autoridade e:",o:["A) Lancamento de oficio.","B) Lancamento por declaracao.","C) Lancamento por homologacao.","D) Auto-lancamento.","E) Lancamento misto."],g:"C",c:"Art. 150 CTN: LANCAMENTO POR HOMOLOGACAO - contribuinte antecipa o pagamento SEM previo exame. Autoridade tem 5 anos para homologar (expressa ou tacita). Modelo: ICMS, IPI, IR, PIS/COFINS."},
  {a:2020,r:"FCC/TRF/2020",q:"A DECADENCIA tributaria extingue:",o:["A) A pretensao de cobrar o credito ja constituido.","B) O direito da Fazenda de constituir o credito pelo lancamento.","C) A acao de execucao fiscal ja ajuizada.","D) O direito do contribuinte de repetir o indebito.","E) A possibilidade de parcelamento do credito em aberto."],g:"B",c:"DECADENCIA (art. 173): extingue o DIREITO DE LANCAR (constituir). PRESCRICAO (art. 174): extingue a pretensao de COBRAR o credito ja constituido. Regra geral: 5 anos do 1 dia do exercicio seguinte."},
  {a:2019,r:"FCC/SEFAZ-RJ/2019",q:"Sao modalidades de EXTINCAO do credito tributario (art. 156 CTN):",o:["A) Moratoria, deposito e parcelamento.","B) Pagamento, compensacao, transacao, remissao, prescricao e decadencia.","C) Isencao, anistia e imunidade.","D) Reclamacoes e recursos administrativos.","E) Liminar em mandado de seguranca."],g:"B",c:"Art. 156 lista 11 formas de EXTINCAO: pagamento, compensacao, transacao, remissao, prescricao, decadencia, conversao de deposito, pagamento antecipado+homologacao, consignacao, decisao admin. irreformavel, decisao judicial, dacao em pagamento de imoveis. A/D/E = SUSPENSAO. C = EXCLUSAO."},
],
"DTR-2":[
  {a:2024,r:"FCC/RT/2024",q:"A EC 132/2023 criou o IBS, de competencia:",o:["A) Exclusivamente federal.","B) Exclusivamente estadual.","C) Compartilhada entre estados, DF e municipios.","D) Municipal, substituindo apenas o ISS.","E) Conjunta entre Uniao e estados."],g:"C",c:"EC 132/2023 art. 156-A CF: IBS = competencia COMPARTILHADA (estados, DF e municipios). Substitui ICMS + ISS. Administrado pelo COMITE GESTOR do IBS (art. 156-B)."},
  {a:2024,r:"FCC estilo EC 132",q:"O Comite Gestor do IBS (art. 156-B CF) tem como competencia principal:",o:["A) Fixar politicas monetarias do pais.","B) Administrar, arrecadar, fiscalizar, cobrar e representar o IBS.","C) Substituir o CONFAZ em todas as competencias.","D) Definir aliquotas do IR para pessoas juridicas.","E) Regulamentar o ISS em todos os municipios."],g:"B",c:"Art. 156-B CF: Comite Gestor do IBS = administracao, arrecadacao, fiscalizacao, cobrança e representacao (judicial e extrajudicial). Colegiado com representantes de estados, DF e municipios. Nao substitui CONFAZ."},
  {a:2024,r:"FCC estilo reforma",q:"O principio do DESTINO no IBS significa que:",o:["A) O imposto e devido onde o bem e produzido.","B) O imposto e devido no local de CONSUMO do bem/servico.","C) A aliquota varia conforme o destino economico.","D) Incide apenas sobre importacoes para consumo.","E) O imposto e partilhado entre origem e destino pela metade."],g:"B",c:"Principio do DESTINO: IBS e devido no local de CONSUMO, nao de producao. Reduz guerra fiscal. Diferente do ICMS atual (origem nas operacoes interestaduais). Alinha o Brasil as melhores praticas internacionais de IVA."},
  {a:2023,r:"FCC/Fiscal/2023",q:"A CBS substitui qual(is) tributo(s) federal(is):",o:["A) IPI e ICMS federais.","B) PIS e COFINS.","C) IRPJ e CSLL.","D) IOF e ITR.","E) IPI e IOF."],g:"B",c:"CBS = Contribuicao sobre Bens e Servicos: substitui PIS e COFINS (competencia FEDERAL, administrada pela Receita Federal). IBS substitui ICMS+ISS (competencia dos estados/municipios)."},
  {a:2023,r:"FCC/SEFAZ/2023",q:"O Imposto Seletivo (IS) criado pela EC 132/2023 incide sobre:",o:["A) Operacoes de exportacao de commodities.","B) Substituicao do IOF nas operacoes financeiras.","C) Producao, extracao, comercializacao ou importacao de bens/servicos prejudiciais a saude ou ao meio ambiente.","D) Combustiveis automotivos, substituindo o ICMS monobasico.","E) Todas as operacoes de consumo a aliquota de 1%."],g:"C",c:"EC 132/2023 art. 153, VIII CF: IS = sobre bens/servicos PREJUDICIAIS A SAUDE OU AO MEIO AMBIENTE. Competencia FEDERAL. NAO integra a base do IBS e CBS."},
],
"LTE-1":[
  {a:2023,r:"FCC/SEFAZ-CE/2023",q:"O 'ICMS por dentro' significa que:",o:["A) O ICMS e calculado sobre o valor excluido o tributo.","B) O ICMS integra sua propria base de calculo, elevando a aliquota efetiva.","C) O ICMS incide apenas na fase interna do estabelecimento.","D) O recolhimento e feito antes da emissao da nota fiscal.","E) O ICMS substitui tributos municipais nas operacoes internas."],g:"B",c:"'ICMS por dentro': BC = valor sem ICMS / (1 - aliquota). Ex.: R$ 82 com 18% -> BC = R$ 100 -> ICMS = R$ 18. Aliquota real = 21,95% > 18% nominal."},
  {a:2022,r:"FCC/SEFAZ-CE/2022",q:"A substituicao tributaria PROGRESSIVA no ICMS-CE:",o:["A) Atribui ao adquirente o ICMS das operacoes anteriores.","B) Atribui ao fabricante/importador o recolhimento do ICMS de operacoes subsequentes.","C) Foi declarada inconstitucional pelo STF.","D) Dispensa emissao de nota fiscal nas operacoes seguintes.","E) Aplica-se exclusivamente a produtos de primeira necessidade."],g:"B",c:"ST progressiva: SUBSTITUTO (fabricante/importador) recolhe ICMS das operacoes futuras com MVA/pauta. STF RE 213.396: CONSTITUCIONAL. STF RE 593.849: se FG presumido NAO se realizar -> RESTITUICAO."},
  {a:2021,r:"FCC/SEFAZ-CE/2021",q:"O ITCD do Ceara (Lei 15.812/2015) incide sobre:",o:["A) Transmissao onerosa de bens imoveis inter vivos.","B) Transmissao causa mortis e doacao de quaisquer bens ou direitos.","C) Circulacao de mercadorias no Estado do Ceara.","D) Servicos de qualquer natureza prestados no municipio.","E) Propriedade de veiculos automotores registrados no Estado."],g:"B",c:"ITCD/CE (CF art. 155, I): CAUSA MORTIS (heranca) e DOACAO de qualquer bem. Competencia ESTADUAL. Aliquota maxima: 8% (Res. Senado 9/1992). Lei 15.812/2015-CE: aliquotas PROGRESSIVAS."},
  {a:2020,r:"FCC/SEFAZ-CE/2020",q:"O FECOP do Ceara (LC 37/2003) consiste em:",o:["A) Fundo para previdencia dos servidores estaduais.","B) Adicional de ICMS de ate 2% sobre produtos superfluos/prejudiciais para combate a pobreza.","C) Taxa cobrada sobre produtos importados do exterior.","D) Contribuicao de melhoria para obras de infraestrutura.","E) Fundo de equalizacao para municipios deficitarios."],g:"B",c:"FECOP = Fundo Estadual de Combate a Pobreza. LC 37/2003-CE: ADICIONAL DE ICMS de ate 2% sobre produtos superfluos/prejudiciais. Receita vinculada ao combate a pobreza (art. 82 ADCT)."},
  {a:2019,r:"FCC/SEFAZ-CE/2019",q:"O IPVA do Ceara (Lei 12.023/1992) tem como FATO GERADOR:",o:["A) A transmissao de propriedade de veiculo automotor.","B) A propriedade de veiculo automotor em 1 de janeiro de cada ano.","C) A circulacao de veiculo nas rodovias estaduais.","D) O licenciamento anual junto ao DETRAN.","E) A importacao de veiculo do exterior."],g:"B",c:"CF art. 155, III: IPVA = imposto ESTADUAL sobre PROPRIEDADE de veiculos. FG: propriedade em 1 DE JANEIRO (base temporal). Base de calculo: valor venal."},
],
"DFI-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"Os limites de despesas com pessoal para os ESTADOS (LRF art. 19-20) sao:",o:["A) 50% da RCL; Executivo: 40,9%.","B) 60% da RCL; Executivo: 49%.","C) 60% da RCL; Executivo: 54%.","D) 65% da RCL; Executivo: 49%.","E) 60% da RCL; Executivo: 45%."],g:"B",c:"Estados = 60% RCL. Distribuicao: Leg+TC=3%; Jud=6%; MP=2%; Exec=49%. UNIAO: 50% (Exec: 40,9%). MUNICIPIOS: 60% (Exec: 54%). Memorize: E=60/49; U=50/40,9; M=60/54."},
  {a:2022,r:"FCC/TCE/2022",q:"O art. 9 da LRF (limitacao de empenho) e acionado:",o:["A) No inicio de cada exercicio automaticamente.","B) Bimestralmente, quando a receita nao comportar as metas de resultado primario.","C) Apenas mediante autorizacao legislativa.","D) Quando qualquer despesa discricionaria for realizada.","E) Somente por decisao do TCU."],g:"B",c:"Art. 9 LRF: se bimestralmente a receita NAO COMPORTA as metas fiscais -> contingenciar empenho e movimentacao financeira (30 dias). Nao se aplica a despesas constitucionalmente obrigatorias."},
  {a:2021,r:"FCC/SEFAZ/2021",q:"O Resultado Primario e calculado como:",o:["A) Receitas totais menos despesas totais (incluindo juros).","B) Receitas nao financeiras menos despesas nao financeiras (excluidos os juros).","C) Resultado nominal acrescido da correcao monetaria.","D) Receitas tributarias menos despesas de pessoal.","E) Superavit nominal dividido pelo PIB corrente."],g:"B",c:"Resultado PRIMARIO = Receitas nao financeiras - Despesas nao financeiras (SEM juros). Mede ESFORCO FISCAL antes do servico da divida. Resultado NOMINAL = Primario - Juros nominais."},
  {a:2020,r:"FCC/TRT/2020",q:"Os Creditos EXTRAORDINARIOS diferenciam-se dos demais creditos adicionais porque:",o:["A) Dependem de lei especifica e autorizacao previa do Legislativo.","B) Sao abertos por decreto do Executivo para despesas urgentes e improvistos, com comunicacao posterior ao Legislativo.","C) Visam a reforcar dotacoes insuficientes na LOA.","D) Criam novas dotacoes para programas nao previstos no orcamento.","E) Dependem de indicacao de fonte de recursos para abertura."],g:"B",c:"Creditos EXTRAORDINARIOS: despesas URGENTES E IMPROVISTOS (guerra, calamidade) -> decreto executivo + comunicacao imediata ao Legislativo -> sem indicacao previa de fonte. Os demais (suplementares e especiais) exigem fonte de recursos."},
  {a:2019,r:"FCC/SEFAZ/2019",q:"O principio orcamentario da ANUALIDADE significa que:",o:["A) O orcamento e valido por 4 anos, coincidindo com o PPA.","B) O orcamento tem vigencia de 1 ano (exercicio financeiro).","C) As receitas e despesas devem ser estimadas anualmente pela media.","D) A LOA so pode ser modificada uma vez por ano.","E) Todas as dotacoes nao utilizadas caducam no exercicio seguinte."],g:"B",c:"Principio da ANUALIDADE (periodicidade): o orcamento tem vigencia de 1 ANO, coincidindo com o exercicio financeiro (1 jan a 31 dez). Diferente do PPA (4 anos). Restos a Pagar sao uma excecao ao principio."},
],
"CGP-1":[
  {a:2023,r:"FCC/TCE/2023",q:"Os estagios da RECEITA ORCAMENTARIA em ordem correta (MCASP):",o:["A) Empenho, liquidacao, pagamento e recolhimento.","B) Previsao, lancamento, arrecadacao e recolhimento.","C) Fixacao, empenho, arrecadacao e pagamento.","D) Programacao, reserva, movimentacao e quitacao.","E) Orcamentacao, cobranca, recebimento e deposito."],g:"B",c:"Receita: (1) PREVISAO (LOA); (2) LANCAMENTO (individualiza credito tributario); (3) ARRECADACAO (pagamento ao banco); (4) RECOLHIMENTO (entrega ao Tesouro). Estagios da DESPESA: fixacao, empenho, liquidacao, pagamento."},
  {a:2022,r:"FCC/TCE/2022",q:"Os estagios da DESPESA ORCAMENTARIA (Lei 4.320/64) sao:",o:["A) Previsao, lancamento, arrecadacao e recolhimento.","B) Programacao, reserva, empenho e pagamento.","C) Fixacao, empenho, liquidacao e pagamento.","D) Autorizacao, reserva, movimentacao e quitacao.","E) Dotacao, contingenciamento, empenho e liquidacao."],g:"C",c:"(1) FIXACAO (LOA); (2) EMPENHO (art. 58: cria obrigacao de pagar); (3) LIQUIDACAO (art. 63: verifica direito do credor); (4) PAGAMENTO (art. 64: entrega ao credor)."},
  {a:2021,r:"FCC/PGE/2021",q:"As caracteristicas qualitativas FUNDAMENTAIS da NBC TSP EC sao:",o:["A) Comparabilidade e verificabilidade.","B) Relevancia e representacao fidedigna.","C) Tempestividade e compreensibilidade.","D) Objetividade e consistencia.","E) Neutralidade e prudencia."],g:"B",c:"NBC TSP EC: FUNDAMENTAIS = (1) RELEVANCIA (valor preditivo + confirmatorio + materialidade); (2) REPRESENTACAO FIDEDIGNA (completa + neutra + livre de erros). DE MELHORIA: comparabilidade, verificabilidade, tempestividade, compreensibilidade."},
  {a:2020,r:"FCC/TCM/2020",q:"Os Restos a Pagar PROCESSADOS diferenciam-se dos NAO PROCESSADOS porque:",o:["A) Processados apenas tem empenho realizado.","B) Processados tem empenho E liquidacao realizados (direito verificado).","C) Nao processados tem prioridade de pagamento.","D) Processados sao cancelados automaticamente no exercicio seguinte.","E) Nao processados so podem ser pagos com autorizacao legislativa."],g:"B",c:"RP PROCESSADOS: empenho + LIQUIDACAO realizados -> direito do credor verificado, Estado DEVE pagar. RP NAO PROCESSADOS: apenas empenho -> liquidacao pendente. Cancelamento: apos 2 exercicios."},
  {a:2019,r:"FCC/SEFAZ/2019",q:"O EMPENHO de despesa publica (art. 58 Lei 4.320/64):",o:["A) Confirma que o bem foi entregue ou servico prestado.","B) Cria para o Estado a obrigacao de pagamento, pendente ou nao de implemento de condicao.","C) Efetiva o pagamento ao credor apos verificacao do direito.","D) E a reserva previa de credito sem criar obrigacao.","E) Depende de previa autorizacao do Tribunal de Contas."],g:"B",c:"Art. 58 Lei 4.320: 'o empenho cria para o Estado obrigacao de pagamento pendente ou nao de implemento de condicao.' Modalidades: ORDINARIO, ESTIMATIVO, GLOBAL."},
],
"COA-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"No CPC 46, os dados de NIVEL 3 da hierarquia de valor justo sao:",o:["A) Precos cotados em mercados ativos para ativos identicos.","B) Dados observaveis distintos dos precos cotados.","C) Dados NAO observaveis baseados em premissas da propria entidade.","D) Taxas de desconto livres de risco observaveis.","E) Precos de ativos similares ajustados por volatilidade."],g:"C",c:"CPC 46/IFRS 13: N1=cotacoes mercados ativos IDENTICOS (maior confiabilidade). N2=dados OBSERVAVEIS distintos. N3=dados NAO OBSERVAVEIS/premissas internas (menor confiabilidade, mais disclosure). Maximizar dados observaveis."},
  {a:2022,r:"FCC/RS/2022",q:"No CPC 06 R2 (IFRS 16), o arrendatario DEVE reconhecer para contratos > 12 meses:",o:["A) Apenas despesa linear no resultado.","B) Ativo de direito de uso + passivo de arrendamento.","C) Passivo contingente nas notas explicativas.","D) Ativo pelo valor de mercado se prazo > 50% da vida util.","E) Receita diferida dos pagamentos futuros."],g:"B",c:"CPC 06 R2/IFRS 16: ATIVO DE DIREITO DE USO (VP pagamentos + custos iniciais + restauracao) + PASSIVO DE ARRENDAMENTO (VP pagamentos futuros). Excecoes: <= 12 meses e baixo valor unitario."},
  {a:2021,r:"FCC/ISS/2021",q:"No CPC 15 (Combinacoes de Negocios), o GOODWILL POSITIVO ocorre quando:",o:["A) VJ liquido dos ativos/passivos supera a contraprestacao paga.","B) Contraprestacao + PNC + interesse previo excedem o VJ liquido dos ativos/passivos.","C) A adquirida tem apenas prejuizos acumulados.","D) Valor patrimonial contabil supera o valor de mercado.","E) A adquirida possui marca famosa nao reconhecida em balanco."],g:"B",c:"CPC 15/IFRS 3: Goodwill = (Contraprestacao + PNC + Interesse previo) - VJ liquido. POSITIVO -> ativo intangivel (nao amortizavel, impairment ANUAL). NEGATIVO -> COMPRA VANTAJOSA, reconhecida no RESULTADO imediatamente."},
  {a:2020,r:"FCC/Adm/2020",q:"O MEP (CPC 18) aplica-se a:",o:["A) Qualquer empresa com participacao superior a 1%.","B) Coligadas (influencia significativa >= 20% votante) e controladas.","C) Apenas controladas com mais de 50% do capital total.","D) Investimentos ao valor justo por resultado.","E) Todos os investimentos em empresas listadas em bolsa."],g:"B",c:"CPC 18: MEP para COLIGADAS (influencia significativa >= 20% capital votante) e CONTROLADAS. O MEP atualiza o investimento pelo % de participacao no PL da investida."},
  {a:2019,r:"FCC/SEFAZ-BA/2019",q:"Uma empresa tem CF=R$400.000, PV=R$200/un e CV=R$120/un. O Ponto de Equilibrio CONTABIL e:",o:["A) 2.000 unidades","B) 3.333 unidades","C) 4.000 unidades","D) 5.000 unidades","E) 6.667 unidades"],g:"D",c:"MC = PV - CV = 200 - 120 = R$ 80/un. PEC = CF/MC = 400.000/80 = 5.000 unidades. Verificacao: 5.000x200=1.000.000; 5.000x120=600.000 CV; CF=400.000; Lucro=0."},
],
"FLD-1":[
  {a:2023,r:"FCC/TI/2023",q:"A clausula HAVING em SQL:",o:["A) Filtra linhas individuais antes do agrupamento.","B) Filtra GRUPOS apos o agrupamento por GROUP BY.","C) Ordena os resultados em ordem crescente.","D) Define quais colunas serao retornadas na consulta.","E) Substitui o WHERE quando ha funcoes de agregacao."],g:"B",c:"HAVING filtra GRUPOS apos GROUP BY. Pode usar funcoes de agregacao (SUM, COUNT). WHERE filtra LINHAS antes do agrupamento, NAO pode usar agregacao. Ordem: FROM->JOIN->WHERE->GROUP BY->HAVING->SELECT->ORDER BY."},
  {a:2022,r:"FCC/Analista/2022",q:"O Data Lakehouse combina:",o:["A) Apenas dados estruturados relacionais com alta performance.","B) O armazenamento flexivel do Data Lake com ACID e performance analitica do Data Warehouse.","C) Processamento exclusivo em tempo real.","D) Banco operacional com Data Mart departamental.","E) Armazenamento em nuvem com processamento on-premises."],g:"B",c:"Data LAKE: dados brutos, schema-on-read, barato. Data WAREHOUSE: dados curados, schema-on-write, BI. Data LAKEHOUSE (Delta Lake, Iceberg): ACID + schema enforcement + performance analitica + armazenamento barato."},
  {a:2021,r:"FCC/TI/2021",q:"A base legal da LGPD que autoriza o Fisco a tratar dados para fiscalizacao tributaria e:",o:["A) Consentimento do titular.","B) Legitimo interesse do controlador.","C) Cumprimento de obrigacao legal ou regulatoria.","D) Execucao de contrato.","E) Protecao da vida do titular."],g:"C",c:"Art. 7, II LGPD: 'cumprimento de obrigacao legal ou regulatoria'. Fiscalizacao tributaria e OBRIGACAO LEGAL (CTN art. 194). Nao precisa de consentimento do contribuinte."},
  {a:2020,r:"FCC/TI/2020",q:"O processo ETL na engenharia de dados:",o:["A) Extrai dados de uma unica fonte para analise em tempo real.","B) Extrai de multiplas fontes, transforma (limpeza, padronizacao) e carrega em repositorio centralizado.","C) Apenas encripta dados sensiveis para armazenamento.","D) Cria backups automaticos de bancos operacionais.","E) Monitora a qualidade dos dados apos carregamento."],g:"B",c:"ETL: (E) EXTRACT - coleta de multiplas fontes heterogeneas; (T) TRANSFORM - limpeza, padronizacao, enriquecimento; (L) LOAD - carregamento no DW/DM/Lakehouse. ELT: carga primeiro, transformacao depois (cloud)."},
  {a:2019,r:"FCC/Analista/2019",q:"Em SQL, o JOIN que retorna TODOS os registros da tabela da esquerda, mesmo sem correspondencia na direita, e:",o:["A) INNER JOIN","B) RIGHT JOIN","C) LEFT JOIN","D) FULL OUTER JOIN","E) CROSS JOIN"],g:"C",c:"LEFT JOIN (LEFT OUTER JOIN): TODOS os da esquerda + correspondentes da direita (NULL se nao). RIGHT: inverso. INNER: apenas correspondencia em ambas. FULL OUTER: todos de ambas. CROSS: produto cartesiano."},
],
"FPB-1":[
  {a:2023,r:"FCC/Fiscal/2023",q:"As tres funcoes classicas do governo (Musgrave) sao:",o:["A) Arrecadacao, fiscalizacao e redistribuicao.","B) Alocativa, distributiva e estabilizadora.","C) Regulatoria, tributaria e redistributiva.","D) Planejamento, execucao e controle.","E) Producao de bens, monopolio natural e externalidades."],g:"B",c:"Musgrave (1959): (1) ALOCATIVA: corrigir falhas de mercado; (2) DISTRIBUTIVA: reduzir desigualdade; (3) ESTABILIZADORA: emprego, inflacao, crescimento."},
  {a:2022,r:"FCC/Fiscal/2022",q:"Os bens publicos PUROS caracterizam-se por:",o:["A) Rivalidade e exclusao.","B) Nao rivalidade e nao exclusao (problema do free rider).","C) Rivalidade e nao exclusao.","D) Nao rivalidade e exclusao.","E) Alta rivalidade e exclusao parcial."],g:"B",c:"Bem publico PURO: NAO RIVAL + NAO EXCLUDENTE -> FREE RIDER (ninguem paga voluntariamente) -> mercado FALHA -> Estado deve prover. Ex: defesa nacional, iluminacao publica, farol maritimo."},
  {a:2021,r:"FCC/TCE/2021",q:"O superavit primario indica que:",o:["A) O governo pagou todos os juros sem deficit nominal.","B) As receitas nao financeiras superaram as despesas nao financeiras antes dos juros.","C) A divida publica total diminuiu no periodo.","D) O resultado nominal tambem e positivo.","E) O governo nao contraiu novas dividas."],g:"B",c:"SUPERAVIT PRIMARIO = esforco fiscal ANTES dos juros. Possivel ter superavit primario com DEFICIT NOMINAL (quando juros > superavit). A divida pode crescer mesmo com superavit se os juros forem altos."},
  {a:2020,r:"FCC/Econ/2020",q:"A externalidade NEGATIVA (poluicao) gera falha de mercado porque:",o:["A) O mercado produz em quantidade insuficiente.","B) O custo social supera o privado; o mercado produz em excesso.","C) As empresas nao auferirem lucro.","D) E um bem publico que requer provisao estatal.","E) O principio do beneficio exige subsidio."],g:"B",c:"Externalidade NEGATIVA: custo SOCIAL > custo PRIVADO. Produtor impoe custo a terceiros sem compensar -> produz MAIS que o otimo. Solucao: IMPOSTO PIGOUVIANO (= dano marginal externo). Principio POLUIDOR-PAGADOR."},
  {a:2019,r:"FCC/Econ/2019",q:"A NFSP nominal e calculada como:",o:["A) Resultado Primario - Juros Reais.","B) Deficit Primario + Juros Nominais.","C) Total de receitas - total de despesas.","D) Variacao da divida liquida - correcao monetaria.","E) Deficit operacional + variacao cambial."],g:"B",c:"NFSP NOMINAL = Deficit Primario + Juros Nominais (ou: -Resultado Primario + Juros Nominais). Mede a VARIACAO DA DIVIDA LIQUIDA do setor publico. Quando positiva: divida aumenta."},
],
};

// Mapeamento topico -> chave do banco de questoes
const QK = {
  "LP-1":"LP-1","LP-2":"LP-1","MAT-1":"","MAT-2":"","ADM-1":"",
  "ADM-2":"","ECO-1":"","ECO-2":"","DCO-1":"","DAD-1":"",
  "DCI-1":"","DFI-1":"DFI-1","DFI-2":"DFI-1","CGP-1":"CGP-1",
  "CGP-2":"","COA-1":"COA-1","COA-2":"COA-1","DTR-1":"DTR-1",
  "DTR-2":"DTR-2","DTR-3":"DTR-2","LTE-1":"LTE-1","FLD-1":"FLD-1",
  "FPB-1":"FPB-1",
};

const DISC = [
  {n:"Lingua Portuguesa",c:"#84cc16",i:"📝",p:"10Q",tps:[
    {id:"LP-1",t:"Concordancia, Regencia, Crase e Morfossintaxe"},
    {id:"LP-2",t:"Interpretacao, Coesao, Pontuacao e Ortografia"},
  ]},
  {n:"Matematica Financeira, Estatistica e Logica",c:"#06b6d4",i:"🔢",p:"12Q",tps:[
    {id:"MAT-1",t:"Juros Simples, Compostos, SAC e Price"},
    {id:"MAT-2",t:"Estatistica Descritiva, Probabilidade e Logica"},
  ]},
  {n:"Administracao Publica e Governanca",c:"#f59e0b",i:"🏢",p:"10Q",tps:[
    {id:"ADM-1",t:"Governanca, Gestao de Riscos e Integridade"},
    {id:"ADM-2",t:"Licitacoes (Lei 14.133/2021), Improbidade e LAI"},
  ]},
  {n:"Economia",c:"#3b82f6",i:"📉",p:"10Q",tps:[
    {id:"ECO-1",t:"Microeconomia, Elasticidades e Tributacao"},
    {id:"ECO-2",t:"Macroeconomia, PIB, IS-LM e Politicas"},
  ]},
  {n:"Direito Constitucional",c:"#ec4899",i:"⚖️",p:"4Q",tps:[
    {id:"DCO-1",t:"Controle de Constitucionalidade e Direitos Fundamentais"},
  ]},
  {n:"Direito Administrativo",c:"#f97316",i:"🏛️",p:"4Q",tps:[
    {id:"DAD-1",t:"Atos Administrativos, Responsabilidade Civil e Organizacao"},
  ]},
  {n:"Direito Civil e Penal",c:"#a78bfa",i:"📋",p:"4Q",tps:[
    {id:"DCI-1",t:"Crimes Tributarios, Lavagem de Dinheiro e Noções Cíveis"},
  ]},
  {n:"Direito Financeiro",c:"#14b8a6",i:"💰",p:"8Q",tps:[
    {id:"DFI-1",t:"LRF - Lei de Responsabilidade Fiscal Completa"},
    {id:"DFI-2",t:"Orcamento Publico, PPA, LDO, LOA e Lei 4.320/64"},
  ]},
  {n:"Contabilidade Geral e Publica",c:"#6366f1",i:"📒",p:"10Q",tps:[
    {id:"CGP-1",t:"MCASP, Receita, Despesa, NBC TSP e Restos a Pagar"},
    {id:"CGP-2",t:"Estoques, Ativo Imobilizado, Provisoes e DRE"},
  ]},
  {n:"Contabilidade Avancada e de Custos",c:"#8b5cf6",i:"📊",p:"20Q (Peso 2)",tps:[
    {id:"COA-1",t:"Valor Justo (CPC 46), Arrendamento IFRS 16, Goodwill e MEP"},
    {id:"COA-2",t:"Custos, Ponto de Equilibrio e Metodos de Custeio"},
  ]},
  {n:"Direito Tributario",c:"#ef4444",i:"⚖️",p:"20Q (Peso 2)",tps:[
    {id:"DTR-1",t:"CTN: Obrigacao, Fato Gerador, Credito, Extincao e Suspensao"},
    {id:"DTR-2",t:"Reforma Tributaria: EC 132/2023, IBS, CBS e IS"},
    {id:"DTR-3",t:"Lei Kandir, CONFAZ, Simples Nacional e LC 116"},
  ]},
  {n:"Legislacao Tributaria Estadual do Ceara",c:"#f97316",i:"📜",p:"20Q (Peso 2)",tps:[
    {id:"LTE-1",t:"ICMS-CE, ITCD, IPVA e FECOP"},
  ]},
  {n:"Fluencia de Dados",c:"#d946ef",i:"💻",p:"10Q (Peso 2)",tps:[
    {id:"FLD-1",t:"SQL, Arquitetura de Dados, LGPD e Governanca de Dados"},
  ]},
  {n:"Financas Publicas",c:"#10b981",i:"📈",p:"10Q (Peso 2)",tps:[
    {id:"FPB-1",t:"Funcoes do Estado (Musgrave), Bens Publicos e Resultado Fiscal"},
  ]},
];

const fmtT = s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

// ── QUIZ ──────────────────────────────────────────────
function Quiz({tp, qs, onBack}){
  const [lim,setLim]=useState(null);
  const [idx,setIdx]=useState(0);
  const [sel,setSel]=useState(null);
  const [show,setShow]=useState(false);
  const [ac,setAc]=useState(0);
  const [er,setEr]=useState(0);
  const [t,setT]=useState(0);
  const [fim,setFim]=useState(false);
  const ref=useRef(null);

  useEffect(()=>{
    if(lim&&!fim){ ref.current=setInterval(()=>setT(x=>x+1),1000); }
    return()=>clearInterval(ref.current);
  },[lim,fim]);

  if(!qs||qs.length===0) return(
    <div style={{textAlign:"center",padding:40}}>
      <div style={{fontSize:44,marginBottom:12}}>🚧</div>
      <h3 style={{color:C.gold,marginBottom:8}}>Questoes em elaboracao</h3>
      <p style={{color:C.muted,marginBottom:20}}>Em breve mais questoes para este topico.</p>
      <button onClick={onBack} style={{background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>Voltar</button>
    </div>
  );

  if(!lim){
    const mx=qs.length;
    const opts=[...new Set([5,10,20,mx].filter(v=>v<=mx))];
    return(
      <div style={{maxWidth:480,margin:"0 auto",textAlign:"center"}}>
        <button onClick={onBack} style={{display:"block",margin:"0 0 16px",background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:12}}>← Voltar</button>
        <div style={{background:C.card,border:`1px solid ${C.gold}44`,borderRadius:12,padding:28}}>
          <div style={{fontSize:44,marginBottom:10}}>🎯</div>
          <h3 style={{color:C.goldL,margin:"0 0 6px"}}>{tp.t}</h3>
          <p style={{color:C.muted,fontSize:13,margin:"0 0 24px"}}>{mx} questoes FCC disponiveis (2018-2025)</p>
          <p style={{color:C.text,fontSize:14,marginBottom:20,fontWeight:600}}>Quantas questoes deseja praticar?</p>
          <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",marginBottom:16}}>
            {opts.map(n=>(
              <button key={n} onClick={()=>setLim(n)}
                style={{background:n===mx?C.gold:C.card2,color:n===mx?"#000":C.text,border:`2px solid ${n===mx?C.gold:C.border}`,borderRadius:10,padding:"14px 20px",cursor:"pointer",fontSize:17,fontWeight:700,minWidth:70}}>
                {n}{n===mx?" ✨":""}
              </button>
            ))}
          </div>
          <p style={{color:C.muted,fontSize:11}}>Com cronometro, gabarito comentado e contador de acertos/erros</p>
        </div>
      </div>
    );
  }

  const sel_qs=qs.slice(0,lim);
  const q=sel_qs[idx];

  const confirmar=()=>{
    if(!sel) return;
    if(sel===q.g) setAc(a=>a+1); else setEr(e=>e+1);
    setShow(true);
  };

  const proxima=()=>{
    if(idx+1>=sel_qs.length){ setFim(true); clearInterval(ref.current); }
    else{ setIdx(i=>i+1); setSel(null); setShow(false); }
  };

  if(fim){
    const pct=Math.round((ac/sel_qs.length)*100);
    return(
      <div style={{maxWidth:680,margin:"0 auto"}}>
        <div style={{background:C.card,border:`2px solid ${pct>=60?C.green:C.red}`,borderRadius:14,padding:28,textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:52,marginBottom:8}}>{pct>=70?"🏆":pct>=50?"📚":"💪"}</div>
          <h2 style={{color:pct>=60?C.green:C.red,margin:"0 0 4px"}}>{pct>=70?"Excelente!":pct>=50?"Bom progresso!":"Continue estudando!"}</h2>
          <p style={{color:C.muted,marginBottom:20,fontSize:13}}>{tp.t}</p>
          <div style={{display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap",marginBottom:20}}>
            {[["✅ Acertos",ac,C.green],["❌ Erros",er,C.red],["⏱ Tempo",fmtT(t),C.blue],["📊 Aproveit.",pct+"%",pct>=60?C.gold:C.red]].map(([l,v,col])=>(
              <div key={l} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 18px",textAlign:"center",minWidth:80}}>
                <div style={{fontSize:24,fontWeight:700,color:col}}>{v}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{height:8,background:C.border,borderRadius:4,maxWidth:380,margin:"0 auto"}}>
            <div style={{height:"100%",width:`${pct}%`,background:pct>=70?C.green:pct>=50?"#f59e0b":C.red,borderRadius:4}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>{setIdx(0);setSel(null);setShow(false);setAc(0);setEr(0);setT(0);setFim(false);}}
            style={{background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>
            🔄 Refazer
          </button>
          <button onClick={()=>{setLim(null);setIdx(0);setSel(null);setShow(false);setAc(0);setEr(0);setT(0);setFim(false);}}
            style={{background:"transparent",color:C.gold,border:`1px solid ${C.gold}`,borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>
            ↩ Nova quantidade
          </button>
          <button onClick={onBack}
            style={{background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>
            ← Topico
          </button>
        </div>
      </div>
    );
  }

  return(
    <div style={{maxWidth:700,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <button onClick={onBack} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12}}>← Voltar</button>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <span style={{color:C.green,fontWeight:700,fontSize:14}}>✅ {ac}</span>
          <span style={{color:C.red,fontWeight:700,fontSize:14}}>❌ {er}</span>
          <span style={{fontFamily:"monospace",fontSize:19,fontWeight:700,color:t>300?C.red:C.green}}>⏱ {fmtT(t)}</span>
        </div>
        <span style={{fontSize:12,color:C.muted}}>Q{idx+1}/{sel_qs.length}</span>
      </div>

      <div style={{height:4,background:C.border,borderRadius:2,marginBottom:16}}>
        <div style={{height:"100%",width:`${((idx+1)/sel_qs.length)*100}%`,background:C.gold,borderRadius:2,transition:"width 0.3s"}}/>
      </div>

      <div style={{background:C.card,border:`1px solid ${show?(sel===q.g?C.green:C.red):C.border}`,borderRadius:12,padding:20,transition:"border-color 0.3s"}}>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          <span style={{background:"#1e3a5f",color:"#7bb3e8",padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700}}>Q{idx+1}</span>
          <span style={{color:C.muted,fontSize:11}}>{q.r}</span>
          <span style={{color:C.muted,fontSize:11}}>• {q.a}</span>
        </div>
        <p style={{fontSize:13,color:C.text,lineHeight:1.85,marginBottom:16}}>{q.q}</p>

        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {q.o.map((alt,j)=>{
            const L=alt[0];
            const isSel=sel===L;
            const isCorr=show&&L===q.g;
            const isErr=show&&isSel&&L!==q.g;
            let bg="transparent",bdr=C.border,col=C.text;
            if(isCorr){bg="#16a34a22";bdr=C.green;col=C.green;}
            else if(isErr){bg="#dc262222";bdr=C.red;col=C.red;}
            else if(isSel&&!show){bg=C.gold+"22";bdr=C.gold;col=C.gold;}
            else if(show){col=C.muted;}
            return(
              <div key={j} onClick={()=>!show&&setSel(L)}
                style={{background:bg,border:`2px solid ${bdr}`,borderRadius:8,padding:"10px 14px",cursor:show?"default":"pointer",color:col,fontSize:13,lineHeight:1.65,transition:"all 0.15s"}}>
                {alt}{isCorr?" ✅":isErr?" ❌":""}
              </div>
            );
          })}
        </div>

        {!show&&(
          <div style={{textAlign:"center"}}>
            <button onClick={confirmar} disabled={!sel}
              style={{background:sel?C.gold:"#2d3748",color:sel?"#000":C.muted,border:"none",borderRadius:8,padding:"11px 28px",cursor:sel?"pointer":"not-allowed",fontWeight:700,fontSize:14}}>
              {sel?"✓ Confirmar Resposta":"Selecione uma alternativa"}
            </button>
          </div>
        )}

        {show&&(
          <div>
            <div style={{background:sel===q.g?"#16a34a22":"#dc262222",border:`2px solid ${sel===q.g?C.green:C.red}`,borderRadius:10,padding:"12px 16px",marginBottom:12}}>
              <div style={{fontWeight:700,fontSize:17,color:sel===q.g?C.green:C.red,marginBottom:sel!==q.g?6:0}}>
                {sel===q.g?"✅ Voce acertou! 🎯":"❌ Voce errou!"}
              </div>
              {sel!==q.g&&<div style={{fontSize:12,color:C.text}}>Resposta correta: <strong style={{color:C.green}}>{q.g}</strong></div>}
            </div>
            <div style={{background:"#0f2647",border:"1px solid #1e3a5f",borderRadius:8,padding:"12px 14px",marginBottom:14}}>
              <div style={{fontWeight:700,color:"#7bb3e8",marginBottom:6,fontSize:12}}>📖 Gabarito Comentado</div>
              <p style={{margin:0,fontSize:12,color:C.text,lineHeight:1.85}}>{q.c}</p>
            </div>
            <div style={{textAlign:"right"}}>
              <button onClick={proxima}
                style={{background:idx+1>=sel_qs.length?C.green:C.gold,color:"#000",border:"none",borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700,fontSize:13}}>
                {idx+1>=sel_qs.length?"📊 Ver Resultado":"Proxima Questao →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── FLASHCARD ─────────────────────────────────────────
function Flashcard({tp, onBack}){
  const [virado,setVirado]=useState(false);
  const linhas=R[tp.id]||["Conteudo em elaboracao para este topico."];

  return(
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <button onClick={onBack} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",marginBottom:14,fontSize:12}}>← Voltar</button>

      <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:10,padding:"12px 16px",marginBottom:14}}>
        <h3 style={{color:C.goldL,margin:"0 0 2px",fontSize:15}}>{tp.t}</h3>
        <p style={{color:C.muted,margin:0,fontSize:11}}>Toque no card para ver o resumo completo</p>
      </div>

      {/* Card interativo */}
      <div onClick={()=>setVirado(v=>!v)}
        style={{cursor:"pointer",minHeight:280,borderRadius:14,padding:24,marginBottom:14,background:virado?"#0a1f40":C.card,border:`2px solid ${virado?C.blue:C.gold}`,transition:"all 0.3s",boxShadow:virado?"0 0 30px #3b82f622":"0 0 20px #c8a95122"}}>
        {!virado?(
          <div style={{textAlign:"center",paddingTop:40}}>
            <div style={{fontSize:52,marginBottom:16}}>📇</div>
            <div style={{fontSize:19,fontWeight:700,color:C.goldL,lineHeight:1.4,maxWidth:380,margin:"0 auto"}}>{tp.t}</div>
            <div style={{marginTop:20,color:C.muted,fontSize:13}}>👆 Toque para ver o resumo</div>
          </div>
        ):(
          <div>
            <div style={{fontSize:11,color:C.blue,marginBottom:14,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>📖 RESUMO COMPLETO</div>
            {linhas.map((l,i)=>{
              if(l==="") return <div key={i} style={{height:10}}/>;
              const isTitle=l.startsWith("##");
              const isSub=l.startsWith("*")||l.startsWith("-");
              const isDica=l.startsWith("DICA");
              return(
                <div key={i} style={{marginBottom:isTitle?8:3,paddingLeft:isSub?12:0}}>
                  <span style={{fontSize:isTitle?14:12,fontWeight:isTitle?700:isDica?700:400,color:isTitle?C.goldL:isDica?"#fbbf24":isSub?C.text:"#cbd5e1",lineHeight:1.8,fontStyle:isDica?"italic":"normal"}}>
                    {l}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <button onClick={()=>setVirado(v=>!v)}
          style={{background:virado?C.gold:C.blue,color:"#000",border:"none",borderRadius:8,padding:"10px 24px",cursor:"pointer",fontWeight:700,fontSize:13}}>
          {virado?"← Ver Titulo":"📖 Ver Resumo"}
        </button>
      </div>

      {tp.links&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
          <div style={{fontWeight:700,color:C.gold,fontSize:12,marginBottom:10}}>🔗 Fontes e Videoaulas</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {tp.links.map((l,i)=>(
              <a key={i} href={l.u} target="_blank" rel="noopener noreferrer"
                style={{background:C.card2,border:`1px solid ${C.border}`,color:"#93c5fd",borderRadius:6,padding:"5px 10px",fontSize:12,textDecoration:"none"}}>
                🌐 {l.l}
              </a>
            ))}
            {tp.yt&&tp.yt.map((l,i)=>(
              <a key={i} href={l.u} target="_blank" rel="noopener noreferrer"
                style={{background:"#1a0808",border:"1px solid #7f1d1d",color:"#fca5a5",borderRadius:6,padding:"5px 10px",fontSize:12,textDecoration:"none"}}>
                ▶️ {l.l}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── TOPICO VIEW ───────────────────────────────────────
function TopicoView({tp, corDisc, onBack}){
  const [modo,setModo]=useState(null);
  const qk=QK[tp.id]||"";
  const qs=qk?Q[qk]:null;
  const nq=qs?qs.length:0;

  const links=[
    {l:"Planalto - Legislacao",u:"https://www.planalto.gov.br"},
    {l:"STF - Jurisprudencia",u:"https://portal.stf.jus.br"},
  ];
  const yt=[
    {l:"Buscar no YouTube",u:`https://www.youtube.com/results?search_query=${encodeURIComponent(tp.t+" FCC concurso fiscal")}`},
  ];

  const tpComLinks={...tp, links, yt};

  if(modo==="fc") return <Flashcard tp={tpComLinks} onBack={()=>setModo(null)}/>;
  if(modo==="qz") return <Quiz tp={tp} qs={qs} onBack={()=>setModo(null)}/>;

  const linhasPreview=(R[tp.id]||[]).slice(0,5);

  return(
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <button onClick={onBack} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",marginBottom:14,fontSize:12}}>← Voltar</button>

      <div style={{background:C.card,border:`1px solid ${corDisc}44`,borderLeft:`4px solid ${corDisc}`,borderRadius:10,padding:"14px 16px",marginBottom:16}}>
        <h3 style={{color:C.goldL,margin:"0 0 8px",fontSize:15}}>{tp.t}</h3>
        {linhasPreview.map((l,i)=>l&&(
          <p key={i} style={{margin:"0 0 2px",fontSize:12,color:C.muted,lineHeight:1.6}}>{l}</p>
        ))}
        <p style={{margin:"6px 0 0",fontSize:11,color:C.muted,fontStyle:"italic"}}>...clique em Flashcard para ver o resumo completo</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div onClick={()=>setModo("fc")}
          style={{background:C.card,border:"2px solid #3b82f6",borderRadius:12,padding:22,cursor:"pointer",textAlign:"center",transition:"transform 0.15s,background 0.15s"}}
          onMouseOver={e=>e.currentTarget.style.background="#0d1f35"}
          onMouseOut={e=>e.currentTarget.style.background=C.card}>
          <div style={{fontSize:40,marginBottom:8}}>📇</div>
          <div style={{fontWeight:700,color:"#3b82f6",fontSize:14,marginBottom:4}}>Flashcard</div>
          <div style={{color:C.muted,fontSize:12}}>Resumo completo + links + videoaulas</div>
        </div>
        <div onClick={()=>qs&&setModo("qz")}
          style={{background:C.card,border:`2px solid ${qs?"#a855f7":C.border}`,borderRadius:12,padding:22,cursor:qs?"pointer":"default",textAlign:"center",opacity:qs?1:0.55,transition:"transform 0.15s,background 0.15s"}}
          onMouseOver={e=>{ if(qs) e.currentTarget.style.background="#1a0d35"; }}
          onMouseOut={e=>e.currentTarget.style.background=C.card}>
          <div style={{fontSize:40,marginBottom:8}}>🎯</div>
          <div style={{fontWeight:700,color:qs?"#a855f7":C.muted,fontSize:14,marginBottom:4}}>Questoes FCC</div>
          <div style={{color:C.muted,fontSize:12}}>{qs?`${nq}Q • Escolha de 5 a ${nq}`:"Em breve"}</div>
        </div>
      </div>
    </div>
  );
}

// ── DISC VIEW ─────────────────────────────────────────
function DiscView({d, onBack}){
  const [tp,setTp]=useState(null);
  if(tp) return <TopicoView tp={tp} corDisc={d.c} onBack={()=>setTp(null)}/>;
  return(
    <div>
      <button onClick={onBack} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",marginBottom:14,fontSize:12}}>← Disciplinas</button>
      <div style={{background:C.card,border:`1px solid ${d.c}`,borderLeft:`4px solid ${d.c}`,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <h2 style={{color:d.c,margin:0,fontSize:16}}>{d.i} {d.n}</h2>
          <span style={{background:d.c+"22",border:`1px solid ${d.c}`,color:d.c,padding:"3px 10px",borderRadius:4,fontSize:11,fontWeight:700}}>{d.p}</span>
        </div>
        <p style={{margin:"6px 0 0",color:C.muted,fontSize:12}}>{d.tps.length} topico(s) — Escolha para estudar</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {d.tps.map((tp,i)=>{
          const qk=QK[tp.id]||"";
          const nq=qk&&Q[qk]?Q[qk].length:0;
          return(
            <div key={i} onClick={()=>setTp(tp)}
              style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",transition:"border-color 0.2s,transform 0.15s"}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=d.c;e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div style={{fontWeight:700,color:C.text,fontSize:13}}>{tp.t}</div>
                <div style={{display:"flex",gap:6}}>
                  <span style={{background:"#3b82f622",border:"1px solid #3b82f6",color:"#3b82f6",fontSize:10,padding:"2px 7px",borderRadius:3,fontWeight:700}}>📇 Flashcard</span>
                  {nq>0&&<span style={{background:"#a855f722",border:"1px solid #a855f7",color:"#a855f7",fontSize:10,padding:"2px 7px",borderRadius:3,fontWeight:700}}>🎯 {nq}Q</span>}
                </div>
              </div>
              <p style={{margin:"6px 0 0",fontSize:11,color:C.muted,lineHeight:1.5}}>
                {(R[tp.id]||[""])[0].substring(0,90)}...
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────
export default function FlashcardsApp(){
  const [d,setD]=useState(null);
  if(d) return <DiscView d={d} onBack={()=>setD(null)}/>;
  return(
    <div>
      <div style={{background:C.card,border:`1px solid ${C.gold}44`,borderRadius:10,padding:"14px 16px",marginBottom:18}}>
        <h2 style={{color:C.gold,margin:"0 0 6px",fontSize:16}}>📚 Resumos e Flashcards — SEFAZ/CE 2026</h2>
        <p style={{color:C.muted,fontSize:12,lineHeight:1.7,margin:"0 0 10px"}}>
          Cobertura completa do Edital no 01/2026 (Anexo VI). 14 disciplinas com resumos didaticos, flashcards interativos e questoes FCC comentadas.
        </p>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {[["📇 Flashcards","#3b82f6"],["🎯 Questoes FCC 2018-2025","#a855f7"],["⏱ Cronometro","#22c55e"],["📊 Acertos/Erros","#ef4444"]].map(([l,c])=>(
            <span key={l} style={{background:c+"22",border:`1px solid ${c}`,color:c,borderRadius:4,padding:"3px 10px",fontSize:11,fontWeight:700}}>{l}</span>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
        {DISC.map((disc,i)=>(
          <div key={i} onClick={()=>setD(disc)}
            style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${disc.c}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",transition:"transform 0.15s,border-color 0.2s"}}
            onMouseOver={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=disc.c;}}
            onMouseOut={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=C.border;}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <span style={{fontSize:22}}>{disc.i}</span>
              <span style={{background:disc.c+"22",border:`1px solid ${disc.c}`,color:disc.c,fontSize:10,padding:"2px 6px",borderRadius:3,fontWeight:700}}>{disc.p}</span>
            </div>
            <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:4,lineHeight:1.4}}>{disc.n}</div>
            <div style={{fontSize:11,color:C.muted}}>{disc.tps.length} topico(s) — Resumos + Questoes FCC →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
