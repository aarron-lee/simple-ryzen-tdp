const slider = document.getElementById("customTDP");
const ryzenAdjPathInput = document.getElementById("ryzenadjPath");
const defaultTdpForm = document.getElementById("defaultTdpForm");
const clearDefaultTdpButton = document.getElementById("clearDefaultTdp");

const RYZENADJ_PATH = "ryzenadjPath";
const DEFAULT_TDP = "defaultTdp";

document.addEventListener("DOMContentLoaded", () => {
  if (window.localStorage.getItem(RYZENADJ_PATH)) {
    ryzenAdjPathInput.value = window.localStorage.getItem(RYZENADJ_PATH);
  }
});

defaultTdpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const [[fieldName, tdp]] = Array.from(new FormData(defaultTdpForm));

  console.log(fieldName, tdp);

  if (tdp) {
    const defaultTdp = Number(tdp);

    window.localStorage.setItem(DEFAULT_TDP, defaultTdp);
    window.ipcRender.send("setDefaultTdp", defaultTdp);
  }
});

clearDefaultTdpButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  window.localStorage.setItem(DEFAULT_TDP, undefined);
  window.ipcRender.send("setDefaultTdp", undefined);
  document.getElementById("defaultTdp").value = undefined;
});

slider.addEventListener("change", (e) => {
  document.getElementById("tdpView").innerHTML = e.target.value;
  const targetTDP = Number(e.target.value);

  window.ipcRender.send("updateTdp", targetTDP);
});

ryzenAdjPathInput.addEventListener("change", (e) => {
  const path = e.target.value;

  window.localStorage.setItem(RYZENADJ_PATH, path);
  window.ipcRender.send("setRyzenadjPath", path);
});

window.ipcRender.receive("tdpInfo", (...args) => {
  document.getElementById("tdpDetails").innerHTML = args;
});
