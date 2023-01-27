const slider = document.getElementById("customTDP");
const ryzenAdjPathInput = document.getElementById("ryzenadjPath");
const defaultTdpForm = document.getElementById("defaultTdpForm");
const clearDefaultTdpButton = document.getElementById("clearDefaultTdp");
const tdpRangeForm = document.getElementById("tdpRange");
const preserveTdpOnSuspendCheckbox = document.getElementById(
  "preserveTdpOnSuspend"
);

const SETTINGS = "settings";
const RYZENADJ_PATH = "ryzenadjPath";
const DEFAULT_TDP = "defaultTdp";
const TDP_RANGE = "tdpRange";
const PRESERVE_TDP_ON_SUSPEND = "preserveTdpOnSuspend";

function getSettings() {
  return JSON.parse(window.localStorage.getItem(SETTINGS));
}

function updateNodesWithTdpRange(min, max) {
  slider.min = min;
  slider.max = max;

  const tdpOnAppStart = document.getElementById("defaultTdp");
  tdpOnAppStart.min = min;
  tdpOnAppStart.max = max;

  const minTdpInput = document.getElementById("minTdp");
  minTdpInput.value = min;

  const maxTdpInput = document.getElementById("maxTdp");
  maxTdpInput.value = max;
}

document.addEventListener("DOMContentLoaded", () => {
  const settings = getSettings();
  const ryzenadjPath = settings[RYZENADJ_PATH];
  const defaultTdp = settings[DEFAULT_TDP];
  const tdpRange = settings[TDP_RANGE];
  const preserveTdpOnSuspend = settings[PRESERVE_TDP_ON_SUSPEND];
  if (ryzenadjPath) {
    ryzenAdjPathInput.value = ryzenadjPath;
  }
  if (defaultTdp) {
    document.getElementById("defaultTdp").value = defaultTdp;
  }
  if (tdpRange) {
    updateNodesWithTdpRange(...tdpRange);
  }
  if (preserveTdpOnSuspend) {
    preserveTdpOnSuspendCheckbox.checked = true;
  }
});

preserveTdpOnSuspendCheckbox.addEventListener("click", (e) => {
  window.ipcRender.send("preserveTdpOnSuspend", e.target.checked);
});

defaultTdpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const [[, tdp]] = Array.from(new FormData(defaultTdpForm));

  if (tdp) {
    const defaultTdp = Number(tdp);

    window.ipcRender.send("setDefaultTdp", defaultTdp);
  }
});

tdpRangeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const [min, max] = Array.from(new FormData(tdpRangeForm));

  const tdpRange = [Number(min[1]), Number(max[1])];

  window.ipcRender.send("updateTdpRange", tdpRange);

  updateNodesWithTdpRange(...tdpRange);
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

window.ipcRender.receive("tdpInfo", (data, currentTdp) => {
  document.getElementById("tdpDetails").innerHTML = data;

  if (slider.value !== `${currentTdp}`) {
    slider.value = `${currentTdp}`;
    document.getElementById("tdpView").innerHTML = `- ${currentTdp}W`;
  }
});

window.ipcRender.receive("updateSettings", (settings) => {
  window.localStorage.setItem("settings", JSON.stringify(settings, null, 2));
});
