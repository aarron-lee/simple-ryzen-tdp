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
  if (window.localStorage.getItem(DEFAULT_TDP)) {
    document.getElementById("defaultTdp").value =
      window.localStorage.getItem(DEFAULT_TDP);
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
  document.getElementById("tdpView").innerHTML = `- ${e.target.value}W`;
  const targetTDP = Number(e.target.value);

  window.ipcRender.send("updateTdp", targetTDP);
});

ryzenAdjPathInput.addEventListener("change", (e) => {
  const path = e.target.value;

  window.localStorage.setItem(RYZENADJ_PATH, path);
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
