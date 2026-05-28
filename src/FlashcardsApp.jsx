import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   SEFAZ/CE 2026 — RESUMOS & FLASHCARDS
   Cobertura COMPLETA do Anexo VI do Edital nº 01/2026
   Banca FCC | Cargo: Auditor-Fiscal da Fazenda Estadual
═══════════════════════════════════════════════════════════════ */

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035",
  border:"#1b2c44", gold:"#c8a951", goldL:"#f0d080",
  red:"#ef4444", green:"#22c55e", blue:"#3b82f6",
  purple:"#a855f7", text:"#e2e8f0", muted:"#64748b",
};

// ─── BANCO DE QUESTÕES ────────────────────────────────
const Q = {

"LP-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"Assinale a alternativa com concordância verbal CORRETA:",o:["A) Houveram muitas irregularidades na auditoria.","B) Fazem dois anos que o contribuinte não declara.","C) Os dados e o relatório foram encaminhados ao fisco.","D) A maioria dos auditores aprovaram o procedimento.","E) É necessário maiores esclarecimentos sobre o ICMS."],g:"C",c:"C: sujeito composto 'dados e relatório' → plural. A: HAVER (existir) é impessoal → Houve. B: FAZER (tempo) é impessoal → Faz. D: maioria de + plural → padrão FCC = singular 'aprovou'. E: sujeito = 'maiores esclarecimentos' → São necessários."},
  {a:2022,r:"FCC/Fiscal/2022",q:"A frase com regência verbal CORRETA é:",o:["A) O auditor aspirava o cargo de Auditor-Fiscal há anos.","B) O servidor preferiu o lançamento de ofício do que o por homologação.","C) O contribuinte informou os auditores da nova legislação tributária.","D) O fiscal assistiu o procedimento de auditoria com atenção.","E) O contribuinte pagou o tributo visando a evitar a execução fiscal."],g:"E",c:"E: 'visar a' (ter como objetivo) = correto. A: 'aspirar a' (almejar) → aspirava AO cargo. B: 'preferir' nunca rege 'do que' → preferiu ao. C: 'informar' = informou os auditores SOBRE. D: 'assistir' (ver) = assistiu AO procedimento."},
  {a:2021,r:"FCC/PGE/2021",q:"Quanto ao emprego da CRASE, é CORRETO:",o:["A) Entregou os documentos à ele, conforme solicitado.","B) Encaminhou à Receita Federal à documentação necessária.","C) Referiu-se à multa aplicada pelo fisco estadual.","D) A decisão foi contrária à implementar novas alíquotas.","E) O prazo à ser cumprido é de 30 dias."],g:"C",c:"C: crase antes de substantivo feminino ('a multa') → correta. A: antes de pronome pessoal (ele) = PROIBIDA. B: segundo 'à' antes de 'documentação' seria duplo artigo → erro. D: antes de infinitivo = PROIBIDA. E: antes de infinitivo = PROIBIDA."},
  {a:2020,r:"FCC/TRF/2020",q:"Na interpretação de textos, a COESÃO REFERENCIAL é realizada por:",o:["A) Conjunções que estabelecem relações lógico-semânticas entre orações.","B) Pronomes, sinônimos e expressões que retomam ou antecipam elementos textuais.","C) A progressão temática que garante a unidade do texto.","D) Advérbios de modo que qualificam os verbos do texto.","E) Artigos definidos que determinam os substantivos no texto."],g:"B",c:"Coesão REFERENCIAL: mecanismos de retomada (anáfora) ou antecipação (catáfora) de elementos — pronomes (ele, este, esse), sinônimos, hiperônimos, expressões nominais. Diferente de coesão SEQUENCIAL (conectivos) e coerência (sentido global)."},
  {a:2019,r:"FCC/ISS/2019",q:"O período 'Se o contribuinte tivesse pago o tributo, não teria sido autuado' expressa relação de:",o:["A) Concessão","B) Finalidade","C) Condição contrafactual (hipótese não realizada)","D) Causa e efeito no presente","E) Temporalidade"],g:"C",c:"Oração subordinada adverbial CONDICIONAL contrafactual: usa pretérito mais-que-perfeito do subjuntivo ('tivesse pago') + condicional composto ('teria sido') para indicar hipótese que NÃO se realizou no passado. A concessão usa 'embora/ainda que'. A finalidade usa 'para que/a fim de que'."},
],

"LP-2":[
  {a:2022,r:"FCC/SEFAZ/2022",q:"Identifique a frase com PONTUAÇÃO correta:",o:["A) O auditor verificou, os livros fiscais, e encontrou irregularidades.","B) O imposto, que incide sobre a circulação de mercadorias, chama-se ICMS.","C) O contribuinte declarou que; pagaria o tributo em atraso.","D) O prazo legal é; 30 dias contados da notificação.","E) A empresa: foi autuada e: multada pelo fisco estadual."],g:"B",c:"B: vírgulas corretas isolando ORAÇÃO RELATIVA EXPLICATIVA ('que incide sobre a circulação de mercadorias'). A: vírgula incorreta entre sujeito e predicado. C e D: ponto e vírgula incorreto (não separa subordinada). E: dois-pontos incorretos."},
  {a:2021,r:"FCC/TCE/2021",q:"A alternativa em que há ERRO de ortografia ou acentuação é:",o:["A) Êxito no lançamento tributário depende de prova lícita.","B) O crédito tributário foi constituído mediante auto de infração.","C) O parcelamento suspende a exigibilidade do tributo imediatamente.","D) A contribuição de melhória incide sobre obras públicas.","E) A imunidade tributária está prevista na Constituição Federal."],g:"D",c:"D: 'melhoria' (sem acento) — é paroxítona terminada em ditongo, não recebe acento. Melhoria ≠ melhória. As demais estão corretas. FCC cobra ortografia/acentuação com vocabulário jurídico-tributário."},
  {a:2020,r:"FCC/Fiscal/2020",q:"Na frase 'O Fisco realizou a auditoria no prazo legal, ao passo que o contribuinte não colaborou com a fiscalização', o conectivo 'ao passo que' estabelece relação de:",o:["A) Causa","B) Consequência","C) Concessão","D) Oposição/contraste","E) Finalidade"],g:"D",c:"'Ao passo que' = conectivo de OPOSIÇÃO/CONTRASTE (adversativo), equivale a 'enquanto', 'mas', 'ao contrário de'. Causa = porque/pois. Consequência = logo/portanto. Concessão = embora/ainda que. Finalidade = para que/a fim de."},
  {a:2019,r:"FCC/Adm/2019",q:"Em 'O contribuinte CUJO inadimplemento gerou a execução fiscal foi notificado', o pronome relativo 'cujo':",o:["A) Pode ser substituído por 'que' sem alteração de sentido.","B) Indica posse/pertencimento e concorda com o substantivo subsequente ('inadimplemento').","C) Retoma 'execução fiscal' e concorda com 'contribuinte'.","D) Funciona como pronome demonstrativo nessa oração.","E) É invariável e não admite determinante antes nem depois."],g:"B",c:"'Cujo' = pronome relativo POSSESSIVO: concorda em gênero e número com o SUBSTANTIVO QUE O SEGUE (cujo inadimplemento = masculino singular). Antecedente = contribuinte. Regra: não admite artigo antes (do/da) nem depois. Não pode ser substituído por 'que'."},
  {a:2018,r:"FCC/TRF/2018",q:"Assinale a opção com SINONÍMIA adequada ao contexto jurídico-tributário: 'A autoridade EXPURGOU o ato administrativo viciado'.",o:["A) ratificou","B) convalidou","C) anulou/invalidou","D) homologou","E) confirmou"],g:"C",c:"EXPURGAR = eliminar, extirpar, invalidar, ANULAR. No Direito Administrativo, a anulação retira o ato viciado com efeito EX TUNC (retroativo), diferente da revogação (EX NUNC, por conveniência/oportunidade). FCC cobra vocabulário jurídico em interpretação textual."},
],

"MAT-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"Capital de R$15.000 aplicado a juros compostos de 2% a.m. por 3 meses. O montante é (1,02³=1,0612):",o:["A) R$15.900,00","B) R$15.918,00","C) R$15.936,00","D) R$15.612,00","E) R$15.918,00"],g:"B",c:"M = C×(1+i)ⁿ = 15.000×1,0612 = R$15.918,00. Juros = R$918,00. Juros SIMPLES: J = 15.000×0,02×3 = 900 → M = 15.900 (A). 'Juros sobre juros' = R$18. Sempre use o fator fornecido diretamente pela FCC."},
  {a:2022,r:"FCC/Fiscal/2022",q:"Financiamento de R$60.000 em 3 parcelas pelo sistema SAC, taxa 10% a.p. O valor da 2ª prestação é:",o:["A) R$26.000","B) R$24.000","C) R$22.000","D) R$20.000","E) R$18.000"],g:"B",c:"SAC: amortização constante = 60.000/3 = R$20.000. 1ª: J=6.000+A=20.000=R$26.000 (SD=40.000). 2ª: J=4.000+A=20.000=R$24.000 ✓ (SD=20.000). 3ª: J=2.000+A=20.000=R$22.000. No SAC prestações são DECRESCENTES; no Price (francês) são CONSTANTES."},
  {a:2021,r:"FCC/TCE/2021",q:"Dados: 5, 8, 3, 12, 8, 15, 8. A MEDIANA e a MODA são:",o:["A) 8 e 8","B) 8 e 5","C) 8,43 e 8","D) 12 e 8","E) 8 e 12"],g:"A",c:"Ordenando: 3,5,8,8,8,12,15. N=7 (ímpar) → MEDIANA = 4º elemento = 8. MODA = mais frequente = 8 (3 vezes). MÉDIA = 59/7 ≈ 8,43 (C confunde média com mediana). Mediana EXIGE ordenação prévia."},
  {a:2020,r:"FCC/ISS/2020",q:"Proposições: P='Todo auditor conhece o CTN'; Q='João não conhece o CTN'. Conclui-se necessariamente:",o:["A) João não é auditor","B) João é auditor negligente","C) Nem todo auditor conhece o CTN","D) João nunca será aprovado","E) O CTN é difícil"],g:"A",c:"MODUS TOLLENS: P→Q, ¬Q ⊢ ¬P. P1: ∀x AF(x)→CTN(x). P2: ¬CTN(João). Logo: ¬AF(João). A conclusão é NECESSARIAMENTE verdadeira. C contradiz a premissa universal. B, D, E são opiniões sem fundamento lógico."},
  {a:2019,r:"FCC/Adm/2019",q:"P→Q e Q→R sendo ambas verdadeiras. Qual conclusão é necessariamente válida?",o:["A) R→P","B) ¬P→¬R","C) P→R","D) ¬R→P","E) Q↔P"],g:"C",c:"SILOGISMO HIPOTÉTICO (transitividade): P→Q e Q→R ⊢ P→R. A: conversa de P→R (não necessária). B: inversa (não necessária). D: contrapositiva de P→R seria ¬R→¬P (não ¬R→P). E: bicondicional não se deduz. FCC adora silogismo em provas fiscais."},
],

"ADM-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"O Modelo das Três Linhas (IIA 2020), a TERCEIRA LINHA corresponde a:",o:["A) Gestão operacional e proprietários do risco","B) Funções de compliance, gestão de riscos e controles","C) Auditoria interna — asseguração independente","D) Controle externo pelo TCU e órgãos reguladores","E) Alta administração e conselho de governança"],g:"C",c:"IIA 2020: 1ª LINHA = gestão operacional (day-to-day risk owners). 2ª LINHA = funções de suporte (compliance, jurídico, gestão de riscos). 3ª LINHA = AUDITORIA INTERNA (asseguração INDEPENDENTE para governança e alta administração). Acima das 3 linhas: órgãos de GOVERNANÇA e partes EXTERNAS."},
  {a:2022,r:"FCC/TCE/2022",q:"Com a Lei nº 14.230/2021, para configurar ato de improbidade administrativa é necessário:",o:["A) Culpa grave do agente público","B) Dolo específico — intenção deliberada de praticar o ato ímprobo","C) Culpa simples (negligência, imprudência ou imperícia)","D) Apenas o dano ao erário, independente do elemento subjetivo","E) Dolo genérico, prescindindo do resultado lesivo"],g:"B",c:"Lei 14.230/2021: DOLO ESPECÍFICO é imprescindível. Culpa NÃO configura mais improbidade. Legitimidade ativa: EXCLUSIVA do MP (ação popular não cabe para improbidade). Prescrição: 8 anos do fato ou 4 anos após fim do vínculo funcional."},
  {a:2021,r:"FCC/SEFAZ-BA/2021",q:"A Lei nº 14.133/2021 (Nova Lei de Licitações) criou a modalidade 'DIÁLOGO COMPETITIVO', que se aplica quando:",o:["A) O valor superar o limite do pregão eletrônico","B) Houver ao menos 5 fornecedores cadastrados","C) A Administração necessitar contratar objeto com inovação tecnológica ou solução inexistente no mercado em condições ótimas","D) O objeto for de natureza intelectual ou artística","E) A licitação for exclusivamente eletrônica"],g:"C",c:"Art. 32 Lei 14.133/2021: diálogo competitivo para (a) inovação tecnológica/técnica, (b) impossibilidade de definição prévia dos meios para satisfazer necessidades, (c) solução inexistente no mercado em condições ótimas. Administração DIALOGA com licitantes ANTES de definir o objeto."},
  {a:2020,r:"FCC/PGE/2020",q:"A Lei nº 12.527/2011 (LAI) prevê prazo de resposta ao pedido de acesso à informação de:",o:["A) 10 dias corridos, prorrogável por mais 10","B) 15 dias úteis, improrrogável","C) 20 dias corridos, prorrogável por mais 10 dias com justificativa","D) 30 dias corridos sem prorrogação","E) 20 dias úteis, prorrogável por mais 20"],g:"C",c:"LAI art. 11: 20 DIAS CORRIDOS, prorrogável por mais 10 dias mediante justificativa expressa. Sigilo: ultra-secreto = 25 anos (renovável 1x); secreto = 15 anos; reservado = 5 anos. Recurso: hierárquico → CGU → CMRI."},
  {a:2019,r:"FCC/Adm/2019",q:"Os princípios EXPRESSOS da Administração Pública no art. 37, caput, CF/88 são:",o:["A) Legalidade, razoabilidade, moralidade, publicidade e eficiência","B) Legalidade, impessoalidade, moralidade, publicidade e eficiência","C) Legalidade, legitimidade, economicidade, publicidade e eficiência","D) Supremacia, indisponibilidade, moralidade, publicidade e eficiência","E) Legalidade, proporcionalidade, moralidade, publicidade e eficiência"],g:"B",c:"LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade, Eficiência (EC 19/98). Razoabilidade/proporcionalidade = implícitos. Legitimidade + economicidade = TCU (art. 70). Supremacia + indisponibilidade = regime jurídico-admin. (implícitos). FCC cobra literalmente o art. 37."},
],

"ECO-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"Se |Ed| = 0,3, a demanda é:",o:["A) Elástica: redução de preço aumenta a receita total","B) Inelástica: aumento de preço aumenta a receita total","C) Unitária: variações de preço não afetam a receita","D) Perfeitamente inelástica: quantidade é fixa","E) Perfeitamente elástica: pequena alta zera a demanda"],g:"B",c:"|Ed|=0,3 < 1 → INELÁSTICA. Aumento de 1% no preço → queda de apenas 0,3% na quantidade. Receita TOTAL aumenta com preço mais alto. Regra de Ramsey: tributar mais bens INELÁSTICOS para minimizar perda de bem-estar. Exemplos: cigarros, combustíveis, medicamentos."},
  {a:2022,r:"FCC/Fiscal/2022",q:"A Curva de Laffer demonstra que:",o:["A) Aumentos de alíquota sempre aumentam a arrecadação","B) Existe alíquota ótima; além dela, mais tributação reduz a arrecadação","C) Arrecadação máxima ocorre com alíquota zero","D) Relação alíquota-arrecadação é sempre linear","E) Redução de alíquota garante aumento de arrecadação"],g:"B",c:"Laffer: alíquota 0% → arrecadação 0; alíquota 100% → arrecadação 0 (ninguém trabalha/declara). Ponto máximo entre esses extremos. Além do ótimo: maior alíquota → evasão, informalidade, retração → MENOS arrecadação. E: pode acontecer se estiver além do ótimo, mas NÃO é garantido."},
  {a:2021,r:"FCC/ISS/2021",q:"PIB pela ótica da DEMANDA é calculado como:",o:["A) Salários + Lucros + Juros + Aluguéis","B) Valor da Produção − Consumo Intermediário","C) C + I + G + (X − M)","D) PNB − Renda líquida enviada ao exterior","E) Consumo + Poupança + Tributos"],g:"C",c:"Ótica da DEMANDA: PIB = C (consumo famílias) + I (investimento = FBCF + ΔEstoques) + G (gastos governo) + (X−M) (exportações líquidas). Ótica da RENDA: W+L+J+A+Tributos. Ótica da PRODUÇÃO: ΣVA. As 3 óticas dão o mesmo resultado."},
  {a:2020,r:"FCC/TRF/2020",q:"A externalidade NEGATIVA (como poluição) provoca falha de mercado porque:",o:["A) O mercado produz em quantidade insuficiente","B) O custo social supera o custo privado; o mercado produz em excesso","C) As empresas não auferem lucro em atividades poluidoras","D) É um bem público que requer provisão estatal","E) O princípio do benefício exige subsídio aos poluidores"],g:"B",c:"Externalidade NEGATIVA: custo SOCIAL > custo PRIVADO. Produtor impõe custo a terceiros sem compensar. Mercado produz MAIS que o ótimo social. Solução: Imposto PIGOUVIANO (= dano marginal externo). Princípio POLUIDOR-PAGADOR. A: seria externalidade positiva. D: bem público = não rival + não excludente."},
  {a:2019,r:"FCC/Adm/2019",q:"A Regra de Ramsey, na tributação ótima, estabelece que:",o:["A) Todos os bens devem ter a mesma alíquota para garantir equidade","B) Bens com demanda mais inelástica devem ser tributados com alíquotas mais altas para minimizar o peso morto total","C) Bens de luxo devem ter alíquotas menores para estimular o consumo","D) A alíquota ótima é aquela que maximiza a arrecadação independentemente da eficiência","E) Serviços devem ser tributados mais que mercadorias"],g:"B",c:"Regra de RAMSEY (inverse elasticity rule): para minimizar a perda de bem-estar (peso morto), as alíquotas devem ser INVERSAMENTE PROPORCIONAIS às elasticidades. Bens INELÁSTICOS → alíquota MAIOR (menor distorção). Conflito com EQUIDADE: bens inelásticos geralmente são essenciais (consumidos mais pelos pobres)."},
],

