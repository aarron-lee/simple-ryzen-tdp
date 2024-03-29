const slider = document.getElementById("customTDP");
const ryzenAdjPathInput = document.getElementById("ryzenadjPath");
const closeDialogForm = document.getElementById("introDialogCloseForm");
const introDialog = document.getElementById("introDialog");
const defaultTdpForm = document.getElementById("defaultTdpForm");
const clearDefaultTdpButton = document.getElementById("clearDefaultTdp");
const quitAppButton = document.getElementById("quitApp");
const tdpRangeForm = document.getElementById("tdpRange");
const preserveTdpOnSuspendCheckbox = document.getElementById(
  "preserveTdpOnSuspend"
);
const pollTdpCheckbox = document.getElementById(
  "pollTdp"
);
const refreshTdpTableButton = document.getElementById("refreshTdpTable")

const SETTINGS = "settings";
const RYZENADJ_PATH = "ryzenadjPath";
const DEFAULT_TDP = "defaultTdp";
const TDP_RANGE = "tdpRange";
const PRESERVE_TDP_ON_SUSPEND = "preserveTdpOnSuspend";
const POLL_TDP = "pollTdp";
const DISABLE_INTRO_DIALOG = "disableIntroDialog";
const POLL_TDP_INFO = ""

let tdpRefresher = undefined;

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

function handleSettingsUpdate() {
  const settings = getSettings();
  if (settings) {
    const ryzenadjPath = settings[RYZENADJ_PATH];
    const defaultTdp = settings[DEFAULT_TDP];
    const tdpRange = settings[TDP_RANGE];
    const preserveTdpOnSuspend = settings[PRESERVE_TDP_ON_SUSPEND];
    const pollTdp = settings[POLL_TDP];
    const { appVersion } = settings;

    if (appVersion) {
      document.getElementById("appVersion").innerHTML = `v${appVersion}`;
    }
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
    if (pollTdp) {
      pollTdpCheckbox.checked = true;
    }
  }
}

function handleIntroDialog() {
  const disableIntroDialog = JSON.parse(
    window.localStorage.getItem(DISABLE_INTRO_DIALOG)
  );

  if (!disableIntroDialog) {
    introDialog.open = true;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  handleIntroDialog();

  handleSettingsUpdate();
});

refreshTdpTableButton.addEventListener("click", e => {
  window.ipcRender.send("refreshTdpTable")
})

preserveTdpOnSuspendCheckbox.addEventListener("click", (e) => {
  window.ipcRender.send("preserveTdpOnSuspend", e.target.checked);
});

pollTdpCheckbox.addEventListener("click", (e) => {
  window.ipcRender.send("pollTdp", e.target.checked);
});

quitAppButton.addEventListener("click", () => {
  window.ipcRender.send("quitApp");
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

  if(tdpRefresher) {
    clearInterval(tdpRefresher);
    tdpRefresher = undefined;
  }

  const settings = getSettings()

  const pollTdp = settings[POLL_TDP]

  if(pollTdp) {
    tdpRefresher = setInterval(() => {
      window.ipcRender.send("updateTdp", targetTDP);
    }, 500);
  }
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

window.ipcRender.receive("tdpTable", data => {
    document.getElementById("tdpDetails").innerHTML = data;
})

window.ipcRender.receive("updateSettings", (settings) => {
  window.localStorage.setItem("settings", JSON.stringify(settings, null, 2));
  handleSettingsUpdate();
});

closeDialogForm.addEventListener("submit", (e) => {
  const values = Array.from(new FormData(closeDialogForm));
  if (values.length > 0) {
    // end user has opted to disable showing intro dialog, persist to settings
    window.localStorage.setItem(DISABLE_INTRO_DIALOG, true);
  }
});

document.getElementById("pollTdpInfoButton").addEventListener("click", () => {
  const dialog = document.getElementById("pollTdpDialog")

  dialog.showModal()
})

document.getElementById("closePollTdpDialog").addEventListener("click", () => {
  const dialog = document.getElementById("pollTdpDialog")

  dialog.close()
})