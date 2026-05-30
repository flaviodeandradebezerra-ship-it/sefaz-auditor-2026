// Leis, Fontes e Jurisprudencias - SEFAZ/CE 2026
// Estrutura: cada disciplina -> { leis:[], leisComentadas:[], fontes:[], juris:[], jurisComentadas:[] }
// leis: {ref, texto}  | leisComentadas: {ref, texto, comentario}
// fontes: {tipo, ref, desc}  | juris: {ref, tese}  | jurisComentadas: {ref, tese, comentario}

export const LEIS = {

"Direito Tributario": {
  leis: [
    {ref:"CF/88, art. 145", texto:"A Uniao, os Estados, o DF e os Municipios poderao instituir os seguintes tributos: I - impostos; II - taxas, em razao do exercicio do poder de policia ou pela utilizacao, efetiva ou potencial, de servicos publicos especificos e divisiveis; III - contribuicao de melhoria, decorrente de obras publicas."},
    {ref:"CF/88, art. 150, I a VI", texto:"Sem prejuizo de outras garantias, e vedado exigir ou aumentar tributo sem lei (legalidade); instituir tratamento desigual entre contribuintes em situacao equivalente (isonomia); cobrar tributos em relacao a fatos geradores anteriores a lei (irretroatividade); no mesmo exercicio e antes de 90 dias (anterioridade); com efeito de confisco; e instituir impostos sobre patrimonio, renda ou servicos uns dos outros, templos, partidos, entidades sindicais, instituicoes de educacao/assistencia e livros (imunidades)."},
    {ref:"CTN, art. 3", texto:"Tributo e toda prestacao pecuniaria compulsoria, em moeda ou cujo valor nela se possa exprimir, que nao constitua sancao de ato ilicito, instituida em lei e cobrada mediante atividade administrativa plenamente vinculada."},
    {ref:"CTN, art. 113", texto:"A obrigacao tributaria e principal ou acessoria. A principal surge com o fato gerador, tem por objeto o pagamento de tributo ou penalidade. A acessoria decorre da legislacao tributaria e tem por objeto prestacoes positivas ou negativas no interesse da arrecadacao/fiscalizacao."},
    {ref:"CTN, art. 142", texto:"Compete privativamente a autoridade administrativa constituir o credito tributario pelo lancamento, assim entendido o procedimento administrativo tendente a verificar a ocorrencia do fato gerador, determinar a materia tributavel, calcular o montante, identificar o sujeito passivo e propor penalidade cabivel."},
    {ref:"CTN, art. 151", texto:"Suspendem a exigibilidade do credito tributario: moratoria; deposito do montante integral; reclamacoes e recursos administrativos; concessao de liminar em MS; concessao de liminar/tutela em outras acoes; e parcelamento."},
    {ref:"CTN, art. 156", texto:"Extinguem o credito tributario: pagamento; compensacao; transacao; remissao; prescricao e decadencia; conversao de deposito em renda; pagamento antecipado e homologacao; consignacao em pagamento; decisao administrativa irreformavel; decisao judicial transitada em julgado; dacao em pagamento de bens imoveis."},
    {ref:"CTN, art. 173 e 174", texto:"O direito de a Fazenda constituir o credito (decadencia) extingue-se em 5 anos contados do 1o dia do exercicio seguinte. A acao de cobranca (prescricao) prescreve em 5 anos da constituicao definitiva do credito."},
    {ref:"EC 132/2023", texto:"Reforma tributaria do consumo: cria o IBS (estadual/municipal) e a CBS (federal), o Imposto Seletivo, e estabelece os principios da simplicidade, transparencia, justica tributaria, cooperacao e defesa do meio ambiente, alem da neutralidade."},
  ],
  leisComentadas: [
    {ref:"CTN, art. 3", texto:"Tributo nao constitui sancao de ato ilicito.", comentario:"Distingue tributo de multa: a hipotese de incidencia nunca e um ato ilicito. Porem, pelo principio pecunia non olet (art. 118), a renda obtida de atividade ilicita E tributavel. Cobrado por atividade 'plenamente vinculada' = sem discricionariedade do fiscal."},
    {ref:"CTN, art. 150, par.4", texto:"Homologacao tacita em 5 anos do fato gerador.", comentario:"No lancamento por homologacao com pagamento antecipado e sem dolo/fraude, a decadencia conta da DATA DO FATO GERADOR. Sem pagamento algum, aplica-se o art. 173, I (1o dia do exercicio seguinte). Pegadinha classica da FCC."},
    {ref:"CF/88, art. 150, III, b e c", texto:"Anterioridade anual e nonagesimal.", comentario:"Regra: tributo novo/majorado so vale no exercicio seguinte E apos 90 dias. Excecoes importantes: II, IE, IOF (nenhuma), IPI (so noventena), IR (so anual). Materializa a NAO SURPRESA do contribuinte."},
  ],
  fontes: [
    {tipo:"Lei", ref:"Lei 5.172/1966 (CTN)", desc:"Codigo Tributario Nacional - normas gerais de direito tributario, recepcionado como lei complementar."},
    {tipo:"Constituicao", ref:"CF/88, arts. 145-162", desc:"Sistema Tributario Nacional: competencias, limitacoes ao poder de tributar, reparticao de receitas."},
    {tipo:"Lei Complementar", ref:"LC 87/1996 (Lei Kandir)", desc:"Normas gerais do ICMS."},
    {tipo:"Lei Complementar", ref:"LC 116/2003", desc:"Normas gerais do ISS e lista de servicos."},
    {tipo:"Lei Complementar", ref:"LC 123/2006", desc:"Simples Nacional e Estatuto da ME/EPP."},
    {tipo:"Lei Complementar", ref:"LC 214/2025", desc:"Regulamenta IBS, CBS e Imposto Seletivo (reforma tributaria)."},
  ],
  juris: [
    {ref:"Sumula Vinculante 24 (STF)", tese:"Nao se tipifica crime material contra a ordem tributaria (Lei 8.137/90, art. 1, I-IV) antes do lancamento definitivo do tributo."},
    {ref:"Sumula 436 (STJ)", tese:"A entrega de declaracao pelo contribuinte reconhecendo o debito constitui o credito tributario, dispensando outra providencia do Fisco."},
    {ref:"Sumula 555 (STJ)", tese:"Quando nao houver declaracao do debito, o prazo decadencial do lancamento conta-se do art. 173, I do CTN."},
    {ref:"RE 574.706 (STF)", tese:"O ICMS nao compoe a base de calculo do PIS e da COFINS (tese do seculo)."},
    {ref:"ADC 49 (STF)", tese:"Nao incide ICMS na transferencia de mercadorias entre estabelecimentos do mesmo titular."},
  ],
  jurisComentadas: [
    {ref:"Sumula Vinculante 24 (STF)", tese:"Crime material tributario exige lancamento definitivo.", comentario:"So vale para os crimes MATERIAIS do art. 1, I-IV da Lei 8.137/90 (que dependem de resultado - supressao do tributo). Os crimes FORMAIS (art. 2) consumam-se com a conduta, independentemente do lancamento. Enquanto pende o processo administrativo, nao corre a prescricao penal nem cabe denuncia."},
    {ref:"RE 593.849 (STF)", tese:"Restituicao na ST quando a base efetiva e menor que a presumida.", comentario:"E devida a restituicao da diferenca do ICMS-ST pago a maior quando a base de calculo efetiva da operacao for inferior a presumida. Superou entendimento anterior (ADI 1851). Estados tambem podem cobrar o complemento se a base efetiva for maior."},
    {ref:"ADI 5659 (STF)", tese:"Operacoes com software sao tributadas pelo ISS, nao pelo ICMS.", comentario:"Independe de ser software de prateleira ou por encomenda, fisico ou por download: prevalece a obrigacao de FAZER (licenciamento/cessao de uso), atraindo o ISS municipal. Afastou a incidencia de ICMS sobre software."},
  ],
},

"Legislacao Tributaria CE": {
  leis: [
    {ref:"Lei 12.670/1996 (CE)", texto:"Dispoe sobre o ICMS no Estado do Ceara: fato gerador, base de calculo, aliquotas, contribuintes, responsabilidade, substituicao tributaria e regimes de apuracao."},
    {ref:"Decreto 33.327/2019 (RICMS-CE)", texto:"Regulamento do ICMS do Ceara: consolida obrigacoes principais e acessorias, beneficios, substituicao tributaria, antecipacao e fiscalizacao."},
    {ref:"CF/88, art. 155, II", texto:"Compete aos Estados e ao DF instituir impostos sobre operacoes relativas a circulacao de mercadorias e sobre prestacoes de servicos de transporte interestadual/intermunicipal e de comunicacao (ICMS)."},
    {ref:"CF/88, art. 155, I", texto:"Compete aos Estados/DF instituir imposto sobre transmissao causa mortis e doacao (ITCD), de quaisquer bens ou direitos."},
    {ref:"CF/88, art. 155, III", texto:"Compete aos Estados/DF instituir imposto sobre a propriedade de veiculos automotores (IPVA)."},
    {ref:"ADCT, art. 82 e Lei estadual do FECOP", texto:"Adicional de ate 2% no ICMS sobre produtos superfluos, vinculado ao Fundo Estadual de Combate a Pobreza (FECOP)."},
  ],
  leisComentadas: [
    {ref:"LC 87/96, art. 11", texto:"Local da operacao define o sujeito ativo.", comentario:"Em regra, o ICMS cabe ao estado do estabelecimento onde se encontra a mercadoria no momento do fato gerador (origem). Na importacao, cabe ao estado do destinatario juridico (Sumula 661 STF), ainda que o desembaraco ocorra em outro estado - relevante para o porto de Pecem/CE."},
    {ref:"EC 87/2015 (DIFAL)", texto:"Diferencial de aliquota nas operacoes interestaduais a consumidor final.", comentario:"Na venda a consumidor final de outro estado, recolhe-se a diferenca entre a aliquota interna do destino e a interestadual. Se o destinatario NAO e contribuinte, o remetente recolhe ao destino (LC 190/2022). Se e contribuinte, o proprio adquirente recolhe."},
  ],
  fontes: [
    {tipo:"Lei Estadual", ref:"Lei 12.670/1996", desc:"Lei do ICMS do Ceara."},
    {tipo:"Decreto", ref:"Decreto 33.327/2019", desc:"Regulamento do ICMS do Ceara (RICMS-CE)."},
    {tipo:"Lei Complementar", ref:"LC 24/1975", desc:"Convenios CONFAZ - exige unanimidade para beneficios de ICMS."},
    {tipo:"Site oficial", ref:"sefaz.ce.gov.br", desc:"Legislacao, pautas, MVA, calendario fiscal e servicos da SEFAZ-CE."},
  ],
  juris: [
    {ref:"Sumula Vinculante 48 (STF)", tese:"Na importacao, o ICMS incide no desembaraco aduaneiro; nao incide antes dele."},
    {ref:"Sumula 661 (STF)", tese:"Na importacao, o ICMS cabe ao estado do destinatario da mercadoria."},
    {ref:"Sumula 391 (STJ)", tese:"O ICMS incide sobre o valor da demanda de potencia de energia eletrica efetivamente utilizada."},
    {ref:"Sumula 166 (STJ)", tese:"Nao constitui fato gerador do ICMS o simples deslocamento de mercadoria entre estabelecimentos do mesmo contribuinte."},
  ],
  jurisComentadas: [
    {ref:"Sumula 391 (STJ)", tese:"ICMS so sobre a demanda de potencia efetivamente usada.", comentario:"A demanda de potencia contratada mas NAO utilizada nao integra a base do ICMS sobre energia eletrica - so se tributa a energia efetivamente consumida. Tema recorrente em provas de Legislacao do CE, junto com a discussao sobre TUST/TUSD."},
    {ref:"Tema 745 (STF)", tese:"Aliquota de ICMS de energia e telecom nao pode superar a geral.", comentario:"E inconstitucional fixar aliquota de ICMS sobre energia eletrica e telecomunicacoes superior a aliquota geral, por violar a seletividade em funcao da essencialidade. Levou varios estados (inclusive o CE) a reduzir aliquotas desses itens essenciais."},
  ],
},

"Contabilidade (Geral, Publica, Avancada e Custos)": {
  leis: [
    {ref:"Lei 6.404/1976", texto:"Lei das Sociedades por Acoes: estrutura das demonstracoes financeiras, criterios de avaliacao do ativo/passivo, reservas, dividendos e principios contabeis."},
    {ref:"Lei 4.320/1964", texto:"Normas gerais de direito financeiro para elaboracao e controle dos orcamentos e balancos da Uniao, Estados, Municipios e DF (estagios da receita e despesa, balancos publicos)."},
    {ref:"Lei 11.638/2007", texto:"Alterou a Lei 6.404/76 para convergencia as normas internacionais (IFRS); extinguiu a reavaliacao espontanea e introduziu o ajuste a valor justo/presente."},
    {ref:"MCASP (STN)", texto:"Manual de Contabilidade Aplicada ao Setor Publico: padroniza os procedimentos contabeis patrimoniais e orcamentarios dos entes da federacao."},
  ],
  leisComentadas: [
    {ref:"Lei 4.320/64, art. 35", texto:"Regime contabil misto.", comentario:"Pertencem ao exercicio as RECEITAS nele arrecadadas (regime de CAIXA) e as DESPESAS nele legalmente EMPENHADAS (regime de COMPETENCIA orcamentaria). Atencao: na otica PATRIMONIAL (MCASP), tudo segue competencia plena - distincao muito cobrada."},
    {ref:"Lei 6.404/76, art. 178", texto:"Ordem do balanco patrimonial.", comentario:"O ativo e disposto em ordem DECRESCENTE de liquidez (Circulante, depois Nao Circulante: realizavel a LP, investimentos, imobilizado, intangivel). O passivo, por ordem de exigibilidade. O PL fecha a equacao A = P + PL."},
  ],
  fontes: [
    {tipo:"Pronunciamentos", ref:"CPC (Comite de Pronunciamentos Contabeis)", desc:"CPC 00, 01, 04, 06, 16, 27, 47 etc. - convergencia as IFRS."},
    {tipo:"Normas", ref:"NBC TSP (CFC)", desc:"Normas Brasileiras de Contabilidade Aplicadas ao Setor Publico."},
    {tipo:"Manual", ref:"MCASP - STN", desc:"Manual de Contabilidade Aplicada ao Setor Publico (parte geral, PCASP, DCASP)."},
  ],
  juris: [
    {ref:"CPC 47 / IFRS 15", tese:"Receita reconhecida quando (ou a medida que) a obrigacao de desempenho e satisfeita - 5 passos."},
    {ref:"CPC 01 / IAS 36", tese:"Reducao ao valor recuperavel (impairment): valor contabil nao pode exceder o maior entre valor justo liquido e valor em uso."},
    {ref:"CPC 27 / IAS 16", tese:"Imobilizado mensurado ao custo ou por reavaliacao; sujeito a depreciacao sistematica."},
  ],
  jurisComentadas: [
    {ref:"CPC 47", tese:"Modelo de 5 passos para reconhecimento de receita.", comentario:"1) identificar o contrato; 2) identificar as obrigacoes de desempenho; 3) determinar o preco da transacao; 4) alocar o preco as obrigacoes; 5) reconhecer a receita quando satisfeita cada obrigacao. Substituiu a regra antiga de transferencia de riscos e beneficios."},
    {ref:"CPC 06 (R2) / IFRS 16", tese:"Arrendamento: arrendatario reconhece ativo de direito de uso e passivo.", comentario:"Acabou com a distincao operacional/financeiro para o arrendatario: quase todo arrendamento vai ao balanco (ativo de direito de uso + passivo a valor presente). Excecoes: curto prazo (ate 12 meses) e baixo valor, lancados como despesa."},
  ],
},

"Direito Financeiro (LRF e Orcamento)": {
  leis: [
    {ref:"LC 101/2000 (LRF)", texto:"Lei de Responsabilidade Fiscal: normas de financas publicas voltadas a responsabilidade na gestao fiscal - limites de despesa com pessoal e divida, metas, renuncia de receita, transparencia."},
    {ref:"CF/88, arts. 165-169", texto:"Orcamento: PPA, LDO e LOA; vedacoes orcamentarias (art. 167); regra de ouro; limites de despesa com pessoal."},
    {ref:"Lei 4.320/1964", texto:"Normas gerais de direito financeiro: classificacao de receitas/despesas, creditos adicionais, estagios da execucao, balancos."},
  ],
  leisComentadas: [
    {ref:"LRF, art. 19", texto:"Limites de despesa com pessoal.", comentario:"Uniao 50% da RCL; Estados, DF e Municipios 60%. Nos Estados, reparte-se: Executivo 49%, Judiciario 6%, Legislativo+TC 3%, MP 2%. Limite prudencial = 95% do limite (gera vedacoes). Apuracao pela RCL dos ultimos 12 meses."},
    {ref:"CF/88, art. 167, III", texto:"Regra de ouro.", comentario:"Veda operacoes de credito que excedam o montante das despesas de CAPITAL, salvo as autorizadas por creditos suplementares/especiais com finalidade precisa, aprovados por maioria absoluta. Objetivo: o endividamento financiar investimento, nao custeio."},
  ],
  fontes: [
    {tipo:"Lei Complementar", ref:"LC 101/2000", desc:"Lei de Responsabilidade Fiscal."},
    {tipo:"Lei", ref:"Lei 4.320/1964", desc:"Normas gerais de direito financeiro e orcamentos."},
    {tipo:"Relatorios", ref:"RREO e RGF", desc:"Relatorio Resumido da Execucao Orcamentaria (bimestral) e Relatorio de Gestao Fiscal (quadrimestral)."},
  ],
  juris: [
    {ref:"ADI 2238 (STF)", tese:"Julgou diversos dispositivos da LRF, em regra confirmando sua constitucionalidade com algumas interpretacoes conformes."},
    {ref:"Tema 426 (STF)", tese:"Discussao sobre limites e exclusoes no calculo da despesa com pessoal para fins da LRF."},
  ],
  jurisComentadas: [
    {ref:"ADI 2238 (STF)", tese:"Constitucionalidade geral da LRF.", comentario:"O STF, em controle concentrado, manteve a essencia da LRF, declarando inconstitucionais ou interpretando conforme apenas pontos especificos. Consolidou a LRF como marco da responsabilidade fiscal, reforcando limites de pessoal e divida e a transparencia."},
  ],
},

"Administracao Publica, Constitucional e Administrativo": {
  leis: [
    {ref:"CF/88, art. 37", texto:"A administracao publica direta e indireta obedece aos principios de legalidade, impessoalidade, moralidade, publicidade e eficiencia (LIMPE), alem de regras sobre concurso, licitacao e improbidade."},
    {ref:"Lei 14.133/2021", texto:"Nova Lei de Licitacoes e Contratos Administrativos: modalidades (pregao, concorrencia, concurso, leilao, dialogo competitivo), fases, criterios de julgamento e sancoes."},
    {ref:"Lei 8.429/1992 (com a Lei 14.230/2021)", texto:"Improbidade administrativa: atos que importam enriquecimento ilicito, dano ao erario e violacao a principios; exige DOLO apos a reforma de 2021."},
    {ref:"Lei 12.527/2011 (LAI)", texto:"Lei de Acesso a Informacao: publicidade como regra e sigilo como excecao; transparencia ativa e passiva; prazos de classificacao (reservada 5, secreta 15, ultrassecreta 25 anos)."},
    {ref:"Decreto 9.203/2017", texto:"Politica de governanca da administracao publica federal: principios e mecanismos de lideranca, estrategia e controle."},
  ],
  leisComentadas: [
    {ref:"Lei 8.429/92, art. 11 (pos Lei 14.230/21)", texto:"Atos que atentam contra principios exigem dolo.", comentario:"Apos 2021, TODOS os atos de improbidade exigem DOLO (vontade livre e consciente). O mero erro ou a culpa nao caracterizam mais improbidade. O rol do art. 11 tornou-se taxativo. Mudanca muito cobrada em provas recentes."},
    {ref:"Lei 14.133/21, art. 28", texto:"Modalidades de licitacao.", comentario:"Extinguiu tomada de precos e convite. Restam: pregao (bens/servicos comuns), concorrencia, concurso, leilao e o novo DIALOGO COMPETITIVO (para solucoes inovadoras). Pregao e concorrencia usam os mesmos criterios de julgamento."},
  ],
  fontes: [
    {tipo:"Constituicao", ref:"CF/88, arts. 37-41", desc:"Administracao publica e servidores."},
    {tipo:"Lei", ref:"Lei 14.133/2021", desc:"Licitacoes e contratos."},
    {tipo:"Lei", ref:"Lei 9.784/1999", desc:"Processo administrativo federal."},
    {tipo:"Referencial", ref:"TCU - Referencial de Governanca", desc:"Mecanismos de lideranca, estrategia e controle."},
  ],
  juris: [
    {ref:"Sumula Vinculante 13 (STF)", tese:"Nepotismo: e vedada a nomeacao de parente para cargo em comissao/funcao de confianca na administracao."},
    {ref:"Sumula 473 (STF)", tese:"A administracao pode anular seus atos ilegais e revogar os inconvenientes, respeitados direitos adquiridos."},
    {ref:"RE 841.526 (STF)", tese:"Responsabilidade civil objetiva do Estado por morte de detento sob sua custodia."},
  ],
  jurisComentadas: [
    {ref:"Sumula Vinculante 13 (STF)", tese:"Veda o nepotismo na administracao publica.", comentario:"Proibe a nomeacao de conjuge, companheiro ou parente ate 3o grau de autoridade nomeante para cargos em comissao/funcao de confianca. Inclui o nepotismo cruzado (troca de nomeacoes). Excecao: cargos politicos (ex: secretario), salvo fraude evidente."},
    {ref:"Sumula 473 (STF)", tese:"Autotutela administrativa.", comentario:"Fundamenta o poder-dever de a Administracao rever seus proprios atos: ANULAR os ilegais (efeito ex tunc) e REVOGAR os inconvenientes/inoportunos (ex nunc), sempre respeitados os direitos adquiridos e o devido processo. Base do controle interno."},
  ],
},

"Economia e Financas Publicas": {
  leis: [
    {ref:"CF/88, art. 145, par.1", texto:"Sempre que possivel, os impostos terao carater pessoal e serao graduados segundo a capacidade economica do contribuinte (capacidade contributiva)."},
    {ref:"CF/88, art. 70-75", texto:"Fiscalizacao contabil, financeira e orcamentaria; controle externo pelo Congresso com auxilio do TCU; controle interno."},
  ],
  leisComentadas: [
    {ref:"Funcoes de Musgrave", texto:"Alocativa, distributiva e estabilizadora.", comentario:"ALOCATIVA: corrigir falhas de mercado (bens publicos, externalidades, monopolios). DISTRIBUTIVA: reduzir desigualdade (tributacao progressiva, transferencias). ESTABILIZADORA: emprego, precos e crescimento (politicas fiscal e monetaria). Base teorica das financas publicas."},
  ],
  fontes: [
    {tipo:"Doutrina", ref:"Musgrave; Stiglitz; Giambiagi", desc:"Referencias classicas de financas publicas e economia do setor publico."},
    {tipo:"Dados", ref:"IBGE, BCB, Tesouro Nacional", desc:"Estatisticas de PIB, inflacao, contas publicas e divida."},
  ],
  juris: [
    {ref:"Teorema de Coase", tese:"Com direitos de propriedade definidos e baixos custos de transacao, partes negociam e atingem alocacao eficiente sem intervencao estatal."},
    {ref:"Curva de Laffer", tese:"A partir de certo ponto, aliquotas maiores reduzem a arrecadacao (desestimulo e evasao)."},
  ],
  jurisComentadas: [
    {ref:"Teorema de Coase", tese:"Negociacao privada resolve externalidades.", comentario:"Se os direitos de propriedade estao bem definidos e os custos de transacao sao baixos, os agentes negociam e chegam a alocacao eficiente independentemente de quem detem o direito - dispensando a intervencao do Estado. Na pratica, altos custos de transacao limitam o teorema, justificando tributos de Pigou e regulacao."},
  ],
},

};
