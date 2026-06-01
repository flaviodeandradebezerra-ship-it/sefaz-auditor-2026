// Geracao de questoes por IA - "traga sua propria chave" (BYOK).
// A chave fica apenas no localStorage do usuario; as chamadas vao direto do
// navegador para o provedor. OpenAI/Anthropic/Google suportam CORS para isso.
// Manus e Copilot nao expoem API direta para browser, por isso nao entram aqui.

export const PROVEDORES = [
  { id: "openai",    nome: "ChatGPT (OpenAI)",   modelo: "gpt-4o-mini",                doc: "platform.openai.com/api-keys", prefixo: "sk-" },
  { id: "anthropic", nome: "Claude (Anthropic)", modelo: "claude-3-5-haiku-20241022",  doc: "console.anthropic.com",        prefixo: "sk-ant-" },
  { id: "gemini",    nome: "Gemini (Google)",    modelo: "gemini-1.5-flash",           doc: "aistudio.google.com/apikey",   prefixo: "AIza" },
];

const K_CFG = "sefaz_ia_cfg_v1";
export function carregarCfgIA() {
  try { const r = localStorage.getItem(K_CFG); return r ? JSON.parse(r) : { provedor: "openai", chave: "" }; }
  catch (e) { return { provedor: "openai", chave: "" }; }
}
export function salvarCfgIA(cfg) {
  try { localStorage.setItem(K_CFG, JSON.stringify(cfg)); } catch (e) {}
}

function montarPrompt(topico, banca, cargo, n) {
  return `Voce e um elaborador de questoes de concurso publico no estilo da banca ${banca || "organizadora"}.
Crie ${n} questoes de multipla escolha INEDITAS sobre o topico: "${topico}".
${cargo ? `Contexto do cargo: ${cargo}.` : ""}
Regras:
- Cada questao com 5 alternativas (A a E), apenas uma correta.
- Nivel e estilo compativeis com a banca ${banca || ""}.
- Inclua um comentario explicando por que a correta esta certa.
Responda APENAS um JSON valido, sem texto fora dele, no formato:
{"questoes":[{"enunciado":"...","alternativas":["A) ...","B) ...","C) ...","D) ...","E) ..."],"gabarito":"A","comentario":"..."}]}`;
}

function extrairJSON(texto) {
  if (!texto) return null;
  // remove cercas de codigo e tenta achar o objeto JSON
  let t = texto.replace(/```json/gi, "").replace(/```/g, "").trim();
  const ini = t.indexOf("{");
  const fim = t.lastIndexOf("}");
  if (ini === -1 || fim === -1) return null;
  try { return JSON.parse(t.slice(ini, fim + 1)); } catch (e) { return null; }
}

async function chamarOpenAI(chave, prompt, modelo) {
  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + chave },
    body: JSON.stringify({ model: modelo, messages: [{ role: "user", content: prompt }], temperature: 0.7 }),
  });
  if (!r.ok) throw new Error("OpenAI HTTP " + r.status + (r.status === 401 ? " (chave invalida)" : ""));
  const d = await r.json();
  return d.choices?.[0]?.message?.content || "";
}

async function chamarAnthropic(chave, prompt, modelo) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": chave,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: modelo, max_tokens: 2000, messages: [{ role: "user", content: prompt }] }),
  });
  if (!r.ok) throw new Error("Anthropic HTTP " + r.status + (r.status === 401 ? " (chave invalida)" : ""));
  const d = await r.json();
  return d.content?.[0]?.text || "";
}

async function chamarGemini(chave, prompt, modelo) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + modelo + ":generateContent?key=" + encodeURIComponent(chave);
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  if (!r.ok) throw new Error("Gemini HTTP " + r.status + (r.status === 400 ? " (chave invalida)" : ""));
  const d = await r.json();
  return d.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// Gera questoes; retorna array [{enunciado, alternativas, gabarito, comentario}]
export async function gerarQuestoesIA({ provedor, chave }, { topico, banca, cargo, n = 5 }) {
  if (!chave) throw new Error("Cadastre sua chave de API primeiro.");
  const prov = PROVEDORES.find(p => p.id === provedor) || PROVEDORES[0];
  const prompt = montarPrompt(topico, banca, cargo, n);
  let texto = "";
  if (provedor === "openai") texto = await chamarOpenAI(chave, prompt, prov.modelo);
  else if (provedor === "anthropic") texto = await chamarAnthropic(chave, prompt, prov.modelo);
  else if (provedor === "gemini") texto = await chamarGemini(chave, prompt, prov.modelo);
  else throw new Error("Provedor nao suportado para geracao direta.");

  const obj = extrairJSON(texto);
  if (!obj || !Array.isArray(obj.questoes) || obj.questoes.length === 0) {
    throw new Error("A IA respondeu em formato inesperado. Tente novamente.");
  }
  return obj.questoes;
}
