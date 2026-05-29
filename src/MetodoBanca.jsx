import { useState } from "react";

const C = {
  bg:"#080e1a", card:"#0f1829", card2:"#162035",
  border:"#1b2c44", gold:"#c8a951", goldL:"#f0d080",
  red:"#ef4444", green:"#22c55e", blue:"#3b82f6",
  purple:"#a855f7", text:"#e2e8f0", muted:"#64748b",
};

// Perfil completo de cada banca
const BANCAS = {
  cebraspe: {
    nome:"Cebraspe / CESPE", cor:"#1d4ed8",
    estilo:"Itens CERTO ou ERRADO (e algumas de multipla escolha)",
    pontuacao:"Na maioria das provas, cada item ERRADO ANULA um item CERTO. Errar custa o dobro.",
    perfil:[
      "Itens conceituais profundos; exige compreensao, nao decoreba.",
      "Adora generalizacoes: palavras como 'sempre', 'nunca', 'apenas', 'somente' costumam tornar o item ERRADO.",
      "Trabalha muito com jurisprudencia (STF/STJ) e excecoes a regra.",
      "Textos-base longos com afirmativas que parecem certas mas tem um detalhe falso.",
    ],
    metodo:[
      "Foque em ENTENDER os institutos, nao em decorar literalmente.",
      "Treine MUITAS questoes C/E da propria Cebraspe (TEC/QConcursos) ate calibrar o 'olho' para pegadinhas.",
      "Para cada item errado, reescreva-o tornando-o correto (aprendizado ativo).",
      "Estude jurisprudencia dos informativos do STF/STJ dos ultimos 2 anos.",
      "Crie um caderno de 'palavras perigosas' que mudam o sentido do item.",
    ],
    prova:[
      "So marque CERTO quando tiver alta convicao (lembre: erro anula acerto).",
      "Na duvida real entre 50/50, considere DEIXAR EM BRANCO (nao perde ponto).",
      "Leia o item inteiro antes de julgar; o erro costuma estar no final.",
      "Desconfie de itens muito categoricos e absolutos.",
    ],
    erros:[
      "Marcar por intuicao em itens 50/50 (o erro anula um acerto).",
      "Cair em generalizacoes sem checar a excecao.",
      "Ignorar jurisprudencia recente.",
    ],
    busca:"Cebraspe CESPE provas anteriores",
  },
  fcc: {
    nome:"FCC", cor:"#dc2626",
    estilo:"Multipla escolha (5 alternativas), sem penalidade por erro",
    pontuacao:"Sem desconto por erro: NUNCA deixe questao em branco. Chute estrategico vale.",
    perfil:[
      "Banca LITERAL e LEGALISTA: cobra a letra fria da lei, decretos e sumulas.",
      "Alternativas longas, detalhistas, com pegadinhas de troca de palavras.",
      "Costuma repetir temas e ate questoes de provas anteriores.",
      "Pouca interpretacao; muita memorizacao de dispositivos exatos.",
    ],
    metodo:[
      "Estude a LETRA DA LEI: leia e releia os artigos cobrados no edital.",
      "Monte tabelas e mnemonicos para prazos, percentuais e listas (a FCC adora numeros).",
      "Resolva o maximo de questoes ANTIGAS da FCC: ela recicla temas.",
      "Grife as palavras exatas dos artigos; a FCC troca uma palavra para errar.",
      "Revise sumulas e jurisprudencia sumulada.",
    ],
    prova:[
      "Responda TODAS (nao ha penalidade).",
      "Elimine por exclusao: alternativas com termos absolutos errados saem primeiro.",
      "Cuidado com trocas sutis de palavras (ex: 'podera' x 'devera').",
      "Gerencie o tempo: questoes literais sao rapidas, nao se prenda.",
    ],
    erros:[
      "Deixar questao em branco (perde ponto a toa).",
      "Confiar na memoria vaga; a FCC exige a palavra exata.",
      "Subestimar a importancia de decorar numeros e prazos.",
    ],
    busca:"FCC provas anteriores fiscal",
  },
  fgv: {
    nome:"FGV", cor:"#059669",
    estilo:"Multipla escolha (5 alternativas), interpretativa",
    pontuacao:"Sem penalidade por erro: responda tudo. Questoes mais trabalhosas.",
    perfil:[
      "Banca INTERPRETATIVA: enunciados longos, casos praticos e situacoes-problema.",
      "Exige RACIOCINIO e aplicacao da teoria, nao so memorizacao.",
      "Cobra detalhes finos e combina temas de mais de um topico na mesma questao.",
      "Questoes de portugues e RLM costumam ser exigentes.",
    ],
    metodo:[
      "Estude entendendo a LOGICA dos institutos e como aplica-los a casos.",
      "Treine questoes da FGV especificamente; o estilo e diferente das demais.",
      "Resolva casos praticos e simulados cronometrados (a FGV consome tempo).",
      "Aprofunde portugues e raciocinio logico-matematico.",
      "Leia doutrina e jurisprudencia, nao so a letra da lei.",
    ],
    prova:[
      "Responda TODAS (sem penalidade).",
      "Leia o enunciado com calma: a resposta depende de interpretar o caso.",
      "Gerencie bem o tempo; deixe as mais longas para o fim.",
      "Cuidado com alternativas 'quase certas' (a FGV adora a meia-verdade).",
    ],
    erros:[
      "Ler o enunciado rapido demais e perder o detalhe do caso.",
      "Estudar so a letra da lei (a FGV cobra aplicacao).",
      "Nao treinar gestao de tempo (prova longa).",
    ],
    busca:"FGV provas anteriores fiscal",
  },
  vunesp: {
    nome:"Vunesp", cor:"#7c3aed",
    estilo:"Multipla escolha, sem penalidade",
    pontuacao:"Sem desconto por erro: responda tudo.",
    perfil:[
      "Equilibrio entre letra da lei e interpretacao.",
      "Questoes objetivas e diretas; boa base teorica resolve.",
      "Forte em lingua portuguesa e raciocinio logico.",
      "Dificuldade media, previsivel.",
    ],
    metodo:[
      "Construa base teorica solida e constante (a Vunesp premia regularidade).",
      "Treine portugues e RLM com afinco.",
      "Resolva questoes da Vunesp para pegar o padrao objetivo.",
      "Revise lei seca + entendimentos basicos.",
    ],
    prova:[
      "Responda TODAS.",
      "Questoes diretas: confie na preparacao e nao crie pegadinha onde nao ha.",
      "Aproveite que sao objetivas para ganhar tempo.",
    ],
    erros:["Complicar questoes simples.","Negligenciar portugues e RLM."],
    busca:"Vunesp provas anteriores",
  },
  idecan: {
    nome:"IDECAN", cor:"#ea580c",
    estilo:"Multipla escolha, sem penalidade",
    pontuacao:"Sem desconto por erro: responda tudo.",
    perfil:[
      "Foco em literalidade e conceitos basicos.",
      "Dificuldade media; constancia resolve.",
      "Cobra bem a letra da lei e definicoes.",
    ],
    metodo:[
      "Domine a lei seca e os conceitos fundamentais.",
      "Resolva questoes da banca para pegar o padrao.",
      "Mantenha revisoes regulares.",
    ],
    prova:["Responda TODAS.","Atencao a literalidade dos conceitos."],
    erros:["Subestimar a banca.","Falta de revisao da lei seca."],
    busca:"IDECAN provas anteriores",
  },
};