"DTR-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"No CTN, a obrigação tributária ACESSÓRIA tem por objeto:",o:["A) O pagamento de tributo ou penalidade pecuniária","B) Prestações positivas ou negativas no interesse da arrecadação ou fiscalização","C) O pagamento de tributo apenas, excluídas as multas","D) A entrega de documentos em cartório competente","E) O recolhimento de tributo antes do prazo de vencimento"],g:"B",c:"Art. 113 §2º CTN: obrigação ACESSÓRIA = prestações POSITIVAS (fazer algo: emitir NF, escriturar livros) ou NEGATIVAS (não fazer: não obstruir fiscalização) no interesse da arrecadação ou fiscalização. Descumprimento → converte-se em obrigação PRINCIPAL (multa). Obrigação principal = pagar tributo OU penalidade."},
  {a:2022,r:"FCC/Fiscal/2022",q:"As causas de SUSPENSÃO da exigibilidade do crédito tributário (art. 151 CTN) são:",o:["A) Pagamento, compensação, transação, remissão e prescrição","B) Moratória, depósito integral, reclamações/recursos, liminar/tutela antecipada e parcelamento","C) Isenção, anistia e moratória","D) Decadência, prescrição e confusão","E) Parcelamento, dação em pagamento e novação"],g:"B",com:"MDRRLP: Moratória, Depósito do montante integral, Reclamações e Recursos (admin.), Liminar em MS ou Tutela Antecipada, Parcelamento. A: extinção (art. 156). C: exclusão + suspensão. D: extinção. Suspensão NÃO extingue o crédito, apenas suspende a exigibilidade."},
  {a:2021,r:"FCC/SEFAZ-GO/2021",q:"A modalidade de lançamento em que o sujeito passivo antecipa o pagamento sem prévio exame da autoridade é:",o:["A) Lançamento de ofício","B) Lançamento por declaração","C) Lançamento por homologação","D) Auto-lançamento","E) Lançamento misto"],g:"C",c:"Art. 150 CTN: LANÇAMENTO POR HOMOLOGAÇÃO (ou autolanç.) — contribuinte antecipa o pagamento SEM prévio exame. Autoridade tem 5 anos para homologar (expressa ou tácita). Prazo decadencial especial: 5 anos do FG (§4º). Com dolo/fraude/simulação: art. 173, I. Modelo: ICMS, IPI, IR, PIS/COFINS."},
  {a:2020,r:"FCC/TRF/2020",q:"A DECADÊNCIA tributária extingue:",o:["A) A pretensão de cobrar o crédito já constituído","B) O direito de a Fazenda Pública constituir o crédito tributário pelo lançamento","C) A ação de execução fiscal já ajuizada","D) O direito do contribuinte de repetir o indébito","E) A possibilidade de parcelamento do crédito em aberto"],g:"B",c:"DECADÊNCIA (art. 173): extingue o DIREITO DE LANÇAR (constituir o crédito). PRESCRIÇÃO (art. 174): extingue a pretensão de COBRAR o crédito já constituído. Regra geral da decadência: 5 anos do 1º dia do exercício seguinte. Homologação: 5 anos do FG. Decadência NÃO SE SUSPENDE nem se interrompe."},
  {a:2019,r:"FCC/SEFAZ-RJ/2019",q:"São modalidades de EXTINÇÃO do crédito tributário (art. 156 CTN):",o:["A) Moratória, depósito e parcelamento","B) Pagamento, compensação, transação, remissão, prescrição e decadência (entre outras)","C) Isenção, anistia e imunidade","D) Reclamações e recursos administrativos","E) Liminar em mandado de segurança"],g:"B",c:"Art. 156 lista 11 formas de EXTINÇÃO: pagamento; compensação; transação; remissão; prescrição; decadência; conversão de depósito em renda; pagamento antecipado + homologação (art. 150); consignação em pagamento; decisão admin. irreformável; decisão judicial passada em julgado; dação em pagamento de bens imóveis (LC 104/2001). A, D, E = SUSPENSÃO. C = EXCLUSÃO."},
],

"DTR-2":[
  {a:2023,r:"FCC/RT/2023",q:"A Emenda Constitucional nº 132/2023 criou o IBS, de competência:",o:["A) Exclusivamente federal","B) Exclusivamente estadual","C) Compartilhada entre estados, DF e municípios","D) Municipal, substituindo apenas o ISS","E) Conjunta entre União e estados"],g:"C",c:"EC 132/2023 art. 156-A CF: IBS = competência COMPARTILHADA (estados, DF e municípios). Substitui ICMS (estadual) + ISS (municipal). Administrado pelo COMITÊ GESTOR do IBS (art. 156-B). Alíquota UNIFORME, não-cumulatividade PLENA, princípio do DESTINO. Transição: 2026–2033."},
  {a:2022,r:"FCC/Fiscal/2022",q:"O Comitê Gestor do IBS (art. 156-B CF) tem as seguintes competências PRINCIPAIS:",o:["A) Fixar políticas monetárias e cambiais do país","B) Administrar, arrecadar, fiscalizar, cobrar e representar o IBS judicialmente e extrajudicialmente","C) Substituir o CONFAZ em todas as suas competências","D) Definir alíquotas do Imposto de Renda para pessoas jurídicas","E) Regulamentar o ISS em todos os municípios"],g:"B",c:"Art. 156-B CF: Comitê Gestor do IBS = administração, arrecadação, fiscalização, cobrança e representação (judicial e extrajudicial) do IBS. Colegiado com representantes de estados, DF e municípios. NÃO substitui CONFAZ integralmente. A CBS (federal) é administrada pela Receita Federal."},
  {a:2021,r:"FCC/SEFAZ/2021",q:"O princípio do DESTINO no IBS significa:",o:["A) O imposto é devido onde o bem é produzido","B) O imposto é devido no local de consumo do bem/serviço","C) A alíquota varia conforme o destino econômico do produto","D) Incide apenas sobre importações destinadas ao consumo","E) O imposto é partilhado entre origem e destino pela metade"],g:"B",c:"Princípio do DESTINO: IBS é devido no local de CONSUMO (destino), não de produção (origem). Reduz guerra fiscal pois estados 'exportadores' de riqueza recebem menos; estados 'consumidores' recebem mais. Diferença do ICMS atual (origem nas operações interestaduais). Alinha o Brasil às melhores práticas internacionais de IVA."},
  {a:2020,r:"FCC/Adm/2020",q:"A responsabilidade tributária por SUBSTITUIÇÃO distingue-se da por TRANSFERÊNCIA porque:",o:["A) Na substituição, a responsabilidade surge após o fato gerador; na transferência, antes","B) Na substituição, o responsável ocupa o lugar do contribuinte desde a origem; na transferência, a responsabilidade migra por evento posterior","C) Ambas têm o mesmo mecanismo, diferindo apenas na nomenclatura doutrinária","D) A transferência é sempre solidária; a substituição é sempre subsidiária","E) A substituição é constitucional; a transferência, inconstitucional"],g:"B",c:"SUBSTITUIÇÃO (ex: ICMS-ST): responsável ocupa lugar do contribuinte DESDE O INÍCIO da relação. TRANSFERÊNCIA: responsabilidade MIGRA de um sujeito para outro por evento posterior (morte → espólio/herdeiros; dissolução → sócios). Tipos de transferência: por solidariedade, por sucessão, de terceiros."},
  {a:2019,r:"FCC/SEFAZ-RS/2019",q:"A LC nº 87/1996 (Lei Kandir), quanto à não-cumulatividade do ICMS, prevê que o crédito de ATIVO PERMANENTE:",o:["A) Deve ser aproveitado integralmente no mês da aquisição","B) Deve ser aproveitado à razão de 1/48 por mês","C) Não gera crédito de ICMS em nenhuma hipótese","D) Gera crédito apenas para estabelecimentos industriais","E) Pode ser aproveitado em qualquer prazo, a critério do contribuinte"],g:"B",c:"Art. 20 §5º LC 87/96: ATIVO PERMANENTE → crédito à razão de 1/48 (um quarenta e oito avos) por mês. Prazo máximo: 4 anos. Se o ativo sair antes: crédito proporcional. Uso e consumo: vedado até 2033 (art. 33). Material de embalagem para industrialização: gera crédito."},
],

"LTE-1":[
  {a:2023,r:"FCC/SEFAZ-CE/2023",q:"Nos termos da Lei 18.665/2023 (ICMS-CE), o 'ICMS por dentro' significa que:",o:["A) O ICMS é calculado sobre o valor do produto excluído o tributo","B) O ICMS integra sua própria base de cálculo, elevando a alíquota efetiva","C) O ICMS incide apenas na fase interna do estabelecimento industrial","D) O recolhimento é feito antes da emissão da nota fiscal","E) O ICMS substitui tributos municipais nas operações internas"],g:"B",c:"'ICMS por dentro': art. 13 §1º I LC 87/96. Ex.: preço sem ICMS = R$82; alíquota 18% → base = 82÷(1−0,18) = R$100; ICMS = R$18. Alíquota REAL = 18/82 = 21,95% > 18% nominal. STF RE 574.706: ICMS NÃO integra base do PIS/COFINS (questão distinta)."},
  {a:2022,r:"FCC/SEFAZ-CE/2022",q:"A substituição tributária PROGRESSIVA no ICMS-CE (para frente):",o:["A) Atribui ao adquirente a responsabilidade pelo ICMS das operações anteriores","B) Atribui ao fabricante/importador (substituto) o recolhimento do ICMS de operações subsequentes","C) Foi declarada inconstitucional pelo STF","D) Dispensa emissão de nota fiscal nas operações seguintes","E) Aplica-se exclusivamente a produtos de primeira necessidade"],g:"B",c:"ST progressiva: SUBSTITUTO (fabricante/importador) recolhe ICMS das operações futuras com base em MVA ou pauta fiscal. STF RE 213.396: CONSTITUCIONAL (art. 150 §7º CF). STF RE 593.849: se FG presumido NÃO se realizar → direito à RESTITUIÇÃO. ST regressiva = diferimento (postergação do pagamento)."},
  {a:2021,r:"FCC/SEFAZ-CE/2021",q:"O ITCD do Ceará (Lei 15.812/2015) incide sobre:",o:["A) Transmissão onerosa de bens imóveis inter vivos","B) Transmissão causa mortis e doação de quaisquer bens ou direitos","C) Circulação de mercadorias no Estado do Ceará","D) Serviços de qualquer natureza prestados no município","E) Propriedade de veículos automotores registrados no Estado"],g:"B",c:"ITCD/CE (CF art. 155, I): CAUSA MORTIS (herança) e DOAÇÃO de qualquer bem (imóvel, móvel, títulos, créditos). Competência ESTADUAL. Alíquota máxima: 8% (Res. Senado 9/1992). Lei 15.812/2015-CE: alíquotas PROGRESSIVAS conforme valor da base de cálculo. ITBI (onerosa entre vivos imóveis) = municipal."},
  {a:2020,r:"FCC/SEFAZ-CE/2020",q:"O FECOP do Ceará (LC 37/2003) consiste em:",o:["A) Fundo para custeio da previdência dos servidores estaduais","B) Adicional de ICMS de até 2% sobre produtos supérfluos/prejudiciais destinado a combate à pobreza","C) Taxa cobrada sobre produtos importados do exterior","D) Contribuição de melhoria para obras de infraestrutura","E) Fundo de equalização para municípios deficitários"],g:"B",c:"FECOP = Fundo Estadual de Combate à Pobreza. LC 37/2003-CE: ADICIONAL DE ICMS de até 2% sobre operações com produtos supérfluos/prejudiciais à saúde/meio ambiente. Previsão constitucional: art. 82 ADCT (CF). Receita vinculada ao combate à pobreza e ao financiamento de ações sociais."},
  {a:2019,r:"FCC/SEFAZ-CE/2019",q:"O IPVA do Ceará (Lei 12.023/1992) tem como FATO GERADOR:",o:["A) A transmissão de propriedade de veículo automotor","B) A propriedade de veículo automotor em 1º de janeiro de cada ano","C) A circulação de veículo automotor nas rodovias estaduais","D) O licenciamento anual de veículo junto ao DETRAN","E) A importação de veículo automotor do exterior"],g:"B",c:"CF art. 155, III: IPVA = imposto ESTADUAL sobre PROPRIEDADE de veículos automotores. FG: propriedade do veículo em 1º de janeiro (base temporal). Alíquotas mínimas: fixadas pelo Senado Federal (Resolução). Base de cálculo: valor venal (tabela FIPE geralmente). CE: alíquotas diferenciadas por tipo de veículo."},
],

"COA-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"O CPC 46 (Valor Justo) classifica os dados de NÍVEL 3 como:",o:["A) Preços cotados em mercados ativos para ativos idênticos","B) Dados observáveis distintos dos preços cotados","C) Dados NÃO observáveis baseados em premissas da própria entidade","D) Taxas de desconto livres de risco observáveis no mercado","E) Preços de ativos similares ajustados por volatilidade histórica"],g:"C",c:"CPC 46/IFRS 13 — Hierarquia: Nível 1 = preços cotados mercados ativos IDÊNTICOS (maior confiabilidade). Nível 2 = dados OBSERVÁVEIS distintos (ativos similares, taxas mercado). Nível 3 = dados NÃO OBSERVÁVEIS / premissas internas (menor confiabilidade → mais disclosure). Maximizar uso de dados observáveis."},
  {a:2022,r:"FCC/SEFAZ-RS/2022",q:"No CPC 06 R2 (Arrendamento/IFRS 16), o arrendatário DEVE reconhecer, para contratos com prazo > 12 meses:",o:["A) Apenas despesa linear no resultado","B) Ativo de direito de uso + passivo de arrendamento","C) Passivo contingente nas notas explicativas","D) Ativo pelo valor de mercado apenas se prazo > 50% da vida útil","E) Receita diferida correspondente aos pagamentos futuros"],g:"B",c:"CPC 06 R2/IFRS 16: arrendatário reconhece ATIVO DE DIREITO DE USO (VP pagamentos + custos iniciais + estimativa restauração) + PASSIVO DE ARRENDAMENTO (VP pagamentos futuros). Exceções: curto prazo (≤12m) e baixo valor unitário. Extingue distinção arrendamento operacional vs financeiro para arrendatário."},
  {a:2021,r:"FCC/ISS/2021",q:"No CPC 15 (Combinações de Negócios), o GOODWILL POSITIVO ocorre quando:",o:["A) VJ líquido dos ativos/passivos identificáveis supera a contraprestação paga","B) Contraprestação + PNC + interesse previamente detido excedem o VJ líquido dos ativos/passivos","C) A adquirida tem apenas prejuízos acumulados","D) Valor patrimonial contábil supera o valor de mercado","E) Adquirida possui marca famosa não reconhecida no balanço"],g:"B",c:"CPC 15/IFRS 3: Goodwill = (Contraprestação + PNC + Interesse previamente detido) − VJ líquido ativos/passivos identificáveis. POSITIVO → ativo INTANGÍVEL (não amortizável, teste impairment ANUAL). NEGATIVO → COMPRA VANTAJOSA, reconhecida no RESULTADO imediatamente. A: descreve compra vantajosa."},
  {a:2020,r:"FCC/Adm/2020",q:"O Método de Equivalência Patrimonial (MEP/CPC 18) aplica-se a:",o:["A) Investimentos em qualquer empresa com participação superior a 1%","B) Investimentos em coligadas (influência significativa ≥20% votante) e controladas","C) Apenas investimentos em controladas com mais de 50% do capital total","D) Investimentos classificados como ativos financeiros ao valor justo","E) Todos os investimentos em empresas listadas em bolsa de valores"],g:"B",c:"CPC 18: MEP para COLIGADAS (influência significativa ≥20% capital votante, presunção, salvo prova em contrário) e CONTROLADAS (controle = poder de governar políticas). Também: joint ventures (CPC 19). O MEP atualiza o investimento pelo % de participação no PL da investida."},
  {a:2019,r:"FCC/SEFAZ-BA/2019",q:"O Ponto de Equilíbrio CONTÁBIL (PEC) é calculado como:",o:["A) PEC = Custos Fixos / Preço de Venda","B) PEC = Custos Fixos / Margem de Contribuição Unitária","C) PEC = Receita Total / Custo Total","D) PEC = Margem de Contribuição / Receita Total","E) PEC = (Custos Fixos + Lucro Desejado) / MC Unitária"],g:"B",c:"PEC = CF/MC unitária. MC = PV − CV variável unitário. Ex.: CF=400.000; PV=200; CV=120 → MC=80 → PEC=5.000 un. Verificação: 5.000×200=1.000.000; 5.000×120=600.000 CV; CF=400.000 → Lucro=0 ✓. E: seria PE Econômico (inclui custo de oportunidade no numerador)."},
],

"CGP-1":[
  {a:2023,r:"FCC/TCE/2023",q:"Os estágios da RECEITA ORÇAMENTÁRIA, na ordem correta (MCASP 11ª ed.):",o:["A) Empenho, liquidação, pagamento e recolhimento","B) Previsão, lançamento, arrecadação e recolhimento","C) Fixação, empenho, arrecadação e pagamento","D) Programação, reserva, movimentação e quitação","E) Orçamentação, cobrança, recebimento e depósito"],g:"B",c:"Receita Orçamentária: (1) PREVISÃO — constante da LOA; (2) LANÇAMENTO — art. 53 Lei 4.320: individualiza o crédito tributário; (3) ARRECADAÇÃO — pagamento ao agente arrecadador (banco); (4) RECOLHIMENTO — entrega ao Tesouro/conta única. Estágios da DESPESA: fixação, empenho, liquidação, pagamento."},
  {a:2022,r:"FCC/TCE/2022",q:"Os estágios da DESPESA ORÇAMENTÁRIA (Lei 4.320/64) são:",o:["A) Previsão, lançamento, arrecadação e recolhimento","B) Programação, reserva, empenho e pagamento","C) Fixação, empenho, liquidação e pagamento","D) Autorização, reserva, movimentação e quitação","E) Dotação, contingenciamento, empenho e liquidação"],g:"C",c:"(1) FIXAÇÃO (LOA); (2) EMPENHO (art. 58: ato que cria obrigação de pagar); (3) LIQUIDAÇÃO (art. 63: verificação direito do credor — entrega do bem/serviço); (4) PAGAMENTO (art. 64: despacho do ordenador → entrega ao credor). Empenho: ordinário, estimativo ou global."},
  {a:2021,r:"FCC/PGE/2021",q:"A NBC TSP Estrutura Conceitual classifica as características qualitativas da informação como FUNDAMENTAIS:",o:["A) Comparabilidade e verificabilidade","B) Relevância e representação fidedigna","C) Tempestividade e compreensibilidade","D) Objetividade e consistência","E) Neutralidade e prudência"],g:"B",c:"NBC TSP EC: FUNDAMENTAIS = (1) RELEVÂNCIA (valor preditivo + confirmatório + materialidade); (2) REPRESENTAÇÃO FIDEDIGNA (completa, neutra, livre de erros). DE MELHORIA: comparabilidade, verificabilidade, tempestividade, compreensibilidade. Baseada na IPSAS (International Public Sector Accounting Standards)."},
  {a:2020,r:"FCC/TCM/2020",q:"Os Restos a Pagar PROCESSADOS diferenciam-se dos NÃO PROCESSADOS porque:",o:["A) Processados apenas têm empenho realizado; não processados têm empenho e liquidação","B) Processados têm empenho E liquidação (direito verificado); não processados têm apenas empenho","C) Não processados têm prioridade de pagamento","D) Processados são cancelados automaticamente no exercício seguinte","E) Não processados só podem ser pagos mediante autorização legislativa"],g:"B",c:"RP PROCESSADOS: empenho + LIQUIDAÇÃO realizados → direito do credor verificado, o Estado deve pagar. RP NÃO PROCESSADOS: apenas empenho → a liquidação ainda não ocorreu. Art. 36 Lei 4.320: todos inscritos em 31/12. Cancelamento após 2 exercícios (regra geral). Art. 42 LRF: vedação de RP sem caixa (2 últimos quad.)."},
  {a:2019,r:"FCC/SEFAZ/2019",q:"A NBC TSP 01 (Apresentação das Demonstrações Contábeis) exige que as demonstrações contábeis do setor público incluam:",o:["A) Apenas balanço patrimonial e demonstração do resultado","B) Balanço patrimonial, demonstração das variações patrimoniais, fluxos de caixa, mutações do PL e notas explicativas","C) Somente as demonstrações previstas na Lei 4.320/64","D) Qualquer conjunto de relatórios aprovado pelo TCU","E) Apenas o Relatório Resumido de Execução Orçamentária"],g:"B",c:"NBC TSP 01 (equivale à IPSAS 1): conjunto completo inclui Balanço Patrimonial, Demonstração das Variações Patrimoniais (substituiu DRE no setor público), DFC (método direto ou indireto), Demonstração das Mutações do PL e Notas Explicativas. Complementar ao sistema Lei 4.320/64 (Balanços Orçamentário, Financeiro, Patrimonial e VFOC)."},
],

