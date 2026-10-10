import { SPECIES_INFO } from "./config.js";

const DIACRITICS_RE = new RegExp("[̀-ͯ]", "g");

export function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .trim();
}

export function getSpeciesInfo(label) {
  const key = normalize(label);
  for (const k in SPECIES_INFO) {
    const normalizedK = normalize(k);
    if (key.includes(normalizedK) || normalizedK.includes(key)) {
      return SPECIES_INFO[k];
    }
  }
  return { dangerous: null };
}