// Metodo do CICLO DE ESTUDOS
export default function MetodoBanca({ onClose }) {
  const [bancaSel, setBancaSel] = useState("cebraspe");
  const [aba, setAba] = useState("perfil"); // perfil | ciclo

  // Gerador de ciclo de estudos
  const [discsInput, setDiscsInput] = useState("Direito Tributario:3\nContabilidade:3\nPortugues:2\nRLM:2\nDireito Constitucional:1\nDireito Administrativo:1");
  const [horasDia, setHorasDia] = useState(4);

  const b = BANCAS[bancaSel];

  // Monta o ciclo: cada disciplina ocupa blocos proporcionais ao peso
  const montarCiclo = () => {
    const linhas = discsInput.split("\n").map(l => l.trim()).filter(Boolean);
    const itens = linhas.map(l => {
      const [nome, peso] = l.split(":");
      return { nome: (nome||"").trim(), peso: Math.max(1, parseInt(peso) || 1) };
    }).filter(i => i.nome);
    // Expandir blocos pelo peso
    const blocos = [];
    itens.forEach(i => { for (let k=0; k<i.peso; k++) blocos.push(i.nome); });
    return blocos;
  };

  const ciclo = montarCiclo();
  const blocosDia = Math.max(1, Math.round(horasDia / 1.2)); // blocos de ~1h12 (50min foco + pausa)
  const diasCiclo = Math.ceil(ciclo.length / blocosDia);

  const Btn = ({id, children}) => (
    <button onClick={()=>setAba(id)} style={{
      padding:"8px 16px", borderRadius:6,
      border:`1px solid ${aba===id?C.gold:C.border}`,
      background:aba===id?C.gold+"22":"transparent",
      color:aba===id?C.gold:C.muted, cursor:"pointer", fontSize:13, fontWeight:700
    }}>{children}</button>
  );

  const Lista = ({titulo, itens, cor}) => (
    <div style={{marginBottom:14}}>
      <div style={{fontWeight:700,color:cor||C.gold,fontSize:13,marginBottom:8}}>{titulo}</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {itens.map((x,i)=>(
          <div key={i} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px",fontSize:12,color:C.text,lineHeight:1.6}}>• {x}</div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:1000,overflowY:"auto",padding:"20px 12px"}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{maxWidth:700,margin:"0 auto",background:C.bg,border:`1px solid ${C.gold}44`,borderRadius:14,padding:"20px 18px"}}>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <h2 style={{color:C.gold,margin:0,fontSize:17}}>🎓 Metodo de Estudo por Banca</h2>
          <button onClick={onClose} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,borderRadius:6,width:32,height:32,cursor:"pointer",fontSize:16}}>✕</button>
        </div>

        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <Btn id="perfil">Perfil & Estrategia</Btn>
          <Btn id="ciclo">Ciclo de Estudos</Btn>
        </div>

        {/* PERFIL & ESTRATEGIA POR BANCA */}
        {aba==="perfil" && (
          <div>
            <div style={{fontWeight:700,color:C.gold,fontSize:12,marginBottom:8}}>1. Selecione sua banca:</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
              {Object.keys(BANCAS).map(k=>(
                <button key={k} onClick={()=>setBancaSel(k)} style={{
                  background: bancaSel===k ? BANCAS[k].cor+"22" : "transparent",
                  border:`1px solid ${bancaSel===k ? BANCAS[k].cor : C.border}`,
                  color: bancaSel===k ? BANCAS[k].cor : C.text,
                  borderRadius:8, padding:"7px 13px", cursor:"pointer", fontSize:12,
                  fontWeight: bancaSel===k ? 700 : 400
                }}>{BANCAS[k].nome}</button>
              ))}
            </div>

            <div style={{background:C.card,border:`1px solid ${b.cor}55`,borderLeft:`4px solid ${b.cor}`,borderRadius:10,padding:16,marginBottom:14}}>
              <h3 style={{color:b.cor,margin:"0 0 10px",fontSize:16}}>{b.nome}</h3>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{fontSize:12,color:C.text}}><strong style={{color:C.goldL}}>Estilo:</strong> {b.estilo}</div>
                <div style={{background:b.cor+"15",border:`1px solid ${b.cor}44`,borderRadius:8,padding:"8px 11px",fontSize:12,color:C.text,lineHeight:1.5}}>
                  <strong style={{color:b.cor}}>⚠️ Pontuacao:</strong> {b.pontuacao}
                </div>
              </div>
            </div>

            <Lista titulo="📌 Perfil da banca" itens={b.perfil} cor={b.cor}/>
            <Lista titulo="📚 Metodo de estudo otimizado" itens={b.metodo} cor={C.green}/>
            <Lista titulo="🎯 Estrategia no dia da prova" itens={b.prova} cor={C.blue}/>
            <Lista titulo="❌ Erros mais comuns a evitar" itens={b.erros} cor={C.red}/>

            <a href={`https://www.google.com/search?q=${encodeURIComponent(b.busca)}`} target="_blank" rel="noopener noreferrer"
              style={{display:"block",textAlign:"center",background:b.cor+"22",border:`1px solid ${b.cor}`,color:b.cor,borderRadius:8,padding:"11px",fontSize:13,fontWeight:700,textDecoration:"none"}}>
              🔎 Buscar provas anteriores da {b.nome} ↗
            </a>
          </div>
        )}

        {/* CICLO DE ESTUDOS */}
        {aba==="ciclo" && (
          <div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14,marginBottom:14}}>
              <h3 style={{color:C.goldL,margin:"0 0 6px",fontSize:15}}>♻️ Gerador de Ciclo de Estudos</h3>
              <p style={{color:C.muted,fontSize:12,lineHeight:1.6,margin:"0 0 12px"}}>
                O ciclo de estudos rotaciona as disciplinas por PESO (importancia no edital), garantindo que voce nunca abandone uma materia. Diferente do cronograma fixo, o ciclo se adapta ao seu ritmo: terminou um bloco, passa para o proximo.
              </p>
              <label style={{fontSize:12,color:C.gold,fontWeight:700,display:"block",marginBottom:4}}>Disciplinas e pesos (uma por linha, formato Disciplina:peso)</label>
              <textarea value={discsInput} onChange={e=>setDiscsInput(e.target.value)} rows={7}
                style={{width:"100%",background:C.card2,border:`1px solid ${C.border}`,color:C.text,borderRadius:8,padding:"9px 12px",fontSize:12,resize:"vertical",lineHeight:1.7,fontFamily:"monospace"}}/>
              <div style={{display:"flex",alignItems:"center",gap:12,marginTop:12}}>
                <span style={{color:C.text,fontSize:12}}>Horas/dia:</span>
                <input type="range" min="1" max="12" value={horasDia} onChange={e=>setHorasDia(Number(e.target.value))} style={{flex:1,accentColor:C.gold}}/>
                <span style={{color:C.goldL,fontWeight:700,fontSize:16,minWidth:50,textAlign:"right"}}>{horasDia}h</span>
              </div>
            </div>

            <div style={{background:C.card,border:`1px solid ${C.gold}33`,borderRadius:10,padding:14,marginBottom:14}}>
              <div style={{fontSize:12,color:C.text,lineHeight:1.7}}>
                Seu ciclo tem <strong style={{color:C.gold}}>{ciclo.length} blocos</strong> de estudo (~50min foco + 10min pausa cada). Com <strong style={{color:C.gold}}>{horasDia}h/dia</strong> voce faz cerca de <strong style={{color:C.green}}>{blocosDia} blocos/dia</strong> e completa um ciclo a cada <strong style={{color:C.green}}>{diasCiclo} dia(s)</strong>. Ao terminar, reinicie o ciclo.
              </div>
            </div>

            <div style={{fontWeight:700,color:C.gold,fontSize:13,marginBottom:8}}>Sequencia do ciclo:</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {ciclo.map((d,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"center",background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"9px 12px"}}>
                  <span style={{background:C.gold+"22",border:`1px solid ${C.gold}`,color:C.gold,borderRadius:6,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</span>
                  <span style={{fontSize:13,color:C.text}}>{d}</span>
                  <span style={{marginLeft:"auto",fontSize:10,color:C.muted}}>~1h</span>
                </div>
              ))}
            </div>

            <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:8,padding:"11px 13px",marginTop:14}}>
              <div style={{fontSize:12,color:C.goldL,fontWeight:700,marginBottom:6}}>💡 Regra de ouro do ciclo</div>
              <p style={{fontSize:12,color:C.text,lineHeight:1.7,margin:0}}>
                Cada bloco = ~50% teoria + 50% questoes. Ao fim de cada disciplina, resolva ao menos 10 questoes da SUA banca. Revise por repeticao espacada: 1, 7, 30 e 90 dias.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