"DFI-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"Os limites de despesas com pessoal para os ESTADOS (LRF art. 19-20) são:",o:["A) 50% da RCL; Poder Executivo: 40,9%","B) 60% da RCL; Poder Executivo: 49%","C) 60% da RCL; Poder Executivo: 54%","D) 65% da RCL; Poder Executivo: 49%","E) 60% da RCL; Poder Executivo: 45%"],g:"B",c:"Estados = 60% RCL. Distribuição art. 20, I: Leg+TC=3%; Jud=6%; MP=2%; Exec=49% (total=60%). UNIÃO: 50% (Exec: 40,9%; Leg: 2,5%; Jud: 6%; MP: 0,6%; DPU: 0,024%). MUNICÍPIOS: 60% (Exec: 54%; Câm: 6%). Mnemônico: E=60/49; U=50/40,9; M=60/54."},
  {a:2022,r:"FCC/TCE/2022",q:"O art. 9º da LRF prevê a 'limitação de empenho' (contingenciamento), que é acionada:",o:["A) No início de cada exercício financeiro automaticamente","B) Bimestralmente, quando a receita não comportar o cumprimento das metas de resultado primário","C) Apenas mediante autorização legislativa do Poder Legislativo correspondente","D) Quando qualquer despesa discricionária for realizada no exercício","E) Somente por decisão do TCU em processos de controle"],g:"B",c:"Art. 9º LRF: se bimestralmente verificado que a receita NÃO COMPORTA as metas de resultado primário → Executivo (e os demais Poderes/MP) devem contingenciar empenho e movimentação financeira (30 dias). Não se aplica a despesas constitucionalmente obrigatórias (MDE, ASPS, RP processados). Cada Poder contingencia suas próprias despesas."},
  {a:2021,r:"FCC/SEFAZ/2021",q:"O Resultado Primário do Governo (conceito da LRF) é calculado como:",o:["A) Receitas totais menos despesas totais, incluindo juros","B) Receitas não financeiras menos despesas não financeiras (excluídos os juros da dívida)","C) Resultado nominal acrescido da correção monetária da dívida","D) Receitas tributárias menos despesas de pessoal apenas","E) Superávit nominal dividido pelo PIB corrente"],g:"B",c:"Resultado PRIMÁRIO = Receitas não financeiras (tributárias, patrimonial, contribuições) − Despesas não financeiras (pessoal, custeio, investimento). EXCLUI pagamento/recebimento de juros e amortizações. Mede o ESFORÇO FISCAL antes do serviço da dívida. Resultado NOMINAL = Primário − Juros nominais."},
  {a:2020,r:"FCC/TRT/2020",q:"A LDO (Lei de Diretrizes Orçamentárias) tem por finalidade PRINCIPAL:",o:["A) Autorizar a realização de despesas durante o exercício financeiro","B) Orientar a elaboração da LOA, dispor sobre metas fiscais e critérios para limitação de empenho","C) Detalhar os programas de governo do Plano Plurianual","D) Criar os fundos especiais de despesa autorizados pela CF","E) Estabelecer as prioridades para o exercício seguinte, sem conteúdo fiscal"],g:"B",c:"LDO (art. 165 §2º CF + LRF Cap. II): orienta elaboração da LOA; estabelece METAS FISCAIS (resultado primário, dívida pública); RISCOS FISCAIS (passivos contingentes, renúncias); critérios para limitação de empenho; autoriza operações de crédito por antecipação de receita; dispõe sobre política de pessoal. PPA = metas de longo prazo. LOA = autoriza despesas."},
  {a:2019,r:"FCC/SEFAZ/2019",q:"Os Créditos EXTRAORDINÁRIOS (Lei 4.320/64 art. 41, III) diferenciam-se dos demais créditos adicionais porque:",o:["A) Dependem de lei específica e autorização prévia do Poder Legislativo","B) São abertos por decreto do Executivo para despesas urgentes e imprevisíveis, com comunicação posterior ao Legislativo","C) Visam a reforçar dotações insuficientes na LOA","D) Criam novas dotações para programas não previstos no orçamento aprovado","E) Dependem de indicação de fonte de recursos para abertura"],g:"B",c:"Créditos SUPLEMENTARES: reforço de dotações existentes (LOA ou autorização legislativa + indicação de fonte). Créditos ESPECIAIS: novas dotações (LOA ou autorização legislativa + indicação de fonte). Créditos EXTRAORDINÁRIOS: despesas URGENTES E IMPREVISÍVEIS (guerra, calamidade, perturbação da ordem) → decreto executivo + comunicação imediata ao Legislativo → sem indicação prévia de fonte."},
],

"FLD-1":[
  {a:2023,r:"FCC/TI/2023",q:"A cláusula HAVING em SQL:",o:["A) Filtra linhas individuais antes do agrupamento","B) Filtra GRUPOS após o agrupamento por GROUP BY","C) Ordena os resultados em ordem crescente","D) Define quais colunas serão retornadas na consulta","E) Substitui a cláusula WHERE quando há funções de agregação nas condições das linhas"],g:"B",c:"HAVING filtra GRUPOS após GROUP BY. Pode usar funções de agregação (SUM, COUNT, AVG, MAX, MIN). WHERE filtra LINHAS antes do agrupamento — NÃO pode usar agregação. Ordem de execução SQL: FROM→JOIN→WHERE→GROUP BY→HAVING→SELECT→DISTINCT→ORDER BY→LIMIT."},
  {a:2022,r:"FCC/Analista/2022",q:"Em arquitetura de dados, o Data Lakehouse combina:",o:["A) Apenas dados estruturados relacionais com alta performance","B) O armazenamento flexível do Data Lake com transações ACID e performance analítica do Data Warehouse","C) Processamento exclusivo em tempo real com baixa latência","D) Banco de dados operacional com Data Mart departamental","E) Armazenamento em nuvem com processamento on-premises"],g:"B",c:"Data LAKE: dados brutos (structured/unstructured/semi), schema-on-read, barato, flexível. Data WAREHOUSE: dados curados, schema-on-write, performance BI, caro. Data LAKEHOUSE (Delta Lake, Apache Iceberg): ACID transactions + schema enforcement + performance analítica + armazenamento barato = melhor dos 2 mundos."},
  {a:2021,r:"FCC/TI/2021",q:"A base legal da LGPD que autoriza o tratamento de dados pelo Fisco estadual para fiscalização tributária é:",o:["A) Consentimento do titular","B) Legítimo interesse do controlador","C) Cumprimento de obrigação legal ou regulatória","D) Execução de contrato","E) Proteção da vida do titular"],g:"C",c:"Art. 7º, II LGPD: 'cumprimento de obrigação legal ou regulatória pelo controlador'. Fiscalização tributária é OBRIGAÇÃO LEGAL (CTN art. 194). Não precisa de consentimento do contribuinte. Sigilo fiscal: art. 198-199 CTN protege dados de terceiros. DPO = Encarregado (LGPD): ponto de contato entre controlador e titular/ANPD."},
  {a:2020,r:"FCC/Analista TI/2020",q:"O processo ETL (Extract, Transform, Load) na engenharia de dados:",o:["A) Extrai dados de uma única fonte para análise em tempo real","B) Extrai dados de múltiplas fontes, os transforma (limpeza, padronização) e carrega em repositório centralizado","C) Apenas encripta dados sensíveis para armazenamento seguro","D) Cria backups automáticos de bancos de dados operacionais","E) Monitora a qualidade dos dados após o carregamento no DW"],g:"B",c:"ETL: (E) EXTRACT — coleta de múltiplas fontes heterogêneas (BD relacionais, APIs, arquivos); (T) TRANSFORM — limpeza, padronização, enriquecimento, agregação, deduplicação; (L) LOAD — carregamento no DW/DM/Lakehouse. ELT: carga primeiro, transformação depois (cloud com alto poder). Pipelines modernos usam ferramentas como Apache Spark, dbt, Airflow."},
  {a:2019,r:"FCC/Analista/2019",q:"Em SQL, o JOIN que retorna TODOS os registros da tabela da esquerda, mesmo sem correspondência na tabela da direita, é:",o:["A) INNER JOIN","B) RIGHT JOIN","C) LEFT JOIN","D) FULL OUTER JOIN","E) CROSS JOIN"],g:"C",c:"LEFT JOIN (LEFT OUTER JOIN): retorna TODOS os registros da tabela ESQUERDA + registros correspondentes da direita (NULL quando não há correspondência). RIGHT JOIN: inverso. INNER JOIN: apenas registros com correspondência em AMBAS. FULL OUTER JOIN: todos os registros de ambas (NULLs onde não há correspondência). CROSS JOIN: produto cartesiano."},
],

"FPB-1":[
  {a:2023,r:"FCC/Fiscal/2023",q:"As três funções clássicas do governo (Musgrave) são:",o:["A) Arrecadação, fiscalização e redistribuição","B) Alocativa, distributiva e estabilizadora","C) Regulatória, tributária e redistributiva","D) Planejamento, execução e controle orçamentário","E) Produção de bens públicos, monopólio natural e provisão de externalidades"],g:"B",c:"Musgrave (1959): (1) ALOCATIVA: provisão de bens públicos, correção de falhas de mercado (externalidades, bens públicos, monopólios naturais, assimetria de informação); (2) DISTRIBUTIVA: redução da desigualdade (impostos progressivos, transferências, subsídios); (3) ESTABILIZADORA: manutenção do emprego, estabilidade de preços e crescimento (política fiscal anticíclica)."},
  {a:2022,r:"FCC/Fiscal/2022",q:"Os bens públicos PUROS caracterizam-se pela combinação de:",o:["A) Rivalidade e exclusão (como mercadorias privadas)","B) Não rivalidade e não exclusão → problema do free rider","C) Rivalidade e não exclusão","D) Não rivalidade e exclusão","E) Alta rivalidade e exclusão parcial"],g:"B",c:"Bem público PURO: NÃO RIVAL (consumo por A não reduz disponibilidade para B) + NÃO EXCLUDENTE (impossível excluir quem não paga). → FREE RIDER: ninguém paga voluntariamente → mercado FALHA → Estado deve prover. Exemplos: defesa nacional, iluminação pública (inteiro), farol marítimo. Bem misto: congestionável (não excludente + rival acima de certo uso) → pedágio resolve o problema."},
  {a:2021,r:"FCC/TCE/2021",q:"O Resultado Fiscal PRIMÁRIO positivo (superávit primário) indica que:",o:["A) O governo pagou todos os juros da dívida sem incorrer em déficit nominal","B) As receitas não financeiras superaram as despesas não financeiras ANTES do pagamento de juros","C) A dívida pública total necessariamente diminuiu no período","D) O resultado nominal também é positivo no mesmo período","E) O governo não contraiu novas dívidas no exercício"],g:"B",c:"Superávit PRIMÁRIO = esforço fiscal ANTES dos juros. Indica que o governo gera recursos para servir a dívida. Pode existir SUPERÁVIT PRIMÁRIO com DÉFICIT NOMINAL (quando juros > superávit). A dívida pode crescer mesmo com superávit primário se os juros nominais forem altos. C: não necessariamente (juros nominais podem superar o superávit)."},
  {a:2020,r:"FCC/Economista/2020",q:"A externalidade POSITIVA, como a vacinação, gera falha de mercado porque:",o:["A) O mercado produz em excesso, exigindo tributação pigouviana","B) O mercado produz em quantidade INSUFICIENTE (custo social < custo privado); o governo deve subsidiar ou prover diretamente","C) A vacinação é um bem público puro não passível de provisão privada","D) Gera poder de monopólio para o produtor","E) A assimetria de informação impede a formação de preços eficientes"],g:"B",c:"Externalidade POSITIVA: benefício SOCIAL > benefício PRIVADO. Agente não captura todo o benefício gerado → produz MENOS que o ótimo social. Solução: SUBSÍDIO (= benefício marginal externo) ou provisão pública direta. Exemplos: vacinação, educação, pesquisa básica. Vacinação: bem rival + excludente, mas com externalidade positiva (≠ bem público puro)."},
  {a:2019,r:"FCC/Economista/2019",q:"A NFSP nominal (Necessidade de Financiamento do Setor Público) é calculada como:",o:["A) Resultado Primário − Juros Reais","B) Déficit Primário + Juros Nominais (ou −Superávit Primário + Juros Nominais)","C) Total de receitas − total de despesas no exercício","D) Variação da dívida líquida − correção monetária","E) Déficit operacional + variação cambial da dívida"],g:"B",c:"NFSP NOMINAL = Déficit Primário + Juros Nominais (ou: −Resultado Primário + Juros Nominais). Conceito OPERACIONAL exclui variação inflacionária. Conceito PRIMÁRIO exclui todos os juros. A NFSP nominal mede a VARIAÇÃO DA DÍVIDA LÍQUIDA do setor público. Quando positiva: dívida aumenta; quando negativa: dívida cai."},
],

"DCO-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"No controle CONCENTRADO de constitucionalidade (STF), os EFEITOS da decisão na ADI são:",o:["A) Inter partes e ex nunc","B) Erga omnes, ex tunc e vinculante","C) Inter partes e ex tunc","D) Erga omnes e ex nunc apenas","E) Vinculante apenas para a administração pública"],g:"B",c:"ADI/ADC/ADPF: efeitos ERGA OMNES (para todos), EX TUNC (retroativo, salvo modulação temporal), VINCULANTE (para todos os órgãos do Poder Judiciário e Administração Pública direta e indireta, excetuado o STF e o Poder Legislativo em sua função legiferante). Modulação temporal: 2/3 do STF podem fixar momento de início dos efeitos."},
  {a:2022,r:"FCC/TCE/2022",q:"A ADPF (Arguição de Descumprimento de Preceito Fundamental) é cabível para:",o:["A) Qualquer lei federal em face da CF","B) Atos do poder público que violem preceitos fundamentais, inclusive atos normativos anteriores à CF/88 (pré-constitucionais)","C) Apenas leis municipais em face da CF","D) Contratos administrativos viciados em face da lei","E) Atos de particulares que atentem contra direitos fundamentais"],g:"B",c:"ADPF (Lei 9.882/1999): cabível para atos do poder público (normativos ou não) que violem PRECEITOS FUNDAMENTAIS da CF. Tem caráter SUBSIDIÁRIO (quando não houver outro meio eficaz). Grande utilidade: leis PRÉ-CONSTITUCIONAIS (que não cabe ADI) e atos municipais. STF define 'preceito fundamental': princípios sensíveis, cláusulas pétreas, direitos fundamentais."},
  {a:2021,r:"FCC/PGE/2021",q:"A Súmula Vinculante (CF art. 103-A) produz efeito vinculante para:",o:["A) Apenas o STF e os Tribunais Superiores","B) Todos os órgãos do Poder Judiciário e a Administração Pública direta e indireta","C) Apenas a Administração Pública federal","D) Todos os órgãos, inclusive o Poder Legislativo em sua função legiferante","E) Apenas as instâncias inferiores ao STF"],g:"B",c:"CF art. 103-A: Súmula Vinculante aprovada por 2/3 do STF (8 ministros). Vincula: TODOS os órgãos do Poder Judiciário E a Administração Pública DIRETA E INDIRETA (federal, estadual, distrital e municipal). NÃO vincula: o próprio STF (pode revisar) e o Poder Legislativo em sua função típica de legislar (não pode 'engessá-lo')."},
  {a:2020,r:"FCC/ISS/2020",q:"Os direitos fundamentais previstos no art. 5º CF têm como regra:",o:["A) Aplicabilidade diferida, dependendo de regulamentação legal","B) Aplicabilidade imediata (§1º do art. 5º)","C) Aplicabilidade condicionada ao interesse público","D) Caráter programático, sem eficácia direta","E) Aplicabilidade apenas para pessoas físicas brasileiras natas"],g:"B",c:"Art. 5º §1º CF: 'As normas definidoras dos direitos e garantias fundamentais têm aplicação IMEDIATA.' Normas de EFICÁCIA PLENA (aplicam-se de imediato, sem restrições). Normas CONTIDAS: plena, mas podem ser restringidas por lei. Normas LIMITADAS/PROGRAMÁTICAS: dependem de lei para produzir todos os efeitos (normas sociais, econômicas). A aplicabilidade imediata é a regra para os direitos fundamentais."},
  {a:2019,r:"FCC/TRF/2019",q:"No controle DIFUSO de constitucionalidade:",o:["A) O STF é o único órgão competente para realizar o controle","B) Qualquer juiz ou tribunal pode declarar a inconstitucionalidade, mas os efeitos são inter partes e ex tunc","C) Os efeitos são erga omnes e vinculantes, como no controle concentrado","D) A decisão dispensa o pronunciamento do Senado para produzir efeitos amplos","E) Só cabe quando inexistir ação direta adequada no STF"],g:"B",c:"Controle DIFUSO (incidental, concreto): qualquer juiz/tribunal pode afastar a norma inconstitucional. Efeitos: INTER PARTES (só entre as partes do processo) + EX TUNC (retroativo). Para ampliar os efeitos: Senado suspende execução (art. 52, X CF) → efeito ERGA OMNES E EX NUNC (prospectivo). Tese da 'mutação constitucional': alguns doutrinadores propõem que a decisão do STF em recurso extraordinário já tenha efeito erga omnes."},
],

"DAD-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"O ato administrativo praticado com VÍCIO DE COMPETÊNCIA (agente sem atribuição legal) é:",o:["A) Anulável, podendo ser convalidado se não causar prejuízo","B) Nulo, sem possibilidade de convalidação","C) Inexistente, não produzindo nenhum efeito","D) Revogável pela conveniência e oportunidade","E) Válido se ratificado pelo agente competente em determinados casos"],g:"E",c:"Ato praticado por agente INCOMPETENTE (vício de competência): pode ser CONVALIDADO/RATIFICADO pelo agente competente, SALVO quando a competência for EXCLUSIVA ou quando houver incompetência em razão da MATÉRIA. A competência em razão da pessoa (hierarquia) → admite ratificação. Nulidade absoluta: vício de forma essencial, objeto ilícito, finalidade viciada, motivo inexistente."},
  {a:2022,r:"FCC/TCE/2022",q:"A IMPROBIDADE ADMINISTRATIVA (Lei 8.429/1992 c/c Lei 14.230/2021) exige, quanto ao elemento subjetivo:",o:["A) Culpa grave do agente público ou do particular","B) Dolo específico em todas as modalidades de ato ímprobo","C) Apenas negligência na gestão pública","D) Dolo genérico (intenção de praticar o ato)","E) Responsabilidade objetiva do agente público"],g:"B",c:"Lei 14.230/2021: DOLO ESPECÍFICO imprescindível em todas as modalidades. Culpa NÃO configura mais improbidade (revogou dispositivos de improbidade culposa). Legitimidade ativa: EXCLUSIVA do MP. Prescrição: 8 anos do FG ou 4 anos após fim do vínculo. Sanções: suspensão de direitos políticos, multa, proibição de contratar com o poder público."},
  {a:2021,r:"FCC/PGE/2021",q:"A RESPONSABILIDADE CIVIL OBJETIVA do Estado (CF art. 37 §6º) aplica-se:",o:["A) Apenas aos atos dolosos de agentes públicos","B) Aos atos COMISSIVOS dos agentes públicos, sem necessidade de culpa ou dolo","C) Apenas para danos causados a funcionários do próprio órgão","D) Somente quando houver prévia condenação criminal do agente","E) Apenas às pessoas jurídicas de direito público, excluídas as de direito privado prestadoras de serviço público"],g:"B",c:"CF art. 37 §6º: responsabilidade objetiva (teoria do RISCO ADMINISTRATIVO) para atos COMISSIVOS: Estado responde independentemente de culpa. Elementos: conduta + dano + nexo causal. Para atos OMISSIVOS: divergência doutrinária — STF tem decidido pela responsabilidade OBJETIVA para omissões específicas (dever legal de agir). Direito de REGRESSO contra agente se houver dolo ou culpa."},
  {a:2020,r:"FCC/ISS/2020",q:"Os SERVIÇOS PÚBLICOS podem ser delegados a particulares mediante:",o:["A) Apenas contrato de concessão comum (Lei 8.987/95)","B) Concessão comum (Lei 8.987/95), PPP (Lei 11.079/2004) e permissão de serviço público","C) Exclusivamente por autorização administrativa discricionária","D) Apenas parcerias com OSC (Lei 13.019/2014)","E) Qualquer dos instrumentos acima indistintamente, por escolha discricionária"],g:"B",c:"Formas de delegação de serviços públicos: (1) CONCESSÃO COMUM (Lei 8.987/95): risco do concessionário, contrato bilateral; (2) PPP PATROCINADA: concessão com contraprestação pecuniária do poder público (> R$20M); (3) PPP ADMINISTRATIVA: Estado é usuário/pagador (> R$20M); (4) PERMISSÃO: caráter precário, intuitu personae, licitação obrigatória. Diferente de AUTORIZAÇÃO (uso de bem público, unilateral, precária)."},
  {a:2019,r:"FCC/SEFAZ/2019",q:"A Organização Administrativa brasileira distingue DESCENTRALIZAÇÃO de DESCONCENTRAÇÃO porque:",o:["A) Descentralização é a distribuição interna de competências; desconcentração é a criação de pessoa jurídica nova","B) Desconcentração é a distribuição interna de competências dentro da mesma PJ; descentralização é a transferência para outra PJ","C) Ambas envolvem criação de novos órgãos com personalidade jurídica própria","D) Descentralização implica hierarquia; desconcentração, tutela/supervisão","E) Desconcentração é sempre territorial; descentralização é sempre funcional"],g:"B",c:"DESCONCENTRAÇÃO: distribuição INTERNA de competências dentro da MESMA pessoa jurídica → cria ÓRGÃOS (ministérios, secretarias). Mantém HIERARQUIA. DESCENTRALIZAÇÃO: transferência de competências para OUTRA pessoa jurídica (administração indireta: autarquias, fundações, EP, SEM) ou particular (delegação). Vinculação por TUTELA/SUPERVISÃO (sem hierarquia). Descentralização territorial: municípios, estados."},
],

