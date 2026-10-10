import { loadModel, classify } from "./classifier.js";
import { handleDrop, handleFile, resetImage } from "./fileHandler.js";

const $ = (id) => document.getElementById(id);

function bindEvents() {
  const dropZone = $("dropZone");
  const fileInput = $("fileInput");

  dropZone.addEventListener("click", () => fileInput.click());
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });
  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });
  dropZone.addEventListener("drop", handleDrop);

  fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));

  $("classifyBtn").addEventListener("click", classify);
  $("changeImageBtn").addEventListener("click", resetImage);
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  loadModel();
});
