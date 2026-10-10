const $ = (id) => document.getElementById(id);

export function showStatus(msg) {
  $("statusText").textContent = msg;
  $("statusPill").classList.add("visible");
}

export function hideStatus() {
  $("statusPill").classList.remove("visible");
}

export function showError(msg) {
  const el = $("errorBar");
  el.textContent = msg;
  el.classList.add("visible");
}

export function hideError() {
  $("errorBar").classList.remove("visible");
}

export function showLoading(text) {
  $("loadingCard").classList.add("visible");
  if (text) $("loadingText").textContent = text;
}

export function hideLoading() {
  $("loadingCard").classList.remove("visible");
}

export function setLoadingText(text) {
  $("loadingText").textContent = text;
}
