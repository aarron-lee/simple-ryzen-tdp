const slider = document.getElementById("customTDP");
const ryzenAdjPathInput = document.getElementById("ryzenadjPath");
const defaultTdpForm = document.getElementById("defaultTdpForm");
const clearDefaultTdpButton = document.getElementById("clearDefaultTdp");

const SETTINGS = "settings";
const RYZENADJ_PATH = "ryzenadjPath";
const DEFAULT_TDP = "defaultTdp";

function getSettings() {
  return JSON.parse(window.localStorage.getItem(SETTINGS));
}

document.addEventListener("DOMContentLoaded", () => {
  const ryzenadjPath = getSettings()[RYZENADJ_PATH];
  const defaultTdp = getSettings()[DEFAULT_TDP];
  if (ryzenadjPath) {
    ryzenAdjPathInput.value = ryzenadjPath;
  }
  if (defaultTdp) {
    document.getElementById("defaultTdp").value = defaultTdp;
  }
});

defaultTdpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const [[, tdp]] = Array.from(new FormData(defaultTdpForm));

  if (tdp) {
    const defaultTdp = Number(tdp);

    window.ipcRender.send("setDefaultTdp", defaultTdp);
  }
});

clearDefaultTdpButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();

  window.ipcRender.send("setDefaultTdp", undefined);
  document.getElementById("defaultTdp").value = undefined;
});

slider.addEventListener("change", (e) => {
  document.getElementById("tdpView").innerHTML = `- ${e.target.value}W`;
  const targetTDP = Number(e.target.value);

  window.ipcRender.send("updateTdp", targetTDP);
});

ryzenAdjPathInput.addEventListener("change", (e) => {
  const path = e.target.value;

  window.ipcRender.send("setRyzenadjPath", path);
});

window.ipcRender.receive("tdpInfo", (data) => {
  document.getElementById("tdpDetails").innerHTML = data;

  const tdpInfo = data.split("|").map((v) => v.trim());
  let currentTdp;
  // eslint-disable-next-line no-restricted-syntax
  for (const [i, v] of tdpInfo.entries()) {
    if (v === "STAPM LIMIT") {
      currentTdp = Number(tdpInfo[i + 1]);
      break;
    }
  }
  if (slider.value !== `${currentTdp}`) {
    slider.value = `${currentTdp}`;
  }
});

window.ipcRender.receive("updateSettings", (settings) => {
  window.localStorage.setItem("settings", JSON.stringify(settings, null, 2));
});
