import { MODEL_URL } from "./config.js";
import { getSpeciesInfo } from "./utils.js";
import {
  showStatus,
  hideStatus,
  showError,
  hideError,
  showLoading,
  hideLoading,
  setLoadingText,
} from "./ui.js";
import { getCurrentImage } from "./fileHandler.js";
import { fetchClaudeInfo } from "./claudeApi.js";

const $ = (id) => document.getElementById(id);

let model = null;

export async function loadModel() {
  showStatus("Carregando modelo de IA...");
  try {
    model = await tmImage.load(
      MODEL_URL + "model.json",
      MODEL_URL + "metadata.json"
    );
    showStatus("Modelo pronto.");
    setTimeout(hideStatus, 1500);
  } catch (err) {
    console.error(err);
    hideStatus();
    showError(
      "Erro ao carregar o modelo. Verifique sua conexão e recarregue a página."
    );
  }
}

export async function classify() {
  if (!model) {
    showError("Modelo ainda carregando. Aguarde alguns segundos.");
    return;
  }

  const currentImg = getCurrentImage();
  if (!currentImg) {
    showError("Selecione uma imagem primeiro.");
    return;
  }

  hideError();
  const btn = $("classifyBtn");
  btn.disabled = true;
  btn.textContent = "Analisando...";

  $("resultsBox").classList.remove("visible");
  showLoading("Analisando imagem com a rede neural...");

  try {
    const predictions = await model.predict(currentImg);
    predictions.sort((a, b) => b.probability - a.probability);
    const top = predictions[0];

    renderSpeciesCard(top, predictions);
    $("resultsBox").classList.add("visible");

    setLoadingText("Consultando informações médicas...");
    await fetchClaudeInfo(top.className, top.probability);
  } catch (err) {
    console.error(err);
    showError("Erro ao processar a imagem. Tente outra foto.");
  } finally {
    hideLoading();
    btn.disabled = false;
    btn.textContent = "Identificar cobra";
  }
}

function renderSpeciesCard(top, predictions) {
  const info = getSpeciesInfo(top.className);

  const card = $("speciesCard");
  card.classList.remove("danger", "safe");
  if (info.dangerous === true) card.classList.add("danger");
  else if (info.dangerous === false) card.classList.add("safe");

  $("speciesName").textContent = top.className;
  $("speciesConf").textContent =
    (top.probability * 100).toFixed(1) + "% de confiança";

  const badge = $("speciesBadge");
  badge.classList.remove("danger", "safe", "neutral");
  if (info.dangerous === true) {
    badge.classList.add("danger");
    badge.textContent = "Peçonhenta — perigosa";
  } else if (info.dangerous === false) {
    badge.classList.add("safe");
    badge.textContent = "Inofensiva";
  } else {
    badge.classList.add("neutral");
    badge.textContent = "Verificando...";
  }

  const barsEl = $("allBars");
  barsEl.innerHTML = "";
  predictions.forEach((p, i) => {
    const pct = (p.probability * 100).toFixed(1);
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <div class="bar-meta">
        <span class="name">${escapeHtml(p.className)}</span>
        <span class="pct">${pct}%</span>
      </div>
      <div class="bar-track">
        <div class="bar-fill ${i === 0 ? "top" : ""}" style="width: ${pct}%"></div>
      </div>`;
    barsEl.appendChild(row);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