"DCI-1":[
  {a:2023,r:"FCC/SEFAZ/2023",q:"Os crimes contra a ORDEM TRIBUTÁRIA (Lei 8.137/1990) praticados por PARTICULAR:",o:["A) Prescindium de dolo; a simples omissão fiscal configura o crime","B) São materiais, exigindo lançamento definitivo para consumação (STF Súmula Vinculante 24)","C) Prescrevem em 3 anos, contados do fato gerador","D) Incluem o mero inadimplemento do tributo declarado","E) São exclusivamente de ação penal pública condicionada"],g:"B",c:"STF Súmula Vinculante 24: 'Não se tipifica crime material contra a ordem tributária, previsto no art. 1º, incisos I a IV, da Lei 8.137/90, antes do lançamento DEFINITIVO do tributo.' Crimes MATERIAIS: arts. 1º e 2º da Lei 8.137/90. Mero inadimplemento NÃO é crime (apenas cível/administrativo). STJ discute se inadimplemento CONTUMAZ do ICMS declarado configura estelionato (art. 2º, II)."},
  {a:2022,r:"FCC/TRF/2022",q:"O crime de LAVAGEM DE DINHEIRO (Lei 9.613/1998) ocorre quando:",o:["A) Há evasão fiscal superior a R$5 milhões","B) Bens, direitos ou valores provenientes de INFRAÇÃO PENAL são objeto de operações para ocultar ou dissimular sua origem","C) Pessoa jurídica deixa de recolher contribuições previdenciárias","D) Funcionário público aceita vantagem indevida em razão de cargo","E) Empresa realiza exportação fictícia para obter créditos de ICMS"],g:"B",c:"Lei 9.613/1998 (redação dada pela Lei 12.683/2012): lavagem = ocultar ou dissimular natureza, origem, localização, movimentação de bens/direitos/valores provenientes de INFRAÇÃO PENAL (qualquer crime ou contravenção — lei passou a adotar a teoria do ALL CRIMES). 3 fases: colocação (placement), dissimulação (layering), integração. Pena: 3 a 10 anos + multa."},
  {a:2021,r:"FCC/PGE/2021",q:"A Lei Anticorrupção (Lei 12.846/2013) responsabiliza:",o:["A) Apenas pessoas físicas por atos contra a administração pública","B) Pessoas jurídicas objetivamente por atos lesivos à administração pública nacional e estrangeira","C) Somente servidores públicos por atos de improbidade","D) Pessoas jurídicas apenas quando condenadas criminalmente","E) Apenas empresas transnacionais com sede no Brasil"],g:"B",c:"Lei 12.846/2013: responsabilidade OBJETIVA das PESSOAS JURÍDICAS por atos lesivos à administração pública nacional ou ESTRANGEIRA. Independe de dolo ou culpa da empresa. Sanções: multa (0,1% a 20% do faturamento bruto ou até R$60M), dissolução compulsória, publicação da condenação. Acordo de Leniência: reduz sanções em troca de colaboração."},
  {a:2020,r:"FCC/ISS/2020",q:"No Direito Civil, a PRESCRIÇÃO extingue:",o:["A) O direito subjetivo em si (direito material)","B) A pretensão — o direito de exigir judicialmente o cumprimento de obrigação","C) O negócio jurídico defeituoso por vício de consentimento","D) Os contratos com prazo determinado após o vencimento","E) O direito potestativo de desfazer negócio jurídico"],g:"B",c:"PRESCRIÇÃO: extingue a PRETENSÃO (direito de ação para exigir o cumprimento). O direito subjetivo PERSISTE, mas torna-se desprovido de ação. DECADÊNCIA: extingue o próprio direito potestativo (constitutivo, desconstitutivo ou declaratório). Prescrição pode ser renunciada e interrompida/suspensa. Decadência legal = irrenunciável, pode ser conhecida de ofício."},
  {a:2019,r:"FCC/TRT/2019",q:"No Direito Penal, o CRIME FORMAL (ou de consumação antecipada) caracteriza-se por:",o:["A) Exigir resultado naturalístico para consumação","B) Consumar-se com a prática da conduta, independentemente do resultado naturalístico buscado","C) Ser consumado apenas por funcionário público","D) Exigir pelo menos dois agentes para a prática","E) Depender de condição objetiva de punibilidade para consumar-se"],g:"B",c:"Crime FORMAL: consumação NÃO exige o resultado naturalístico (que pode ou não ocorrer). O tipo prevê o resultado, mas ele não é necessário para consumação. Ex.: extorsão (basta a exigência); ameaça; calúnia. Crime MATERIAL: exige resultado naturalístico (homicídio). Crime DE MERA CONDUTA: não prevê resultado naturalístico (violação de domicílio)."},
],

};

