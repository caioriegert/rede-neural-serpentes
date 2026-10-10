import { CLAUDE_API_URL, CLAUDE_API_KEY, CLAUDE_MODEL } from "./config.js";

const $ = (id) => document.getElementById(id);

function buildPrompt(species, probability) {
  return `Você é um especialista em serpentes brasileiras e primeiros socorros para acidentes ofídicos.

A rede neural identificou uma cobra como: "${species}" (confiança: ${(probability * 100).toFixed(1)}%).

Responda APENAS em JSON válido, sem texto antes ou depois, com a seguinte estrutura:

{
  "nome_cientifico": "nome científico da espécie",
  "venenosa": true ou false,
  "descricao": "Descrição breve da espécie (2-3 frases): aparência, habitat, comportamento.",
  "sintomas": ["sintoma 1", "sintoma 2", "sintoma 3"],
  "primeiros_socorros": ["passo 1", "passo 2", "passo 3"],
  "antiveneno": "Nome do soro antiofídico correto a ser aplicado no hospital (ex: soro antibotrópico). Se inofensiva, escreva 'Não é necessário'.",
  "urgencia": "ALTA, MEDIA ou BAIXA",
  "nao_fazer": ["o que NÃO fazer 1", "o que NÃO fazer 2"]
}

Seja preciso, conciso e baseado nas diretrizes do Ministério da Saúde do Brasil. Se for cobra inofensiva (boa, jiboia, coral falsa), deixe claro que não há envenenamento mas mantenha orientações básicas (limpeza da ferida, observação).`;
}

export async function fetchClaudeInfo(species, probability) {
  const container = $("aiInfoContainer");
  container.innerHTML = `
    <div class="info-section" style="text-align:center;">
      <div class="loading-spinner small"></div>
      <div class="loading-text">Buscando orientações médicas...</div>
    </div>`;

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 1500,
        messages: [{ role: "user", content: buildPrompt(species, probability) }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        `Claude API ${response.status}: ${data?.error?.message || "erro desconhecido"}`
      );
    }

    let text = data.content.map((b) => b.text || "").join("");
    text = text.replace(/```json|```/g, "").trim();
    const info = JSON.parse(text);

    renderClaudeInfo(info);
  } catch (err) {
    console.error("Erro Claude API:", err);
    container.innerHTML = `
      <div class="info-section">
        <div class="info-content">
          <p class="note">
            Não foi possível buscar as informações detalhadas no momento.
            Em caso de picada, procure atendimento médico imediato no hospital
            mais próximo ou ligue 192 (SAMU).
          </p>
        </div>
      </div>`;
  }
}

function escapeHtml(str) {
  if (str == null) return "";
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

function renderClaudeInfo(info) {
  const container = $("aiInfoContainer");
  const urgent = info.urgencia === "ALTA";
  const sections = [];

  if (info.descricao) {
    sections.push(`
      <div class="info-section">
        <div class="info-title">Sobre a espécie</div>
        <div class="info-content">
          ${info.nome_cientifico ? `<p><strong>Nome científico:</strong> <em>${escapeHtml(info.nome_cientifico)}</em></p>` : ""}
          <p>${escapeHtml(info.descricao)}</p>
        </div>
      </div>`);
  }

  if (info.primeiros_socorros?.length) {
    sections.push(`
      <div class="info-section ${urgent ? "urgent" : ""}">
        <div class="info-title ${urgent ? "urgent" : ""}">Primeiros socorros</div>
        <div class="info-content">
          <ol>${info.primeiros_socorros.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>
        </div>
      </div>`);
  }

  if (info.nao_fazer?.length) {
    sections.push(`
      <div class="info-section">
        <div class="info-title">O que NÃO fazer</div>
        <div class="info-content">
          <ul>${info.nao_fazer.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
        </div>
      </div>`);
  }

  if (info.sintomas?.length) {
    sections.push(`
      <div class="info-section">
        <div class="info-title">Sintomas a observar</div>
        <div class="info-content">
          <ul>${info.sintomas.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>
        </div>
      </div>`);
  }

  if (info.antiveneno) {
    sections.push(`
      <div class="info-section">
        <div class="info-title">Soro antiofídico</div>
        <div class="info-content">
          <p>${escapeHtml(info.antiveneno)}</p>
          <p class="note">
            A aplicação do soro deve ser feita exclusivamente em ambiente hospitalar
            por profissionais de saúde.
          </p>
        </div>
      </div>`);
  }

  container.innerHTML = sections.join("");
}
