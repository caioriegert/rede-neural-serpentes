import { hideError } from "./ui.js";

const $ = (id) => document.getElementById(id);

let currentImg = null;

export function getCurrentImage() {
  return currentImg;
}

export function handleDrop(event) {
  event.preventDefault();
  $("dropZone").classList.remove("drag-over");
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    handleFile(file);
  }
}

export function handleFile(file) {
  if (!file) return;
  hideError();

  $("resultsBox").classList.remove("visible");
  $("aiInfoContainer").innerHTML = "";

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = $("previewImg");
    img.src = e.target.result;
    img.onload = () => {
      currentImg = img;
    };
    $("fileName").textContent = file.name;
    $("previewArea").classList.add("visible");
    $("classifyBtn").style.display = "block";
    currentImg = img;
  };
  reader.readAsDataURL(file);
}

export function resetImage() {
  currentImg = null;
  $("previewArea").classList.remove("visible");
  $("classifyBtn").style.display = "none";
  $("resultsBox").classList.remove("visible");
  $("aiInfoContainer").innerHTML = "";
  $("fileInput").value = "";
  hideError();
}