// ─── DADOS COMPLETOS: DISCIPLINAS + TÓPICOS + RESUMOS ─
const DISC = [
{
  nome:"Língua Portuguesa", cor:"#84cc16", icon:"📝", peso:"10Q",
  topicos:[
    {
      id:"LP-1",
      titulo:"Concordância, Regência, Crase e Morfossintaxe",
      resumo:`🎯 O QUE É ISSO?
Concordância e regência são as "regras de convívio" entre as palavras na frase. A FCC adora cobrar situações que parecem certas mas são erradas — ou vice-versa.

📌 CONCORDÂNCIA VERBAL — Casos especiais:
• HAVER (existir), FAZER (tempo), SER (hora/data) → SEMPRE IMPESSOAL (singular)
  ✅ "Houve irregularidades" (NUNCA "houveram")
  ✅ "Faz 10 anos que..." (NUNCA "fazem")
• MAIORIA DE + plural → padrão FCC = SINGULAR
  ✅ "A maioria dos auditores aprovou"
• Sujeito composto POSPOSTO → pode ficar no singular com o mais próximo
  ✅ "Chegou o auditor e o contador"

📌 REGÊNCIA VERBAL — Os que a FCC mais cobra:
• Aspirar (almejar) → rege A: "aspirava AO cargo"
• Visar (objetivar) → rege A: "visando A evitar"
• Assistir (ver) → rege A: "assistiu AO julgamento"
• Preferir → nunca "do que": "preferiu A" ou "em relação a"
• Informar → "informou SOBRE o crédito" (não "informou do")

📌 CRASE:
• OBRIGATÓRIA: antes de substantivos femininos com preposição A
  ✅ "Encaminhou à Receita Federal"
• PROIBIDA: antes de masculinos, verbos, pronomes pessoais, "uma"
  ❌ "Entregou à ele" → ERRADO (pronome pessoal)
  ❌ "Visando à implementar" → ERRADO (infinitivo)
• FACULTATIVA: antes de pronomes possessivos femininos (à sua, à minha)

💡 DICA FCC: Sempre que ver HAVER ou FAZER em questão de concordância, suspeite — a resposta provavelmente envolve o uso impessoal.`,
      links:[{l:"Gramática Concordância",u:"https://www.google.com/search?q=concordancia+verbal+FCC+casos+especiais+haver+fazer"},{l:"Regência Verbal",u:"https://www.google.com/search?q=regencia+verbal+FCC+concurso+fiscal"}],
      yt:[{l:"Concordância Verbal FCC",u:"https://www.youtube.com/results?search_query=concordancia+verbal+FCC+impessoal+haver+fazer+concurso"},{l:"Regência Verbal Completa",u:"https://www.youtube.com/results?search_query=regencia+verbal+FCC+aspirar+visar+assistir+concurso"}]
    },
    {
      id:"LP-2",
      titulo:"Interpretação, Coesão, Pontuação e Ortografia",
      resumo:`🎯 O QUE É ISSO?
A FCC mistura questões de gramática dentro de textos, exigindo que você interprete E aplique regras ao mesmo tempo. Interpretação vale ~22% das questões de Português.

📌 COESÃO TEXTUAL:
• REFERENCIAL: pronomes, sinônimos, hiperônimos que RETOMAM ou ANTECIPAM elementos
  Ex.: "O auditor lavrou o auto. Ele (=o auditor) o assinou."
• SEQUENCIAL: conectivos que estabelecem relações lógicas entre orações
  - Causa: porque, pois, visto que
  - Concessão: embora, ainda que, apesar de
  - Condição: se, caso, desde que
  - Oposição/contraste: mas, porém, ao passo que, contudo
  - Finalidade: para que, a fim de que

📌 PONTUAÇÃO — O que a FCC mais cobra:
• Oração relativa EXPLICATIVA → sempre entre vírgulas
  ✅ "O ICMS, que é imposto estadual, incide sobre mercadorias."
• NUNCA vírgula entre sujeito e verbo: ❌ "O contribuinte, pagou o tributo."
• Ponto e vírgula: separa itens de enumeração e orações coordenadas longas

📌 TIPOS DE DISCURSO:
• Direto: fala literal entre aspas ("O contribuinte disse: 'pagarei o tributo'")
• Indireto: narração da fala sem aspas ("O contribuinte disse que pagaria")
• Indireto livre: mistura, sem marca clara de narrador/personagem

💡 DICA FCC: Questões de interpretação pedem INFERÊNCIA (o que o texto permite concluir, não o que está explicitamente dito). Cuidado com alternativas que exageram ou generalizam o que o texto diz.`,
      links:[{l:"Coesão Textual",u:"https://www.google.com/search?q=coesao+textual+referencial+sequencial+FCC+concurso"},{l:"Pontuação Avançada",u:"https://www.google.com/search?q=pontuacao+oracao+relativa+virgula+FCC"}],
      yt:[{l:"Interpretação de Texto FCC",u:"https://www.youtube.com/results?search_query=interpretacao+texto+FCC+inferencia+concurso+fiscal"},{l:"Coesão e Coerência Textual",u:"https://www.youtube.com/results?search_query=coesao+coerencia+textual+FCC+concurso"}]
    },
  ]
},
{
  nome:"Matemática Financeira, Estatística e Raciocínio Lógico", cor:"#06b6d4", icon:"🔢", peso:"12Q",
  topicos:[
    {
      id:"MAT-1",
      titulo:"Juros Simples e Compostos — SAC e Price",
      resumo:`🎯 O QUE É ISSO?
A FCC cobra cálculo numérico direto. Você precisa saber as fórmulas de cor e aplicar rapidamente.

📌 JUROS SIMPLES:
Fórmula: J = C × i × n | M = C × (1 + i×n)
• Rendimento LINEAR (mesma quantia a cada período)
• Ex.: C=10.000, i=2%a.m., n=3 → J=600 → M=10.600

📌 JUROS COMPOSTOS:
Fórmula: M = C × (1+i)ⁿ
• Rendimento EXPONENCIAL ("juros sobre juros")
• FCC sempre fornece o fator (ex: 1,02³ = 1,0612)
• Ex.: M = 10.000 × 1,0612 = 10.612

📌 SISTEMA SAC (Amortização Constante):
• Amortização = PV ÷ n (CONSTANTE a cada período)
• Juros = saldo devedor × i (DECRESCENTES)
• Prestação = amortização + juros (DECRESCENTE)
• Ex.: PV=60.000, n=3, i=10%:
  1ª: J=6.000 + A=20.000 = R$26.000 (SD=40.000)
  2ª: J=4.000 + A=20.000 = R$24.000 (SD=20.000)
  3ª: J=2.000 + A=20.000 = R$22.000

📌 SISTEMA PRICE (Francês):
• Prestações CONSTANTES
• Juros DECRESCENTES + amortização CRESCENTE
• Custo total MAIOR que o SAC
• Use a tabela de fatores ou HP-12C

💡 DICA FCC: Em questões de SAC, monte a tabela linha por linha. Em juros compostos, use o fator fornecido diretamente — não tente calcular sem ele.`,
      links:[{l:"Calculadora Juros",u:"https://www.calculador.com.br/calculo/juros-compostos"},{l:"SAC vs Price",u:"https://www.google.com/search?q=sistema+SAC+Price+diferenca+matematica+financeira+concurso"}],
      yt:[{l:"Juros Compostos — FCC",u:"https://www.youtube.com/results?search_query=juros+compostos+FCC+matematica+financeira+concurso+fiscal"},{l:"SAC e Price — Tabela Completa",u:"https://www.youtube.com/results?search_query=sistema+SAC+Price+amortizacao+matematica+financeira+FCC"}]
    },
    {
      id:"MAT-1-b",
      titulo:"Estatística Descritiva e Probabilidade",
      resumo:`🎯 O QUE É ISSO?
A FCC cobra cálculo de medidas estatísticas e interpretação de gráficos/tabelas. Questões diretas, exigem cuidado com a ordenação dos dados.

📌 MEDIDAS DE POSIÇÃO:
• MÉDIA ARITMÉTICA: soma ÷ n
• MEDIANA: valor central após ORDENAR os dados
  - n ímpar → posição (n+1)/2
  - n par → média das posições n/2 e n/2+1
• MODA: valor que MAIS APARECE (pode ser amodal, bimodal, etc.)
• QUARTIS: dividem os dados em 4 partes iguais (Q1=25%, Q2=50%=mediana, Q3=75%)

📌 MEDIDAS DE DISPERSÃO:
• AMPLITUDE: máximo − mínimo
• VARIÂNCIA: média dos quadrados dos desvios
• DESVIO-PADRÃO: √variância (mesma unidade dos dados)

📌 PROBABILIDADE:
• P(A) = casos favoráveis ÷ casos possíveis
• P(A∪B) = P(A) + P(B) − P(A∩B) [adição]
• P(A∩B) = P(A) × P(B|A) [multiplicação]
• Eventos INDEPENDENTES: P(A∩B) = P(A) × P(B)
• Complementar: P(A') = 1 − P(A)

📌 ANÁLISE COMBINATÓRIA:
• Combinação: C(n,k) = n! ÷ [k!(n-k)!]
• Arranjo: A(n,k) = n! ÷ (n-k)!
• Permutação: P(n) = n!

💡 DICA FCC: Questão de mediana? SEMPRE ordene os dados antes de responder. Confundir mediana com média é o erro mais comum.`,
      links:[{l:"Estatística Descritiva",u:"https://www.google.com/search?q=estatistica+descritiva+mediana+moda+media+FCC+concurso"},{l:"Probabilidade Básica",u:"https://www.google.com/search?q=probabilidade+FCC+concurso+fiscal"}],
      yt:[{l:"Estatística para Concursos",u:"https://www.youtube.com/results?search_query=estatistica+descritiva+media+mediana+moda+FCC+concurso"},{l:"Probabilidade FCC",u:"https://www.youtube.com/results?search_query=probabilidade+combinatoria+FCC+concurso+fiscal"}]
    },
    {
      id:"MAT-1-c",
      titulo:"Raciocínio Lógico — Proposições e Argumentos",
      resumo:`🎯 O QUE É ISSO?
Lógica formal avalia a VALIDADE de raciocínios. A FCC cobra argumentos dedutivos clássicos e análise de proposições lógicas.

📌 CONECTIVOS LÓGICOS:
• Conjunção: p ∧ q (E) → verdadeira apenas se ambas verdadeiras
• Disjunção: p ∨ q (OU) → falsa apenas se ambas falsas
• Condicional: p → q (SE p ENTÃO q) → falsa apenas se p=V e q=F
• Bicondicional: p ↔ q → verdadeira se ambas têm mesmo valor
• Negação: ¬p → inverte o valor verdade

📌 FORMAS DE ARGUMENTOS VÁLIDOS:
• MODUS PONENS: p→q, p ⊢ q
  "Se é auditor, conhece CTN. É auditor. Logo, conhece CTN."
• MODUS TOLLENS: p→q, ¬q ⊢ ¬p
  "Se é auditor, conhece CTN. Não conhece CTN. Logo, NÃO é auditor."
• SILOGISMO HIPOTÉTICO: p→q, q→r ⊢ p→r
  "Se A então B. Se B então C. Logo, se A então C."
• DILEMA: p→r, q→r, p∨q ⊢ r

📌 EQUIVALÊNCIAS IMPORTANTES:
• Contrapositiva: p→q ≡ ¬q→¬p
• Negação de condicional: ¬(p→q) ≡ p∧¬q
• De Morgan: ¬(p∧q) ≡ ¬p∨¬q | ¬(p∨q) ≡ ¬p∧¬q

📌 SENTENÇAS COM QUANTIFICADORES:
• "Todo A é B" = universal → negação = "Algum A não é B"
• "Algum A é B" = existencial → negação = "Nenhum A é B"

💡 DICA FCC: Modus Tollens é o mais cobrado. Sempre identifique: (1) qual é a condicional, (2) qual é a negação do consequente, (3) conclua a negação do antecedente.`,
      links:[{l:"Lógica Proposicional",u:"https://www.google.com/search?q=logica+proposicional+modus+tollens+silogismo+FCC+concurso"},{l:"Tabelas Verdade",u:"https://www.google.com/search?q=tabela+verdade+conectivos+logicos+concurso+fiscal"}],
      yt:[{l:"Raciocínio Lógico FCC",u:"https://www.youtube.com/results?search_query=raciocinio+logico+FCC+modus+tollens+silogismo+concurso"},{l:"Proposições e Argumentos",u:"https://www.youtube.com/results?search_query=logica+formal+proposicoes+conectivos+FCC+concurso+fiscal"}]
    },
  ]
},
{
  nome:"Administração Pública e Governança", cor:"#f59e0b", icon:"🏢", peso:"10Q",
  topicos:[
    {
      id:"ADM-1",
      titulo:"Governança, Gestão de Riscos e Integridade Pública",
      resumo:`🎯 O QUE É ISSO?
Governança pública é o sistema pelo qual as organizações públicas são dirigidas, controladas e supervisionadas. O Estado do Ceará tem legislação própria que a FCC vai cobrar.

📌 MODELO DAS 3 LINHAS (IIA 2020):
• 1ª LINHA: gestão operacional — quem ASSUME e GERENCIA os riscos no dia a dia (diretores, gerentes, servidores)
• 2ª LINHA: funções de SUPORTE — compliance, gestão de riscos, controles internos, jurídico
• 3ª LINHA: AUDITORIA INTERNA — asseguração INDEPENDENTE para governança e alta administração
• ACIMA DAS 3 LINHAS: órgãos de governança (conselho) e partes externas (auditores externos, TCU, reguladores)

📌 INTEGRIDADE PÚBLICA:
• Programa de Integridade do CE: conjunto de medidas para prevenir, detectar e remediar fraudes/corrupção
• Código de Ética e Conduta da Administração Pública Estadual do CE
• Deveres e proibições do servidor público civil do CE
• Sanções éticas e disciplinares; PAD; TAC (termo de ajustamento)
• Assédio moral: Convenção OIT nº 190/2019

📌 GESTÃO DE RISCOS (ISO 31000):
• Risco = efeito da incerteza nos objetivos
• Processo: identificação → análise → avaliação → tratamento → monitoramento
• Tratamento: evitar, reduzir, transferir ou aceitar o risco
• Apetite ao risco: nível de risco que a organização está disposta a aceitar

📌 GOVERNANÇA CORPORATIVA PÚBLICA:
• Teoria da agência: principal (sociedade/povo) × agente (governo/gestor)
• Accountability: responsabilização + prestação de contas
• Transparência: ativa (iniciativa do Estado) e passiva (LAI)

💡 DICA FCC: Saiba distinguir os papéis das 3 linhas. Questões frequentemente trocam auditoria interna (3ª linha) com gestão de riscos (2ª linha).`,
      links:[{l:"IIA — Modelo 3 Linhas",u:"https://www.theiia.org/en/standards/the-iiapositional-papers/the-iia-three-lines-model/"},{l:"Improbidade 14.230/2021",u:"https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14230.htm"}],
      yt:[{l:"Governança Pública — 3 Linhas",u:"https://www.youtube.com/results?search_query=modelo+tres+linhas+IIA+governanca+publica+FCC+concurso"},{l:"Improbidade Administrativa 2021",u:"https://www.youtube.com/results?search_query=lei+14230+2021+improbidade+administrativa+concurso"}]
    },
    {
      id:"ADM-1-b",
      titulo:"Licitações (Lei 14.133/2021), Improbidade e LAI",
      resumo:`🎯 O QUE É ISSO?
A Nova Lei de Licitações (2021) substituiu a Lei 8.666/93 e trouxe modalidades novas. A FCC já cobra em toda prova fiscal estadual.

📌 NOVA LEI DE LICITAÇÕES (Lei 14.133/2021):
Modalidades:
• CONCORRÊNCIA: obras/serviços de engenharia acima de R$3,3M e outros acima de R$1,43M
• CONCURSO: trabalho técnico/científico/artístico
• LEILÃO: bens imóveis, alienação, concessão de direito real
• PREGÃO: bens e serviços comuns (critério: menor preço/maior desconto)
• DIÁLOGO COMPETITIVO: inovação tecnológica/solução inexistente no mercado → Administração DIALOGA com licitantes antes de definir o objeto
• DISPENSA e INEXIGIBILIDADE: casos específicos em lei

📌 IMPROBIDADE ADMINISTRATIVA (Lei 8.429/92 + 14.230/2021):
• Exige DOLO ESPECÍFICO (culpa foi excluída)
• Legitimidade ativa: EXCLUSIVA do MP
• Prescrição: 8 anos do FG ou 4 anos após fim do vínculo
• Modalidades: que importam enriquecimento ilícito; que causam lesão ao erário; que atentam contra princípios

📌 LEI DE ACESSO À INFORMAÇÃO (Lei 12.527/2011):
• Prazo: 20 dias + prorrogação de 10 dias (com justificativa)
• Sigilo: Reservado (5 anos), Secreto (15 anos), Ultra-secreto (25 anos, renovável 1x)
• Transparência ATIVA: publicar proativamente
• Transparência PASSIVA: responder pedidos

💡 DICA FCC: O diálogo competitivo é a modalidade mais cobrada da Nova Lei de Licitações desde 2022. Saiba os 3 critérios para seu cabimento.`,
      links:[{l:"Lei 14.133/2021",u:"https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/L14133.htm"},{l:"LAI — Lei 12.527/2011",u:"https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm"}],
      yt:[{l:"Nova Lei de Licitações FCC",u:"https://www.youtube.com/results?search_query=nova+lei+licitacoes+14133+2021+FCC+concurso+fiscal"},{l:"LAI para Concursos",u:"https://www.youtube.com/results?search_query=lei+acesso+informacao+LAI+12527+FCC+concurso"}]
    },
  ]
},
{
  nome:"Economia", cor:"#3b82f6", icon:"📉", peso:"10Q",
  topicos:[
    {
      id:"ECO-1",
      titulo:"Microeconomia — Elasticidades, Tributação e Estruturas de Mercado",
      resumo:`🎯 O QUE É ISSO?
Microeconomia estuda o comportamento de consumidores e firmas. A FCC cobra sobretudo elasticidades e suas implicações para tributação.

📌 ELASTICIDADES:
• ELÁSTICA: |Ed| > 1 → quantidade varia MAIS que o preço → tributar gera mais perda de arrecadação
• INELÁSTICA: |Ed| < 1 → quantidade varia MENOS que o preço → tributar gera menos perda
• UNITÁRIA: |Ed| = 1 → variações proporcionais
• Determinantes: disponibilidade de substitutos, necessidade, prazo, parcela do orçamento

📌 TRIBUTAÇÃO E EFICIÊNCIA:
• PESO MORTO (perda de bem-estar): triângulo de Harberger. Maior quanto mais elásticos forem oferta e demanda
• REGRA DE RAMSEY: alíquota INVERSAMENTE proporcional à elasticidade → minimiza perda de eficiência
• CURVA DE LAFFER: arrecadação máxima em certo nível; além disso, mais tributação → menos arrecadação
• INCIDÊNCIA ECONÔMICA: tributação recai mais sobre o lado MENOS ELÁSTICO

📌 ESTRUTURAS DE MERCADO:
• Concorrência Perfeita: muitos agentes, produto homogêneo, preço-tomadores, lucro zero no longo prazo
• Monopólio: um ofertante, poder de preço, DWL máximo
• Oligopólio: poucos ofertantes, interdependência estratégica (Cournot, Nash)
• Concorrência Monopolística: muitos ofertantes, produtos diferenciados, lucro zero no LP

💡 DICA FCC: A Regra de Ramsey conflita com equidade pois bens inelásticos geralmente são essenciais (consumidos mais pelos pobres). A FCC adora cobrar esse TRADE-OFF eficiência vs. equidade.`,
      links:[{l:"Elasticidade Tributação",u:"https://www.google.com/search?q=elasticidade+tributacao+regra+ramsey+curva+laffer+concurso"},{l:"Estruturas de Mercado",u:"https://www.google.com/search?q=estruturas+mercado+FCC+concurso+fiscal"}],
      yt:[{l:"Elasticidade e Tributação FCC",u:"https://www.youtube.com/results?search_query=elasticidade+preco+tributacao+FCC+concurso+fiscal"},{l:"Curva de Laffer",u:"https://www.youtube.com/results?search_query=curva+de+laffer+tributacao+arrecadacao+FCC+concurso"}]
    },
    {
      id:"ECO-1-b",
      titulo:"Macroeconomia — PIB, IS-LM e Políticas Fiscal e Monetária",
      resumo:`🎯 O QUE É ISSO?
Macroeconomia analisa a economia como um todo. A FCC cobra cálculo do PIB, modelos IS-LM e efeitos das políticas macroeconômicas.

📌 PIB — TRÊS ÓTICAS (mesmo resultado):
• DEMANDA: C + I + G + (X−M)
  C = consumo famílias | I = FBCF + Δestoques | G = gastos governo | (X−M) = exportações líquidas
• RENDA: Salários + Lucros + Juros + Aluguéis + Tributos indiretos − Subsídios
• PRODUÇÃO: Σ Valor Adicionado em cada setor (evita dupla contagem)

📌 MODELOS IS-LM:
• IS (mercado de bens): juros altos → I cai → PIB cai. Política FISCAL desloca IS (↑G → IS para direita)
• LM (mercado monetário): juros altos → demanda por moeda cai. Política MONETÁRIA desloca LM

📌 INFLAÇÃO E ÍNDICES:
• IPCA: índice oficial de inflação (IBGE); base = famílias de 1 a 40 salários mínimos
• IGP-M: calculado pela FGV; base = ampla
• Correção monetária: valor REAL = valor nominal ÷ (1 + taxa inflação)

📌 CONTAS NACIONAIS:
• PIB vs PNB: PIB = produção no território; PNB = produção por residentes (PIB − renda enviada + renda recebida do exterior)
• Balanço de Pagamentos: conta corrente (bens, serviços, rendas, transferências) + conta capital e financeira

💡 DICA FCC: O multiplicador keynesiano (1÷propensão marginal a poupar) é cobrado em questões sobre política fiscal. Saiba que política fiscal expansionista (↑G ou ↓T) desloca a IS para a direita.`,
      links:[{l:"PIB Brasil — IBGE",u:"https://www.ibge.gov.br/explica/pib.php"},{l:"Macroeconomia IS-LM",u:"https://www.google.com/search?q=modelo+IS+LM+macroeconomia+FCC+concurso+fiscal"}],
      yt:[{l:"PIB e Contas Nacionais FCC",u:"https://www.youtube.com/results?search_query=PIB+contas+nacionais+macroeconomia+FCC+concurso+fiscal"},{l:"Política Fiscal e Monetária",u:"https://www.youtube.com/results?search_query=politica+fiscal+monetaria+IS+LM+FCC+concurso"}]
    },
  ]
},
{
  nome:"Direito Constitucional", cor:"#ec4899", icon:"⚖️", peso:"4Q",
  topicos:[
    {
      id:"DCO-1",
      titulo:"Controle de Constitucionalidade e Direitos Fundamentais",
      resumo:`🎯 O QUE É ISSO?
Controle de constitucionalidade é o mecanismo pelo qual leis e atos normativos são verificados quanto à sua compatibilidade com a Constituição. A FCC cobra principalmente as diferenças entre controle difuso e concentrado.

📌 CONTROLE CONCENTRADO (STF — via direta):
• ADI: lei/ato normativo federal ou estadual em face da CF
• ADC: lei/ato normativo federal + confirmação de constitucionalidade
• ADPF: atos que violem preceito fundamental (inclusive leis pré-constitucionais)
• ADO: omissão inconstitucional do legislador
• Efeitos: ERGA OMNES + EX TUNC (retroativo) + VINCULANTE para Judiciário e Adm. Pública
• Legitimados: Presidente, Mesa do CN, Mesa Câmara, Mesa Senado, governadores, partidos com rep. no CN, OAB, confederações sindicais, entidades de classe nacionais (art. 103 CF)

📌 CONTROLE DIFUSO (qualquer juízo — via incidental):
• Qualquer juiz ou tribunal pode afastar a norma inconstitucional
• Efeitos: INTER PARTES + EX TUNC
• Para expandir efeitos: Senado Federal suspende execução (art. 52, X) → erga omnes + ex nunc

📌 DIREITOS FUNDAMENTAIS:
• Art. 5º §1º CF: aplicação IMEDIATA
• Direitos individuais e coletivos; sociais; de nacionalidade; políticos; partidos políticos
• Cláusulas pétreas (art. 60 §4º): forma federativa, voto direto secreto universal periódico, separação dos poderes, direitos e garantias individuais

📌 SÚMULA VINCULANTE:
• Aprovada por 2/3 do STF (8 ministros)
• Vincula: todo Judiciário + Adm. Pública direta e indireta
• NÃO vincula: o próprio STF (pode rever) e o Legislativo no exercício de sua função típica

💡 DICA FCC: Decorar os efeitos: difuso = inter partes + ex tunc; concentrado = erga omnes + ex tunc + vinculante.`,
      links:[{l:"CF/88 — Art. 102 e 103",u:"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"},{l:"Controle Constitucionalidade",u:"https://www.google.com/search?q=controle+constitucionalidade+difuso+concentrado+efeitos+FCC"}],
      yt:[{l:"Controle de Constitucionalidade FCC",u:"https://www.youtube.com/results?search_query=controle+constitucionalidade+ADI+ADC+ADPF+FCC+concurso"},{l:"Direitos Fundamentais CF/88",u:"https://www.youtube.com/results?search_query=direitos+fundamentais+CF88+FCC+concurso+fiscal"}]
    },
  ]
},
{
  nome:"Direito Administrativo", cor:"#f97316", icon:"🏛️", peso:"4Q",
  topicos:[
    {
      id:"DAD-1",
      titulo:"Atos Administrativos, Responsabilidade Civil e Organização Administrativa",
      resumo:`🎯 O QUE É ISSO?
Direito Administrativo rege a atuação do Estado. A FCC cobra princípios, teoria dos atos administrativos, responsabilidade civil e organização da administração.

📌 PRINCÍPIOS EXPRESSOS (art. 37 CF) — LIMPE:
L-egalidade | I-mpessoalidade | M-oralidade | P-ublicidade | E-ficiência
(Eficiência acrescentada pela EC 19/1998)
Implícitos: razoabilidade, proporcionalidade, autotutela, continuidade, segurança jurídica

📌 ATOS ADMINISTRATIVOS — ATRIBUTOS:
• PRESUNÇÃO DE LEGITIMIDADE: presumem-se legais (presunção relativa — iuris tantum)
• IMPERATIVIDADE: impõem obrigações independentemente de concordância
• AUTOEXECUTORIEDADE: executam-se sem prévia intervenção judicial (nem todo ato tem isso)
• TIPICIDADE: devem corresponder a um tipo legal previsto

📌 EXTINÇÃO DOS ATOS:
• ANULAÇÃO: vício de legalidade → efeitos EX TUNC (retroativos). Pode ser pela própria Adm. (Súmula 473 STF) ou pelo Judiciário
• REVOGAÇÃO: conveniência e oportunidade → efeitos EX NUNC (prospectivos). APENAS pela Adm.
• CONVALIDAÇÃO: sana vício sanável (competência em razão da pessoa, forma não essencial)

📌 RESPONSABILIDADE CIVIL DO ESTADO (CF art. 37 §6º):
• Objetiva (teoria do RISCO ADMINISTRATIVO) para atos COMISSIVOS
• Elementos: conduta + dano + nexo causal (sem necessidade de culpa)
• Causas excludentes: fato exclusivo da vítima, caso fortuito/força maior, fato de terceiro
• Direito de REGRESSO contra o agente se houver dolo ou culpa

📌 ORGANIZAÇÃO ADMINISTRATIVA:
• Adm. DIRETA: órgãos sem personalidade jurídica (ministérios, secretarias)
• Adm. INDIRETA: com personalidade jurídica — Autarquias, Fundações Públicas, EP, SEM

💡 DICA FCC: Saiba a diferença entre anulação (ilegalidade, ex tunc) e revogação (mérito, ex nunc). E que responsabilidade objetiva do Estado NÃO precisa de culpa.`,
      links:[{l:"CF art. 37 — Administração Pública",u:"https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm"},{l:"Teoria dos Atos Administrativos",u:"https://www.google.com/search?q=atos+administrativos+atributos+extincao+FCC+concurso"}],
      yt:[{l:"Atos Administrativos FCC",u:"https://www.youtube.com/results?search_query=atos+administrativos+anulacao+revogacao+FCC+concurso"},{l:"Responsabilidade Civil Estado",u:"https://www.youtube.com/results?search_query=responsabilidade+civil+estado+objetiva+FCC+concurso+fiscal"}]
    },
  ]
},
{
  nome:"Direito Civil e Direito Penal", cor:"#ec4899", icon:"⚖️", peso:"4Q",
  topicos:[
    {
      id:"DCI-1",
      titulo:"Crimes Tributários, Lavagem de Dinheiro e Noções de Direito Civil",
      resumo:`🎯 O QUE É ISSO?
A FCC cobra sobretudo os crimes contra a ordem tributária (Lei 8.137/90) e lavagem de dinheiro (Lei 9.613/98), por serem diretamente relevantes para a atuação do Auditor-Fiscal.

📌 CRIMES CONTRA A ORDEM TRIBUTÁRIA (Lei 8.137/1990):
• Art. 1º (praticado por PARTICULAR): crimes MATERIAIS → exigem LANÇAMENTO DEFINITIVO para consumação
  ⚠️ Súmula Vinculante 24: "Não se tipifica crime material contra a ordem tributária antes do lançamento definitivo do tributo"
  Condutas: omitir informação, prestar declaração falsa, fraudar documentos, negar emissão de nota fiscal, etc.
• Art. 2º: crimes FORMAIS → consumam-se com a conduta (ex: falta de recolhimento de tributo descontado do empregado)
• Funcionário público: arts. 3º e 4º

📌 LAVAGEM DE DINHEIRO (Lei 9.613/1998):
• Crime: ocultar ou dissimular natureza, origem, localização de bens provenientes de INFRAÇÃO PENAL
• Modelo ALL CRIMES (Lei 12.683/2012): qualquer crime ou contravenção como antecedente
• 3 fases clássicas: Colocação (placement) → Dissimulação (layering) → Integração
• Pena: 3 a 10 anos + multa

📌 DIREITO CIVIL — PONTOS COBRADOS PELA FCC:
• PRESCRIÇÃO: extingue a PRETENSÃO (direito de ação). Pode ser renunciada, interrompida e suspensa
• DECADÊNCIA: extingue o próprio DIREITO (potestativo). Decadência legal = irrenunciável
• NEGÓCIO JURÍDICO: plano da existência → validade → eficácia
  Vícios: erro, dolo, coação, lesão, estado de perigo, fraude contra credores, simulação
• RESPONSABILIDADE CIVIL: Objetiva (atividade de risco) vs. Subjetiva (culpa ou dolo)

📌 CRIME ORGANIZADO (Lei 12.850/2013):
• Associação de 4+ pessoas + estrutura ordenada + divisão de tarefas + obtenção de vantagem ilícita
• Instrumentos de combate: colaboração premiada, infiltração de agentes, ação controlada, captação ambiental

💡 DICA FCC: A SV 24 é o ponto mais cobrado de crimes tributários. Saiba que os crimes do art. 1º (materiais) exigem lançamento definitivo; os do art. 2º (formais), não.`,
      links:[{l:"Lei 8.137/1990 — Crimes Tributários",u:"https://www.planalto.gov.br/ccivil_03/leis/l8137.htm"},{l:"Lei 9.613/1998 — Lavagem",u:"https://www.planalto.gov.br/ccivil_03/leis/l9613.htm"}],
      yt:[{l:"Crimes contra Ordem Tributária FCC",u:"https://www.youtube.com/results?search_query=crimes+ordem+tributaria+lei+8137+FCC+concurso+fiscal"},{l:"Lavagem de Dinheiro",u:"https://www.youtube.com/results?search_query=lavagem+dinheiro+lei+9613+FCC+concurso+fiscal"}]
    },
  ]
},
{
  nome:"Direito Financeiro", cor:"#14b8a6", icon:"💰", peso:"8Q",
  topicos:[
    {
      id:"DFI-1",
      titulo:"LRF — Lei de Responsabilidade Fiscal Completa",
      resumo:`🎯 O QUE É ISSO?
A LRF (LC 101/2000) é a principal norma de finanças públicas no Brasil. A FCC cobra os limites de despesas de pessoal, os mecanismos de controle e as vedações ao final do mandato.

📌 LIMITES DE DESPESAS COM PESSOAL (RCL = Receita Corrente Líquida):
                    GLOBAL    EXECUTIVO   OUTROS
• ESTADOS:          60%         49%        11% (Leg 3% + Jud 6% + MP 2%)
• UNIÃO:            50%         40,9%      9,1%
• MUNICÍPIOS:       60%         54%        6% (Câmara 6%)

Níveis de alerta:
• Prudencial: 95% do limite → vedações preventivas
• Limite: 100% → sanções automáticas (vedação de novos gastos)

📌 MECANISMOS DE CONTROLE:
• Art. 9º — LIMITAÇÃO DE EMPENHO (contingenciamento): bimestral, quando receita não comportar metas de resultado primário. Não se aplica a despesas constitucionalmente obrigatórias.
• Art. 42 — VEDAÇÃO AO FINAL DO MANDATO: últimos 2 quadrimestres → proibido contrair RP sem disponibilidade de caixa

📌 INSTRUMENTOS DE PLANEJAMENTO:
• PPA: 4 anos (diretrizes, objetivos e metas da Administração)
• LDO: orientar LOA + metas fiscais + riscos fiscais + critérios para limitação de empenho
• LOA: autoriza a realização de receitas e despesas no exercício

📌 RESULTADO FISCAL:
• PRIMÁRIO: receitas não financeiras − despesas não financeiras (SEM juros)
  → Mede o ESFORÇO FISCAL antes do serviço da dívida
• NOMINAL: Primário − Juros nominais
  → Mede a VARIAÇÃO TOTAL DA DÍVIDA

📌 RELATÓRIOS OBRIGATÓRIOS:
• RREO (Relatório Resumido de Execução Orçamentária): BIMESTRAL
• RGF (Relatório de Gestão Fiscal): QUADRIMESTRAL

💡 DICA FCC: Decorar os limites de pessoal: Estados=60/49; União=50/40,9; Municípios=60/54. A FCC cobra os TRÊS com frequência.`,
      links:[{l:"LC 101/2000 — LRF",u:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp101.htm"},{l:"LRF Comentada — STN",u:"https://www.gov.br/tesouronacional/pt-br/execucao-orcamentaria-e-financeira/lei-de-responsabilidade-fiscal"}],
      yt:[{l:"LRF Completa — Limites de Pessoal",u:"https://www.youtube.com/results?search_query=LRF+lei+responsabilidade+fiscal+limites+pessoal+FCC+concurso"},{l:"PPA LDO LOA Diferenças",u:"https://www.youtube.com/results?search_query=PPA+LDO+LOA+diferencas+FCC+concurso+fiscal"}]
    },
    {
      id:"DFI-1-b",
      titulo:"Orçamento Público — Lei 4.320/64, PPA, LDO e LOA",
      resumo:`🎯 O QUE É ISSO?
O orçamento público é o instrumento de planejamento e controle das finanças do Estado. A Lei 4.320/64 ainda é a principal norma de contabilidade e finanças públicas, embora complementada pelo MCASP.

📌 CICLO ORÇAMENTÁRIO:
PPA (4 anos) → LDO (1 ano — orienta a LOA) → LOA (1 ano — autoriza gastos) → Execução → Controle

📌 PRINCÍPIOS ORÇAMENTÁRIOS:
• UNIVERSALIDADE: todas as receitas e despesas constam do orçamento
• ANUALIDADE: vigência de 1 ano (exercício financeiro)
• UNIDADE: orçamento único para cada ente (mas a CF prevê 3: fiscal, seguridade, investimento das EP)
• EXCLUSIVIDADE: LOA não contém matéria estranha ao orçamento (exceto créditos adicionais)
• ORÇAMENTO BRUTO: receitas e despesas por seus valores totais (sem deduções)
• ESPECIFICAÇÃO: dotações com detalhamento suficiente

📌 CRÉDITOS ADICIONAIS (art. 41 Lei 4.320):
• SUPLEMENTARES: reforço de dotações existentes (LOA autoriza + crédito especial)
• ESPECIAIS: novas dotações não previstas na LOA (autorização legislativa + fonte de recursos)
• EXTRAORDINÁRIOS: despesas urgentes e imprevisíveis → decreto executivo (sem indicação prévia de fonte)

📌 RECEITAS E DESPESAS CORRENTES vs. CAPITAL:
• Receita CORRENTE: tributária, patrimonial, agropecuária, industrial, transferências correntes
• Receita de CAPITAL: operações de crédito, alienação de bens, transferências de capital
• Despesa CORRENTE: pessoal, juros, custeio
• Despesa de CAPITAL: investimentos, inversões financeiras, amortizações

💡 DICA FCC: Créditos extraordinários são os únicos que não exigem fonte de recursos prévia e são abertos por decreto executivo (por isso a FCC sempre os distingue dos demais).`,
      links:[{l:"Lei 4.320/1964",u:"https://www.planalto.gov.br/ccivil_03/leis/l4320.htm"},{l:"MCASP 11ª Edição",u:"https://www.gov.br/tesouronacional/pt-br/contabilidade-e-custos/federacao/manualcontabilidadeaplicadaaossetorpublico"}],
      yt:[{l:"Orçamento Público — Lei 4.320",u:"https://www.youtube.com/results?search_query=orcamento+publico+lei+4320+principios+FCC+concurso"},{l:"Créditos Adicionais",u:"https://www.youtube.com/results?search_query=creditos+adicionais+suplementares+especiais+extraordinarios+FCC+concurso"}]
    },
  ]
},
{
  nome:"Contabilidade Geral e Pública", cor:"#6366f1", icon:"🏛️", peso:"10Q",
  topicos:[
    {
      id:"CGP-1",
      titulo:"MCASP, Receita, Despesa e NBC TSP",
      resumo:`🎯 O QUE É ISSO?
Contabilidade Pública segue o MCASP (Manual de Contabilidade Aplicada ao Setor Público), agora na 11ª edição, e as NBC TSP (Normas Brasileiras de Contabilidade Aplicadas ao Setor Público).

📌 ESTÁGIOS DA RECEITA (MCASP):
1. PREVISÃO → constante da LOA (previsão do valor a arrecadar)
2. LANÇAMENTO → individualização do crédito tributário (art. 53 Lei 4.320)
3. ARRECADAÇÃO → contribuinte paga ao agente arrecadador (banco)
4. RECOLHIMENTO → agente entrega ao Tesouro (conta única)

📌 ESTÁGIOS DA DESPESA:
1. FIXAÇÃO → dotação autorizada na LOA
2. EMPENHO → art. 58 Lei 4.320: "ato que cria para o Estado obrigação de pagamento, pendente ou não de implemento de condição"
   Modalidades: ORDINÁRIO (valor certo), ESTIMATIVO (valor variável), GLOBAL (contratos parcelados)
3. LIQUIDAÇÃO → art. 63: verificação do direito do credor (entrega do bem/serviço comprovada)
4. PAGAMENTO → art. 64: despacho do ordenador + entrega ao credor

📌 RESTOS A PAGAR:
• PROCESSADOS: empenho + liquidação realizados (direito verificado) → Estado DEVE pagar
• NÃO PROCESSADOS: apenas empenho (liquidação pendente) → obrigação sujeita à verificação
• Cancelamento: após 2 exercícios (regra geral)

📌 NBC TSP — CARACTERÍSTICAS QUALITATIVAS:
• FUNDAMENTAIS: Relevância (valor preditivo + confirmatório + materialidade) + Representação Fidedigna (completa + neutra + livre de erros)
• DE MELHORIA: Comparabilidade, Verificabilidade, Tempestividade, Compreensibilidade

📌 NBC TSP PRINCIPAIS:
• NBC TSP 01: Apresentação das demonstrações contábeis
• NBC TSP 02: Demonstrações do fluxo de caixa
• NBC TSP 03: Receitas de transações com contraprestação
• NBC TSP 04: Estoques
• NBC TSP 05: Ativos imobilizados

💡 DICA FCC: Diferenciar Restos a Pagar PROCESSADOS (já liquidados = Estado deve) de NÃO PROCESSADOS (não liquidados = verificação pendente) cai em toda prova de contabilidade pública.`,
      links:[{l:"MCASP 11ª Edição — STN",u:"https://www.gov.br/tesouronacional/pt-br/contabilidade-e-custos/federacao/manualcontabilidadeaplicadaaossetorpublico"},{l:"NBC TSP — CFC",u:"https://cfc.org.br/tecnica/normas-brasileiras-de-contabilidade/nbc-tsp-do-setor-publico/"}],
      yt:[{l:"MCASP Receita e Despesa FCC",u:"https://www.youtube.com/results?search_query=MCASP+receita+despesa+estagios+FCC+concurso"},{l:"NBC TSP Estrutura Conceitual",u:"https://www.youtube.com/results?search_query=NBC+TSP+estrutura+conceitual+FCC+concurso+contabilidade+publica"}]
    },
    {
      id:"CGP-1-b",
      titulo:"Contabilidade Geral — Estoques, Ativo Imobilizado e DRE",
      resumo:`🎯 O QUE É ISSO?
A contabilidade geral cobre o reconhecimento, mensuração e divulgação dos elementos patrimoniais. A FCC cobra sobretudo estoques, ativo imobilizado e demonstrações contábeis.

📌 ESTOQUES (CPC 16):
• Custo: inclui custos de aquisição + transformação + outros necessários para levar ao local/condição atual
• Métodos de avaliação:
  - PEPS (Primeiro a Entrar, Primeiro a Sair): estoque final valorado a preços mais recentes
  - MPM (Média Ponderada Móvel): recalcula a cada entrada
  - Preço Específico: para itens individualmente identificáveis
• Teste de impairment: CMV = estoque inicial + compras − estoque final
• Provisão: valor realizável líquido < custo → baixa para VRL

📌 ATIVO IMOBILIZADO (CPC 27):
• Reconhecimento: futuro benefício econômico + custo mensurável
• Depreciação: alocação sistemática do custo ao longo da vida útil
  Métodos: Linha Reta, Saldos Decrescentes, Unidades de Produção
• Baixa: valor residual + ganho/perda no resultado
• Reavaliação: a valor justo (se adotada, deve ser para a classe toda)

📌 DEMONSTRAÇÕES CONTÁBEIS:
• BP (Balanço Patrimonial): Ativo = Passivo + PL
• DRE (Demonstração do Resultado): Receitas − Despesas = Lucro/Prejuízo
• DMPL: mutações do patrimônio líquido
• DFC: fluxos de caixa — operacional, investimento, financiamento
• DVA: riqueza gerada e sua distribuição

📌 PROVISÕES (CPC 25):
• Reconhecer quando: obrigação presente + saída provável de recursos + estimativa confiável
• Provisão ≠ contingência passiva (possível → só notas explicativas; remota → nada)

💡 DICA FCC: PEPS → estoque final valorado a preços recentes (mais caro em inflação). MPM → média ponderada das entradas. A FCC cobra o cálculo do CMV passo a passo.`,
      links:[{l:"CPC 16 — Estoques",u:"https://www.cpc.org.br/CPC/Documentos-Emitidos/Pronunciamentos/Pronunciamento?Id=47"},{l:"CPC 27 — Ativo Imobilizado",u:"https://www.cpc.org.br/CPC/Documentos-Emitidos/Pronunciamentos/Pronunciamento?Id=58"}],
      yt:[{l:"Estoques PEPS MPM FCC",u:"https://www.youtube.com/results?search_query=estoques+PEPS+MPM+FCC+concurso+contabilidade"},{l:"Ativo Imobilizado e Depreciação",u:"https://www.youtube.com/results?search_query=ativo+imobilizado+depreciacao+FCC+concurso+contabilidade"}]
    },
  ]
},
{
  nome:"Contabilidade Avançada e de Custos", cor:"#8b5cf6", icon:"📊", peso:"20Q (Peso 2)",
  topicos:[
    {
      id:"COA-1",
      titulo:"Valor Justo, Arrendamento (IFRS 16), Combinações e MEP",
      resumo:`🎯 O QUE É ISSO?
Contabilidade Avançada é o maior bloco dos específicos A01 (20Q × peso 2 = 40 pts equivalentes). A FCC cobra IFRS/CPC em profundidade, com cálculos numéricos.

📌 VALOR JUSTO — CPC 46 / IFRS 13:
Hierarquia de níveis (do mais para o menos confiável):
• NÍVEL 1: preços cotados em mercados ATIVOS para ativos/passivos IDÊNTICOS
• NÍVEL 2: dados OBSERVÁVEIS distintos dos do Nível 1 (ativos similares, taxas de juros de mercado)
• NÍVEL 3: dados NÃO OBSERVÁVEIS — premissas da própria entidade, fluxo de caixa descontado interno
Regra: MAXIMIZAR dados observáveis. Disclosure crescente do N1 para N3.

📌 ARRENDAMENTO — CPC 06 R2 / IFRS 16:
O arrendatário deve reconhecer (exceto curto prazo ≤12m e baixo valor):
• ATIVO DE DIREITO DE USO: VP dos pagamentos + custos iniciais diretos + estimativa de restauração/desmantelamento
• PASSIVO DE ARRENDAMENTO: VP dos pagamentos de arrendamento futuros (taxa de desconto: taxa implícita do arrendamento ou taxa incremental de empréstimo)
Arrendador: FINANÇA (reconhece recebível) vs. OPERACIONAL (reconhece receita linear)

📌 COMBINAÇÕES DE NEGÓCIOS — CPC 15 / IFRS 3:
Método de Aquisição:
Goodwill = (Contraprestação + PNC + Interesse previamente detido) − VJ líquido ativos/passivos identificáveis
• Positivo → GOODWILL: ativo intangível, NÃO amortizável, teste de impairment ANUAL
• Negativo → COMPRA VANTAJOSA: reconhecida no RESULTADO imediatamente

📌 MEP (Método de Equivalência Patrimonial) — CPC 18 / IAS 28:
• Aplicável a: COLIGADAS (influência significativa ≥20% votante) e CONTROLADAS
• Reconhecimento: % de participação × variação do PL da investida
• Mais-valia: amortizada/depreciada conforme vida útil do ativo
• Goodwill na aquisição: não amortizável, teste de impairment

📌 INSTRUMENTOS FINANCEIROS — CPC 48 / IFRS 9:
• Categorias: custo amortizado, VJ por outros resultados abrangentes (VJORA), VJ por resultado (VJR)
• Provisão de perdas: modelo de perdas esperadas (ECL) — mudança do modelo de perdas incorridas

💡 DICA FCC: O cálculo do goodwill é o mais cobrado. Memorize a fórmula: contraprestação + PNC + interesse prévio − VJ líquido. Valor positivo = goodwill; negativo = compra vantajosa (vai direto para o resultado).`,
      links:[{l:"CPC 15 — Combinações",u:"https://www.cpc.org.br/CPC/Documentos-Emitidos/Pronunciamentos/Pronunciamento?Id=46"},{l:"CPC 06 R2 — Arrendamento",u:"https://www.cpc.org.br/CPC/Documentos-Emitidos/Pronunciamentos/Pronunciamento?Id=57"}],
      yt:[{l:"CPC 46 Valor Justo Hierarquia",u:"https://www.youtube.com/results?search_query=CPC+46+valor+justo+hierarquia+niveis+FCC+concurso"},{l:"IFRS 16 CPC 06 R2 Arrendamento",u:"https://www.youtube.com/results?search_query=CPC+06+R2+IFRS+16+arrendamento+FCC+concurso"}]
    },
    {
      id:"COA-1-b",
      titulo:"Contabilidade de Custos — PE, Margem de Contribuição e Custeios",
      resumo:`🎯 O QUE É ISSO?
Custos é cobrado dentro de Contabilidade Avançada. A FCC exige cálculos numéricos de ponto de equilíbrio, margem de contribuição e comparação entre métodos de custeio.

📌 CLASSIFICAÇÕES DE CUSTOS:
• DIRETOS vs. INDIRETOS: podem ou não ser diretamente identificados ao produto
• FIXOS vs. VARIÁVEIS: não variam vs. variam com a produção no curto prazo
  ⚠️ Custo fixo unitário DIMINUI com o aumento de produção (diluição)
  ⚠️ Custo variável TOTAL aumenta, mas unitário é constante

📌 MARGEM DE CONTRIBUIÇÃO (MC):
MC unitária = PV − CVu (Preço de Venda − Custo/Despesa Variável unitário)
MC total = MC unitária × Quantidade
Índice de MC (%) = MC / PV × 100

📌 PONTOS DE EQUILÍBRIO:
• PEC (Contábil): CF ÷ MCu → cobre custos contábeis (inclui depreciação)
• PEE (Econômico): (CF + Custo Oportunidade) ÷ MCu → cobre custo de oportunidade
• PEF (Financeiro): (CF − Depreciação) ÷ MCu → cobre saídas de caixa

📌 MÉTODOS DE CUSTEIO:
• ABSORÇÃO: rateia TODOS os custos (fixos + variáveis) aos produtos. Exigido pelo fisco. Pode gerar lucro irreal com aumento de estoque.
• VARIÁVEL (Direto): inclui apenas custos VARIÁVEIS nos produtos; custos fixos = despesas do período. Melhor para decisão gerencial.
• ABC (Activity-Based Costing): custos indiretos rastreados por ATIVIDADES → maior precisão para produtos/serviços diversificados.

📌 DEPARTAMENTALIZAÇÃO:
• Centros de custo: produtivos (alocam a produtos) + auxiliares (alocam aos produtivos primeiro)
• Rateio: critérios técnicos (horas-máquina, horas-homem, m² etc.)

💡 DICA FCC: PEC = CF/MCu. Questão favorita: dar CF, PV e CVu e pedir as 3 modalidades de PE. Não confunda PEF (subtrai depreciação no numerador) com PEE (soma custo de oportunidade no numerador).`,
      links:[{l:"Custos — Estratégia Concursos",u:"https://www.estrategiaconcursos.com.br/blog/contabilidade-de-custos/"},{l:"Ponto de Equilíbrio",u:"https://www.google.com/search?q=ponto+equilibrio+contabil+economico+financeiro+FCC+concurso"}],
      yt:[{l:"Ponto de Equilíbrio FCC",u:"https://www.youtube.com/results?search_query=ponto+equilibrio+margem+contribuicao+FCC+concurso"},{l:"Métodos de Custeio FCC",u:"https://www.youtube.com/results?search_query=metodos+custeio+absorcao+variavel+ABC+FCC+concurso"}]
    },
  ]
},
{
  nome:"Direito Tributário", cor:"#ef4444", icon:"⚖️", peso:"20Q (Peso 2)",
  topicos:[
    {
      id:"DTR-1",
      titulo:"CTN — Obrigação, Fato Gerador, Crédito e Extinção",
      resumo:`🎯 O QUE É ISSO?
Direito Tributário é a maior disciplina dos específicos (20Q × peso 2). O CTN é a principal fonte normativa. A FCC cobra artigos específicos com frequência.

📌 OBRIGAÇÃO TRIBUTÁRIA (arts. 113-138):
• PRINCIPAL: pagar TRIBUTO ou PENALIDADE PECUNIÁRIA (multa)
• ACESSÓRIA: fazer, não fazer ou tolerar algo → descumprir converte-se em obrigação PRINCIPAL
• Fato Gerador: situação NECESSÁRIA E SUFICIENTE prevista em lei (art. 114)
• Sujeito Passivo: CONTRIBUINTE (relação pessoal com FG) ou RESPONSÁVEL (obrigação por disposição legal)

📌 RESPONSABILIDADE TRIBUTÁRIA:
• Por SUBSTITUIÇÃO: desde a origem, o responsável ocupa lugar do contribuinte
• Por TRANSFERÊNCIA: migração da responsabilidade por evento posterior (morte, dissolução)
• Responsabilidade de TERCEIROS (art. 135): dolo específico → responsabilidade PESSOAL (sócios-gerentes)
  Súmula 430 STJ: inadimplemento NÃO gera responsabilidade solidária dos sócios
• Solidariedade: NÃO comporta benefício de ordem (art. 124 PU)

📌 CRÉDITO TRIBUTÁRIO — CONSTITUIÇÃO:
Modalidades de LANÇAMENTO:
• DE OFÍCIO (direto): Fisco age sozinho (IPTU, IPVA, TCFA) — art. 149
• POR DECLARAÇÃO (misto): contribuinte declara, Fisco lança — art. 147
• POR HOMOLOGAÇÃO: contribuinte antecipa pagamento SEM prévio exame — art. 150
  Prazo para homologação: 5 anos do FG (§4º); com fraude/dolo: art. 173, I

📌 EXTINÇÃO (art. 156 — 11 modalidades):
Pagamento | Compensação | Transação | Remissão | Prescrição | Decadência | Conversão de depósito em renda | Pagamento antecipado + homologação | Consignação em pagamento | Decisão admin. irreformável | Decisão judicial passada em julgado | Dação em pagamento de bens imóveis (LC 104/2001)

📌 SUSPENSÃO (art. 151 — MDRRLP):
Moratória | Depósito do montante integral | Reclamações e Recursos administrativos | Liminar/tutela antecipada | Parcelamento

📌 EXCLUSÃO (arts. 175-182):
• ISENÇÃO: exclui o TRIBUTO (antes do lançamento) — prospectiva
• ANISTIA: exclui a MULTA por infrações anteriores à lei — retroativa

💡 DICA FCC: A diferença entre SUSPENSÃO (MDRRLP), EXTINÇÃO (art. 156) e EXCLUSÃO (isenção e anistia) é obrigatória. Questões misturam as modalidades para confundir.`,
      links:[{l:"CTN Completo — Planalto",u:"https://www.planalto.gov.br/ccivil_03/leis/l5172compilado.htm"},{l:"CTN Comentado — STJ",u:"https://www.stj.jus.br/sites/portalp/Paginas/Jurisprudencia/Pesquisa.aspx"}],
      yt:[{l:"CTN Completo FCC",u:"https://www.youtube.com/results?search_query=CTN+codigo+tributario+nacional+FCC+concurso+fiscal+completo"},{l:"Crédito Tributário — Extinção Suspensão",u:"https://www.youtube.com/results?search_query=credito+tributario+extincao+suspensao+exclusao+CTN+FCC"}]
    },
    {
      id:"DTR-2",
      titulo:"Reforma Tributária — EC 132/2023, LC 214/2025, IBS, CBS e IS",
      resumo:`🎯 O QUE É ISSO?
A Reforma Tributária é o TEMA MAIS QUENTE de 2026. A EC 132/2023 e a LC 214/2025 trouxeram as mudanças mais profundas desde a CF/88. CERTAMENTE cairá em múltiplas questões.

📌 ESTRUTURA DO NOVO SISTEMA:
                    SUBSTITUI         COMPETÊNCIA         ADMINISTRA
• IBS             ICMS + ISS    Estados/DF/Municípios   Comitê Gestor
• CBS             PIS + COFINS        União              Receita Federal
• IS (Seletivo)   nada (novo)         União              Receita Federal

📌 IBS — IMPOSTO SOBRE BENS E SERVIÇOS:
• Competência COMPARTILHADA entre Estados, DF e Municípios
• Comitê Gestor do IBS (art. 156-B CF): administração, arrecadação, fiscalização, cobrança e representação (judicial e extrajudicial)
• Alíquota UNIFORME: cada ente define sua alíquota de referência
• Não-cumulatividade PLENA: crédito integral de todo IBS pago na cadeia
• Princípio do DESTINO: imposto devido no local de CONSUMO (não de produção)
• Transição: 2026 (0,1% teste) → 2027-2028 (0,9%+0,1%) → 2029-2032 (gradual) → 2033 (completo)

📌 CBS — CONTRIBUIÇÃO SOBRE BENS E SERVIÇOS:
• Substitui PIS e COFINS
• Competência FEDERAL (União), administrada pela Receita Federal
• Mesmas regras de não-cumulatividade e destino que o IBS
• Alíquota única fixada em lei complementar

📌 IS — IMPOSTO SELETIVO:
• Art. 153, VIII CF: incide sobre produção, extração, comercialização ou importação de bens e serviços PREJUDICIAIS À SAÚDE OU AO MEIO AMBIENTE
• Competência: FEDERAL (União)
• NÃO integra a base de cálculo do IBS e da CBS

📌 PERÍODO DE TRANSIÇÃO:
• ICMS: extinção gradual 2029-2032
• ISS: extinção gradual 2029-2032
• PIS/COFINS: extinção em 2027 (CBS assume)
• Regras de migração: fundo de compensação, partilha de receitas entre entes

💡 DICA FCC: Saiba a diferença: IBS (estados/municípios → Comitê Gestor) vs CBS (federal → Receita Federal). O princípio do destino = imposto due onde o bem/serviço é CONSUMIDO, não onde é produzido.`,
      links:[{l:"EC 132/2023",u:"https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc132.htm"},{l:"LC 214/2025",u:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm"}],
      yt:[{l:"Reforma Tributária EC 132/2023",u:"https://www.youtube.com/results?search_query=reforma+tributaria+EC+132+2023+IBS+CBS+IS+FCC+concurso"},{l:"IBS CBS Explicados",u:"https://www.youtube.com/results?search_query=IBS+CBS+imposto+seletivo+reforma+tributaria+2026+FCC"}]
    },
    {
      id:"DTR-2-b",
      titulo:"LC 87/96 (Lei Kandir), CONFAZ e Simples Nacional",
      resumo:`🎯 O QUE É ISSO?
A legislação tributária nacional complementa o CTN. Para o SEFAZ/CE, os pontos mais importantes são a não-cumulatividade do ICMS (Lei Kandir), as normas do CONFAZ e o Simples Nacional.

📌 LC 87/1996 — LEI KANDIR (ICMS):
• NÃO-CUMULATIVIDADE: crédito do ICMS pago nas etapas anteriores
• Isenção/não-incidência: NÃO gera crédito, SALVO disposição em contrário
• ATIVO PERMANENTE: crédito à razão de 1/48 por mês (4 anos)
• USO E CONSUMO: crédito VEDADO até 2033 (art. 33)
• Alíquotas interestaduais: 7% (Sul/Sudeste → Norte/Nordeste/CO) ou 12% (demais)
• DIFAL: diferencial de alíquota (EC 87/2015) cobrado nas operações para consumidor final não contribuinte

📌 LC 24/1975 — CONFAZ E CONVÊNIOS:
• Benefícios fiscais de ICMS (isenções, reduções de base, créditos presumidos): exigem CONVÊNIO CONFAZ
• Aprovação: UNANIMIDADE dos estados e DF PRESENTES (mínimo 4/5 dos estados)
• Um único estado pode VETAR
• LC 160/2017: remissão de benefícios concedidos sem convênio (guerra fiscal passada)

📌 LC 123/2006 — SIMPLES NACIONAL:
• MEI (até R$81.000/ano), ME (até R$360.000/ano), EPP (até R$4,8 milhões/ano)
• DAS: Documento de Arrecadação do Simples — reúne tributos em guia única
• ⚠️ ICMS-ST NÃO entra no DAS: recolhido SEPARADAMENTE
• Exclusão de ofício: efeitos a partir do mês seguinte ao da notificação (em alguns casos, retroativos)
• Vedações: art. 17 LC 123 (atividades impeditivas)

📌 LC 116/2003 — ISSQN:
• ISS: competência MUNICIPAL
• Conflito ICMS x ISS: serviços com fornecimento de mercadorias — lista anexa define o que é ISS ou ICMS

💡 DICA FCC: Convênio CONFAZ = UNANIMIDADE. Essa informação sempre cai. E o ICMS-ST fora do DAS é questão clássica sobre Simples Nacional.`,
      links:[{l:"LC 87/1996 — Lei Kandir",u:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm"},{l:"LC 123/2006 — Simples Nacional",u:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm"}],
      yt:[{l:"Lei Kandir — Não Cumulatividade ICMS",u:"https://www.youtube.com/results?search_query=lei+kandir+LC+87+96+nao+cumulatividade+ICMS+FCC+concurso"},{l:"Simples Nacional FCC",u:"https://www.youtube.com/results?search_query=simples+nacional+LC+123+2006+FCC+concurso+fiscal"}]
    },
  ]
},
{
  nome:"Legislação Tributária Estadual do Ceará", cor:"#f97316", icon:"📜", peso:"20Q (Peso 2)",
  topicos:[
    {
      id:"LTE-1",
      titulo:"ICMS-CE (Lei 18.665/2023 e Dec. 33.327/2019), ITCD, IPVA e FECOP",
      resumo:`🎯 O QUE É ISSO?
A legislação tributária do Ceará é cobrada com 20 questões de peso 2. Foca em ICMS (Lei 18.665/2023 e RICMS Dec. 33.327/2019), ITCD (Lei 15.812/2015), IPVA (Lei 12.023/1992) e FECOP (LC 37/2003).

📌 ICMS-CE — ASPECTOS FUNDAMENTAIS:
• Fato Gerador: saída de mercadoria + prestação de serviços de transporte interestadual/intermunicipal e comunicação
• Contribuinte: quem realiza habitualmente operações de circulação de mercadorias (mesmo sem fins comerciais)
• Base de Cálculo: valor da operação (+ frete, seguros, outros encargos) → ICMS POR DENTRO (integra a BC)

📌 ICMS POR DENTRO (cálculo interno):
  Fórmula: BC = valor sem ICMS ÷ (1 − alíquota)
  Exemplo: produto R$82; alíquota 18%:
  BC = 82 ÷ 0,82 = R$100 → ICMS = R$18 (alíquota real = 21,95%)

📌 SUBSTITUIÇÃO TRIBUTÁRIA NO CE:
• PROGRESSIVA (para frente): fabricante/importador (substituto) recolhe ICMS de toda a cadeia
  - Base de cálculo: MVA (Margem de Valor Agregado) ou pauta fiscal
  - Se o FG presumido NÃO ocorrer: DIREITO À RESTITUIÇÃO (STF RE 593.849)
• REGRESSIVA (diferimento): postergação do recolhimento para etapa posterior

📌 NÃO-CUMULATIVIDADE NO CE (seguindo a Lei Kandir):
• Crédito de uso e consumo: VEDADO até 2033
• Crédito de ativo permanente: 1/48 por mês
• Saídas isentas ou não tributadas: NÃO geram crédito (salvo disposição contrária)

📌 ITCD — CE (Lei 15.812/2015):
• Fato gerador: transmissão CAUSA MORTIS (herança) + DOAÇÃO (qualquer bem/direito)
• Alíquotas: PROGRESSIVAS conforme valor da base de cálculo (CE adotou progressividade)
• Alíquota máxima: 8% (Res. Senado 9/1992)

📌 IPVA — CE (Lei 12.023/1992):
• Fato gerador: propriedade de veículo automotor em 1º de janeiro
• Base de cálculo: valor venal do veículo
• Alíquotas: diferenciadas por tipo de veículo (legislação estadual)

📌 FECOP (LC 37/2003):
• Adicional de ICMS de até 2% sobre produtos supérfluos/prejudiciais
• Vinculado ao combate à pobreza (art. 82 ADCT)

💡 DICA FCC: O ICMS-CE segue a LC 87/96 (Lei Kandir) como norma nacional. Questões sobre legislação estadual geralmente verificam se você sabe aplicar a lei nacional ao contexto cearense.`,
      links:[{l:"SEFAZ-CE — Legislação",u:"https://www.sefaz.ce.gov.br/legislacao/"},{l:"LC 87/1996 — Base nacional",u:"https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp87.htm"}],
      yt:[{l:"ICMS CE — Estudo Completo",u:"https://www.youtube.com/results?search_query=ICMS+Ceara+lei+18665+2023+concurso+SEFAZ+CE"},{l:"ICMS-CE Substituição Tributária",u:"https://www.youtube.com/results?search_query=substituicao+tributaria+ICMS+CE+SEFAZ+Ceara+concurso"}]
    },
  ]
},
{
  nome:"Fluência de Dados", cor:"#d946ef", icon:"💻", peso:"10Q (Peso 2)",
  topicos:[
    {
      id:"FLD-1",
      titulo:"SQL, Arquitetura de Dados, LGPD e Governança",
      resumo:`🎯 O QUE É ISSO?
Fluência de Dados é disciplina nova no edital SEFAZ/CE 2026. Cobra SQL, arquiteturas modernas de dados, LGPD e governança de dados.

📌 SQL — ORDEM DE EXECUÇÃO:
FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT

• WHERE: filtra LINHAS antes do agrupamento (não usa funções de agregação)
• GROUP BY: agrupa linhas com mesmo valor
• HAVING: filtra GRUPOS após agrupamento (usa SUM, COUNT, AVG, MAX, MIN)
• ORDER BY: ordena o resultado (ASC padrão, DESC)

📌 TIPOS DE JOIN:
• INNER JOIN: apenas registros com correspondência em AMBAS as tabelas
• LEFT JOIN: TODOS da esquerda + correspondentes da direita (NULL se não houver)
• RIGHT JOIN: inverso do LEFT
• FULL OUTER JOIN: TODOS de ambas (NULLs onde não há correspondência)
• CROSS JOIN: produto cartesiano (todas as combinações)

📌 ARQUITETURA DE DADOS:
• Data Warehouse (DW): dados curados, schema-on-write, otimizado para BI/analytics, histórico
• Data Lake: dados brutos (structured/unstructured/semi), schema-on-read, barato, flexível
• Data Mart: subconjunto do DW focado em área específica (vendas, RH)
• Data Lakehouse: DL + transações ACID + schema enforcement + performance analítica (Delta Lake, Iceberg)
• Data Mesh: descentralização; domínios de dados com equipes owning seus próprios pipelines

📌 LGPD (Lei 13.709/2018) — BASES LEGAIS para tratamento:
Art. 7º: consentimento | obrigação legal (FISCO usa essa) | execução de políticas públicas | pesquisa | execução de contrato | exercício regular de direitos | proteção da vida | tutela da saúde | legítimo interesse | proteção do crédito

• DPO (Encarregado): ponto de contato controlador ↔ titular ↔ ANPD
• Sigilo fiscal: CTN arts. 198-199 (informações protegidas de terceiros)

📌 METODOLOGIA CRISP-DM:
Entendimento do negócio → Entendimento dos dados → Preparação dos dados → Modelagem → Avaliação → Implantação

📌 ETL vs. ELT:
• ETL: Extrai → Transforma (before load) → Carrega. Tradicional, mais controle.
• ELT: Extrai → Carrega → Transforma (after load). Cloud/Big Data, mais rápido.

💡 DICA FCC: HAVING vs WHERE é a questão mais cobrada de SQL. Na Fluência de Dados, a FCC também costuma cobrar a diferença entre Data Lake (dados brutos) e Data Warehouse (dados curados).`,
      links:[{l:"SQL Tutorial — W3Schools",u:"https://www.w3schools.com/sql/"},{l:"LGPD — Lei 13.709/2018",u:"https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"}],
      yt:[{l:"SQL para Concursos — Completo",u:"https://www.youtube.com/results?search_query=SQL+HAVING+GROUP+BY+JOIN+FCC+concurso+fiscal"},{l:"Data Lake vs Warehouse vs Lakehouse",u:"https://www.youtube.com/results?search_query=data+lake+warehouse+lakehouse+FCC+concurso+tecnologia"}]
    },
  ]
},
{
  nome:"Finanças Públicas", cor:"#10b981", icon:"📈", peso:"10Q (Peso 2)",
  topicos:[
    {
      id:"FPB-1",
      titulo:"Funções do Estado (Musgrave), Bens Públicos e Resultado Fiscal",
      resumo:`🎯 O QUE É ISSO?
Finanças Públicas analisa o papel econômico do Estado. A FCC cobra as funções de Musgrave, falhas de mercado e o resultado fiscal (primário vs. nominal).

📌 FUNÇÕES DO GOVERNO (Musgrave, 1959):
1. ALOCATIVA: corrigir FALHAS DE MERCADO:
   • Bens públicos (não rival + não excludente → free rider)
   • Externalidades (positivas: subsidiar; negativas: tributar — Pigou)
   • Monopólios naturais (regulação)
   • Assimetria de informação (ex: seguro-saúde)

2. DISTRIBUTIVA: reduzir DESIGUALDADE:
   • Impostos progressivos (quem ganha mais paga proporcionalmente mais)
   • Transferências (bolsas, benefícios sociais)
   • Subsídios a bens e serviços essenciais

3. ESTABILIZADORA: manter CRESCIMENTO com ESTABILIDADE:
   • Política fiscal EXPANSIONISTA (↑G ou ↓T) na recessão
   • Política fiscal CONTRACIONISTA (↓G ou ↑T) na inflação
   • Combate ao desemprego (produto abaixo do potencial)

📌 BENS PÚBLICOS PUROS:
• NÃO RIVAL: consumo por A não diminui disponibilidade para B
• NÃO EXCLUDENTE: impossível excluir quem não paga → FREE RIDER
• Consequência: mercado falha → Estado deve prover
• Exemplos: defesa nacional, iluminação pública (inteira), farol marítimo

📌 FALHAS DE MERCADO E INTERVENÇÃO:
• EXTERNALIDADE NEGATIVA (poluição): custo social > privado → mais produção que o ótimo → IMPOSTO PIGOUVIANO (= dano marginal externo)
• EXTERNALIDADE POSITIVA (vacinação): benefício social > privado → menos produção que o ótimo → SUBSÍDIO ou provisão pública

📌 RESULTADO FISCAL:
• PRIMÁRIO: receitas não financeiras − despesas não financeiras (SEM juros e amortizações)
  → Mede esforço fiscal. Superávit primário = governo gera recursos para pagar juros.
• NOMINAL: Primário − Juros nominais
  → Variação total da dívida. Possível ter superávit primário + déficit nominal.
• NFSP (Necessidade de Financiamento do Setor Público): −Resultado Primário + Juros

💡 DICA FCC: O free rider é a consequência dos bens públicos que justifica a provisão estatal. E lembre: superávit primário NÃO significa que a dívida caiu (se os juros forem maiores, a dívida ainda cresce).`,
      links:[{l:"Teoria das Finanças Públicas",u:"https://www.google.com/search?q=funcoes+governo+Musgrave+financas+publicas+FCC+concurso"},{l:"NFSP — Tesouro Nacional",u:"https://www.gov.br/tesouronacional/pt-br/estatisticas-fiscais-e-planejamento"}],
      yt:[{l:"Funções Musgrave FCC",u:"https://www.youtube.com/results?search_query=funcoes+governo+musgrave+alocativa+distributiva+estabilizadora+FCC+concurso"},{l:"Bens Públicos e Externalidades",u:"https://www.youtube.com/results?search_query=bens+publicos+externalidades+free+rider+FCC+concurso+fiscal"}]
    },
  ]
},
];

// ─── UTILITÁRIOS ──────────────────────────────────────
const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

// ─── FLASHCARD COMPONENT ─────────────────────────────
function FlashcardView({topico, onVoltar}) {
  const [virado, setVirado] = useState(false);
  return (
    <div style={{maxWidth:680, margin:"0 auto"}}>
      <button onClick={onVoltar} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",marginBottom:16,fontSize:13}}>← Voltar</button>

      <div style={{background:C.card,border:`1px solid ${C.gold}44`,borderRadius:10,padding:"12px 16px",marginBottom:14}}>
        <h3 style={{color:C.goldL,margin:"0 0 2px",fontSize:15}}>{topico.titulo}</h3>
        <p style={{color:C.muted,margin:0,fontSize:11}}>Toque no card para ver o resumo completo</p>
      </div>

      {/* Card interativo */}
      <div onClick={()=>setVirado(v=>!v)} style={{
        cursor:"pointer",minHeight:260,borderRadius:14,padding:24,marginBottom:16,
        background:virado?"#0a1f40":C.card,
        border:`2px solid ${virado?C.blue:C.gold}`,
        transition:"all 0.35s ease",boxShadow:virado?"0 0 30px #3b82f622":"0 0 20px #c8a95122"
      }}>
        {!virado ? (
          <div style={{textAlign:"center",paddingTop:30}}>
            <div style={{fontSize:48,marginBottom:16}}>📇</div>
            <div style={{fontSize:20,fontWeight:700,color:C.goldL,lineHeight:1.4}}>{topico.titulo}</div>
            <div style={{marginTop:20,color:C.muted,fontSize:13}}>👆 Toque para ver o resumo</div>
          </div>
        ) : (
          <div>
            <div style={{fontSize:11,color:C.blue,marginBottom:12,textTransform:"uppercase",letterSpacing:1,fontWeight:700}}>📖 RESUMO COMPLETO</div>
            <pre style={{margin:0,fontSize:12,color:C.text,lineHeight:1.85,fontFamily:"Georgia,serif",whiteSpace:"pre-wrap",wordBreak:"break-word"}}>{topico.resumo}</pre>
          </div>
        )}
      </div>

      <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
        <button onClick={()=>setVirado(v=>!v)} style={{background:virado?C.gold:"#3b82f6",color:"#000",border:"none",borderRadius:8,padding:"10px 24px",cursor:"pointer",fontWeight:700,fontSize:13}}>
          {virado?"← Frente (Título)":"📖 Ver Resumo"}
        </button>
      </div>

      {/* Links */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px"}}>
        <div style={{fontWeight:700,color:C.gold,fontSize:12,marginBottom:10}}>🔗 Fontes e Videoaulas</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {topico.links?.map((l,i)=>(
            <a key={i} href={l.u} target="_blank" rel="noopener noreferrer"
              style={{background:C.card2,border:`1px solid ${C.border}`,color:"#93c5fd",borderRadius:6,padding:"6px 11px",fontSize:12,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>
              🌐 {l.l}
            </a>
          ))}
          {topico.yt?.map((l,i)=>(
            <a key={i} href={l.u} target="_blank" rel="noopener noreferrer"
              style={{background:"#1a0808",border:"1px solid #7f1d1d",color:"#fca5a5",borderRadius:6,padding:"6px 11px",fontSize:12,textDecoration:"none",display:"flex",alignItems:"center",gap:5}}>
              ▶️ {l.l}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── QUIZ COMPONENT ──────────────────────────────────
function QuizView({topico, questoes, onVoltar}) {
  const [limite, setLimite] = useState(null); // null = escolhendo, N = jogando
  const [qIdx, setQIdx] = useState(0);
  const [resp, setResp] = useState(null);
  const [feedback, setFeedback] = useState(false);
  const [acertos, setAcertos] = useState(0);
  const [erros, setErros] = useState(0);
  const [tempo, setTempo] = useState(0);
  const [fim, setFim] = useState(false);
  const timerRef = useRef(null);

  const questoesSelecionadas = questoes?.slice(0, limite) || [];

  useEffect(()=>{
    if(limite && !fim){
      timerRef.current = setInterval(()=>setTempo(t=>t+1),1000);
    }
    return ()=>clearInterval(timerRef.current);
  },[limite,fim]);

  if(!questoes||questoes.length===0) return (
    <div style={{textAlign:"center",padding:40}}>
      <div style={{fontSize:40,marginBottom:12}}>🚧</div>
      <h3 style={{color:C.gold}}>Questões em elaboração</h3>
      <p style={{color:C.muted,margin:"12px 0 20px"}}>As questões deste tópico serão adicionadas em breve.</p>
      <button onClick={onVoltar} style={{background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>← Voltar</button>
    </div>
  );

  // Seleção de quantidade
  if(!limite) {
    const maxQ = questoes.length;
    const opts = [5,10,20,maxQ].filter((v,i,a)=>v<=maxQ&&a.indexOf(v)===i).slice(0,4);
    return(
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <button onClick={onVoltar} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",marginBottom:16,fontSize:13}}>← Voltar</button>
        <div style={{background:C.card,border:`1px solid ${C.gold}44`,borderRadius:12,padding:28,textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:12}}>🎯</div>
          <h3 style={{color:C.goldL,margin:"0 0 6px"}}>Questões FCC — {topico.titulo}</h3>
          <p style={{color:C.muted,fontSize:13,margin:"0 0 24px"}}>{maxQ} questões disponíveis (2018–2025)</p>
          <p style={{color:C.text,fontSize:14,marginBottom:20}}>Quantas questões deseja praticar?</p>
          <div style={{display:"flex",justifyContent:"center",gap:12,flexWrap:"wrap",marginBottom:20}}>
            {opts.map(n=>(
              <button key={n} onClick={()=>setLimite(n)} style={{background:n===maxQ?C.gold:C.card2,color:n===maxQ?"#000":C.text,border:`2px solid ${n===maxQ?C.gold:C.border}`,borderRadius:10,padding:"16px 22px",cursor:"pointer",fontSize:16,fontWeight:700,minWidth:80}}>
                {n}{n===maxQ?"✨":""}
              </button>
            ))}
          </div>
          <p style={{color:C.muted,fontSize:11}}>Com cronômetro, gabarito comentado e contador de acertos/erros</p>
        </div>
      </div>
    );
  }

  const q = questoesSelecionadas[qIdx];
  const total = questoesSelecionadas.length;

  const confirmar=()=>{
    if(!resp)return;
    const ok=resp===q.g;
    if(ok)setAcertos(a=>a+1); else setErros(e=>e+1);
    setFeedback(true);
  };

  const proxima=()=>{
    if(qIdx+1>=total){setFim(true);clearInterval(timerRef.current);}
    else{setQIdx(i=>i+1);setResp(null);setFeedback(false);}
  };

  // Resultado final
  if(fim){
    const pct=Math.round((acertos/total)*100);
    return(
      <div style={{maxWidth:700,margin:"0 auto"}}>
        <div style={{background:C.card,border:`2px solid ${pct>=60?C.green:C.red}`,borderRadius:14,padding:28,textAlign:"center",marginBottom:16}}>
          <div style={{fontSize:52}}>{pct>=70?"🏆":pct>=50?"📚":"💪"}</div>
          <h2 style={{color:pct>=60?C.green:C.red,margin:"8px 0 4px"}}>{pct>=70?"Excelente!":pct>=50?"Bom progresso!":"Continue estudando!"}</h2>
          <p style={{color:C.muted,marginBottom:20,fontSize:13}}>{topico.titulo}</p>
          <div style={{display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap",marginBottom:20}}>
            {[["✅ Acertos",acertos,C.green],["❌ Erros",erros,C.red],["⏱ Tempo",fmt(tempo),C.blue],["📊 Aproveit.",pct+"%",pct>=60?C.gold:C.red]].map(([l,v,c])=>(
              <div key={l} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 20px",textAlign:"center"}}>
                <div style={{fontSize:26,fontWeight:700,color:c}}>{v}</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{height:8,background:C.border,borderRadius:4,maxWidth:400,margin:"0 auto"}}>
            <div style={{height:"100%",width:`${pct}%`,background:pct>=70?C.green:pct>=50?"#f59e0b":C.red,borderRadius:4}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
          <button onClick={()=>{setQIdx(0);setResp(null);setFeedback(false);setAcertos(0);setErros(0);setTempo(0);setFim(false);}} style={{background:C.gold,color:"#000",border:"none",borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>🔄 Refazer</button>
          <button onClick={()=>{setLimite(null);setQIdx(0);setResp(null);setFeedback(false);setAcertos(0);setErros(0);setTempo(0);setFim(false);}} style={{background:"transparent",color:C.gold,border:`1px solid ${C.gold}`,borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>↩ Nova quantidade</button>
          <button onClick={onVoltar} style={{background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700}}>← Tópico</button>
        </div>
      </div>
    );
  }

  return(
    <div style={{maxWidth:700,margin:"0 auto"}}>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8}}>
        <button onClick={onVoltar} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"5px 12px",cursor:"pointer",fontSize:12}}>← Voltar</button>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <span style={{color:C.green,fontSize:13,fontWeight:700}}>✅ {acertos}</span>
          <span style={{color:C.red,fontSize:13,fontWeight:700}}>❌ {erros}</span>
          <span style={{fontFamily:"monospace",fontSize:18,fontWeight:700,color:tempo>300?C.red:C.green}}>⏱ {fmt(tempo)}</span>
        </div>
        <span style={{fontSize:12,color:C.muted}}>Q{qIdx+1}/{total}</span>
      </div>

      {/* Barra progresso */}
      <div style={{height:4,background:C.border,borderRadius:2,marginBottom:16}}>
        <div style={{height:"100%",width:`${((qIdx+1)/total)*100}%`,background:C.gold,borderRadius:2,transition:"width 0.3s"}}/>
      </div>

      {/* Questão */}
      <div style={{background:C.card,border:`1px solid ${feedback?(resp===q.g?C.green:C.red):C.border}`,borderRadius:12,padding:20,transition:"border 0.3s"}}>
        <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
          <span style={{background:"#0f264755",border:"1px solid #1e3a5f",color:"#7bb3e8",padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700}}>Q{qIdx+1}</span>
          <span style={{color:C.muted,fontSize:11}}>{q.r}</span>
          <span style={{color:C.muted,fontSize:11}}>• {q.a}</span>
        </div>
        <p style={{fontSize:13,color:C.text,lineHeight:1.85,marginBottom:16}}>{q.q}</p>

        {/* Alternativas */}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
          {q.o.map((alt,j)=>{
            const L=alt[0];
            const isSel=resp===L;
            const isCorr=feedback&&L===q.g;
            const isErr=feedback&&isSel&&L!==q.g;
            let bg="transparent",bdr=C.border,col=C.text;
            if(isCorr){bg="#16a34a22";bdr=C.green;col=C.green;}
            else if(isErr){bg="#dc262222";bdr=C.red;col=C.red;}
            else if(isSel&&!feedback){bg=C.gold+"20";bdr=C.gold;col=C.gold;}
            else if(feedback){col=C.muted;}
            return(
              <div key={j} onClick={()=>!feedback&&setResp(L)} style={{background:bg,border:`2px solid ${bdr}`,borderRadius:8,padding:"10px 14px",cursor:feedback?"default":"pointer",color:col,fontSize:13,lineHeight:1.65,transition:"all 0.15s"}}>
                {alt}{isCorr?" ✅":isErr?" ❌":""}
              </div>
            );
          })}
        </div>

        {/* Confirmar */}
        {!feedback&&(
          <div style={{textAlign:"center"}}>
            <button onClick={confirmar} disabled={!resp} style={{background:resp?C.gold:"#2d3748",color:resp?"#000":C.muted,border:"none",borderRadius:8,padding:"11px 28px",cursor:resp?"pointer":"not-allowed",fontWeight:700,fontSize:14,transition:"all 0.2s"}}>
              {resp?"✓ Confirmar Resposta":"Selecione uma alternativa"}
            </button>
          </div>
        )}

        {/* Feedback */}
        {feedback&&(
          <div>
            <div style={{background:resp===q.g?"#16a34a22":"#dc262222",border:`2px solid ${resp===q.g?C.green:C.red}`,borderRadius:10,padding:"14px 16px",marginBottom:12}}>
              <div style={{fontWeight:700,fontSize:17,color:resp===q.g?C.green:C.red,marginBottom:resp!==q.g?6:0}}>
                {resp===q.g?"✅ Você acertou! 🎯":"❌ Você errou!"}
              </div>
              {resp!==q.g&&<div style={{fontSize:12,color:C.text}}>Resposta correta: <strong style={{color:C.green}}>{q.g}</strong></div>}
            </div>
            <div style={{background:"#0f2647",border:"1px solid #1e3a5f",borderRadius:8,padding:"12px 14px",marginBottom:14}}>
              <div style={{fontWeight:700,color:"#7bb3e8",marginBottom:6,fontSize:12}}>📖 Gabarito Comentado</div>
              <p style={{margin:0,fontSize:12,color:C.text,lineHeight:1.85}}>{q.c||q.com}</p>
            </div>
            <div style={{textAlign:"right"}}>
              <button onClick={proxima} style={{background:qIdx+1>=total?C.green:C.gold,color:"#000",border:"none",borderRadius:8,padding:"10px 22px",cursor:"pointer",fontWeight:700,fontSize:13}}>
                {qIdx+1>=total?"📊 Ver Resultado":"Próxima Questão →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TÓPICO VIEW ─────────────────────────────────────
function TopicoView({topico, onVoltar, corDisc}) {
  const [modo, setModo] = useState(null);
  const temQ = !!Q[topico.id];
  const nQ = temQ ? Q[topico.id].length : 0;

  if(modo==="flashcard") return <FlashcardView topico={topico} onVoltar={()=>setModo(null)}/>;
  if(modo==="quiz") return <QuizView topico={topico} questoes={Q[topico.id]} onVoltar={()=>setModo(null)}/>;

  return(
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <button onClick={onVoltar} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",marginBottom:14,fontSize:13}}>← Voltar</button>

      <div style={{background:C.card,border:`1px solid ${corDisc}44`,borderLeft:`4px solid ${corDisc}`,borderRadius:10,padding:"14px 16px",marginBottom:16}}>
        <h3 style={{color:C.goldL,margin:"0 0 4px",fontSize:15}}>{topico.titulo}</h3>
        <p style={{margin:"0 0 10px",fontSize:12,color:C.text,lineHeight:1.7}}>{topico.resumo.substring(0,120)}...</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
          {topico.links?.map((l,i)=><a key={i} href={l.u} target="_blank" rel="noopener noreferrer" style={{background:C.card2,border:`1px solid ${C.border}`,color:"#93c5fd",borderRadius:5,padding:"4px 9px",fontSize:11,textDecoration:"none"}}>🔗 {l.l}</a>)}
          {topico.yt?.map((l,i)=><a key={i} href={l.u} target="_blank" rel="noopener noreferrer" style={{background:"#1a0808",border:"1px solid #7f1d1d",color:"#fca5a5",borderRadius:5,padding:"4px 9px",fontSize:11,textDecoration:"none"}}>▶️ {l.l}</a>)}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div onClick={()=>setModo("flashcard")} style={{background:C.card,border:"2px solid #3b82f6",borderRadius:12,padding:24,cursor:"pointer",textAlign:"center",transition:"transform 0.15s"}}
          onMouseOver={e=>e.currentTarget.style.transform="translateY(-3px)"}
          onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
          <div style={{fontSize:42,marginBottom:10}}>📇</div>
          <div style={{fontWeight:700,color:"#3b82f6",fontSize:15,marginBottom:6}}>Flashcard</div>
          <div style={{color:C.muted,fontSize:12}}>Resumo interativo com virada de card, links e videoaulas</div>
        </div>
        <div onClick={()=>temQ&&setModo("quiz")} style={{background:C.card,border:`2px solid ${temQ?"#a855f7":C.border}`,borderRadius:12,padding:24,cursor:temQ?"pointer":"default",textAlign:"center",opacity:temQ?1:0.5,transition:"transform 0.15s"}}
          onMouseOver={e=>{if(temQ)e.currentTarget.style.transform="translateY(-3px)";}}
          onMouseOut={e=>e.currentTarget.style.transform="translateY(0)"}>
          <div style={{fontSize:42,marginBottom:10}}>🎯</div>
          <div style={{fontWeight:700,color:temQ?"#a855f7":C.muted,fontSize:15,marginBottom:6}}>Questões FCC</div>
          <div style={{color:C.muted,fontSize:12}}>{temQ?`${nQ}Q disponíveis • Escolha de 5 a ${nQ} questões`:"Em breve"}</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────
export default function FlashcardsApp() {
  const [view, setView] = useState("home");
  const [discAtiva, setDiscAtiva] = useState(null);
  const [topicoAtivo, setTopicoAtivo] = useState(null);

  if(view==="topico"&&topicoAtivo) return(
    <TopicoView topico={topicoAtivo} corDisc={discAtiva?.cor||C.gold}
      onVoltar={()=>{setView("disc");setTopicoAtivo(null);}}/>
  );

  if(view==="disc"&&discAtiva) return(
    <div>
      <button onClick={()=>{setView("home");setDiscAtiva(null);}} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",marginBottom:16,fontSize:13}}>← Todas as Disciplinas</button>
      <div style={{background:C.card,border:`1px solid ${discAtiva.cor}`,borderLeft:`4px solid ${discAtiva.cor}`,borderRadius:10,padding:"14px 16px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
          <h2 style={{color:discAtiva.cor,margin:0,fontSize:17}}>{discAtiva.icon} {discAtiva.nome}</h2>
          <span style={{background:discAtiva.cor+"22",border:`1px solid ${discAtiva.cor}`,color:discAtiva.cor,padding:"3px 10px",borderRadius:4,fontSize:11,fontWeight:700}}>{discAtiva.peso}</span>
        </div>
        <p style={{margin:"6px 0 0",color:C.muted,fontSize:12}}>{discAtiva.topicos.length} tópico(s) — Clique para estudar com Flashcard ou Questões FCC</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {discAtiva.topicos.map((t,i)=>{
          const temQ=!!Q[t.id];
          const nQ=temQ?Q[t.id].length:0;
          return(
            <div key={i} onClick={()=>{setTopicoAtivo(t);setView("topico");}}
              style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",transition:"border-color 0.2s,transform 0.15s"}}
              onMouseOver={e=>{e.currentTarget.style.borderColor=discAtiva.cor;e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseOut={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                <div style={{fontWeight:700,color:C.text,fontSize:14}}>{t.titulo}</div>
                <div style={{display:"flex",gap:6}}>
                  <span style={{background:"#3b82f622",border:"1px solid #3b82f6",color:"#3b82f6",fontSize:10,padding:"2px 7px",borderRadius:3,fontWeight:700}}>📇 Flashcard</span>
                  {temQ&&<span style={{background:"#a855f722",border:"1px solid #a855f7",color:"#a855f7",fontSize:10,padding:"2px 7px",borderRadius:3,fontWeight:700}}>🎯 {nQ}Q</span>}
                </div>
              </div>
              <p style={{margin:"6px 0 0",fontSize:12,color:C.muted,lineHeight:1.5}}>{t.resumo.substring(0,100)}…</p>
            </div>
          );
        })}
      </div>
    </div>
  );

  // HOME
  return(
    <div>
      <div style={{background:C.card,border:`1px solid ${C.gold}44`,borderRadius:10,padding:"14px 16px",marginBottom:18}}>
        <h2 style={{color:C.gold,margin:"0 0 6px",fontSize:16}}>📚 Resumos & Flashcards — SEFAZ/CE 2026</h2>
        <p style={{margin:"0 0 8px",fontSize:12,color:C.muted,lineHeight:1.7}}>Cobertura completa do Anexo VI do Edital nº 01/2026. Selecione uma disciplina para acessar Resumos Completos, Flashcards interativos e Questões FCC com gabarito comentado, cronômetro e contador de acertos.</p>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          <span style={{background:"#3b82f622",border:"1px solid #3b82f6",color:"#3b82f6",borderRadius:4,padding:"3px 10px",fontSize:11,fontWeight:700}}>📇 Flashcards</span>
          <span style={{background:"#a855f722",border:"1px solid #a855f7",color:"#a855f7",borderRadius:4,padding:"3px 10px",fontSize:11,fontWeight:700}}>🎯 Questões FCC 2018–2025</span>
          <span style={{background:"#22c55e22",border:"1px solid #22c55e",color:"#22c55e",borderRadius:4,padding:"3px 10px",fontSize:11,fontWeight:700}}>⏱ Cronômetro</span>
          <span style={{background:"#ef444422",border:"1px solid #ef4444",color:"#ef4444",borderRadius:4,padding:"3px 10px",fontSize:11,fontWeight:700}}>📊 Acertos/Erros</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:10}}>
        {DISC.map((d,i)=>(
          <div key={i} onClick={()=>{setDiscAtiva(d);setView("disc");}}
            style={{background:C.card,border:`1px solid ${C.border}`,borderLeft:`4px solid ${d.cor}`,borderRadius:10,padding:"14px 16px",cursor:"pointer",transition:"transform 0.15s,border-color 0.2s"}}
            onMouseOver={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.borderColor=d.cor;}}
            onMouseOut={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor=C.border;}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <span style={{fontSize:24}}>{d.icon}</span>
              <div style={{textAlign:"right"}}>
                <span style={{background:d.cor+"22",border:`1px solid ${d.cor}`,color:d.cor,fontSize:10,padding:"2px 6px",borderRadius:3,fontWeight:700}}>{d.peso}</span>
              </div>
            </div>
            <div style={{fontWeight:700,color:C.text,fontSize:13,marginBottom:4}}>{d.nome}</div>
            <div style={{fontSize:11,color:C.muted}}>{d.topicos.length} tópico(s) • Flashcards + Questões FCC →</div>
          </div>
        ))}
      </div>
    </div>
  );
}
