// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, Tray, Menu, ipcMain } = require("electron");
const path = require("path");
const childProcess = require("child_process");
const { initializeSettings } = require("./settings");

const RYZENADJ_PATH = "ryzenadjPath";
const IS_WINDOW_HIDDEN = "isWindowHidden";
const DEFAULT_TDP = "defaultTdp";

const { setItem, getItem } = initializeSettings(app);

let window;
let tray;

function ryzenadj(args) {
  const ryzenAdjpath = getItem(RYZENADJ_PATH) || "";
  const script = childProcess.spawn("sudo", [ryzenAdjpath, ...args]);

  return script;
}
function sendTdpData() {
  if (getItem(RYZENADJ_PATH)) {
    const tdpDataScript = ryzenadj(["-i"]);

    tdpDataScript.stdout.on("data", (data) => {
      const parsedData = Buffer.from(data).toString();
      console.log(parsedData);
      window.webContents.send("tdpInfo", parsedData);
    });
  }
}

function setTdp(tdp) {
  const targetTdp = Number(tdp) * 1000;
  const boostTdp = targetTdp + 2000;

  const tdpArgs = ["-a", targetTdp, "-b", boostTdp, "-c", targetTdp];

  const script = ryzenadj(tdpArgs);

  console.log(`PID: ${script.pid}`);

  script.stdout.on("data", (data) => {
    console.log(`stdout: ${data}`);

    // success, fetch TDP data + send back to renderer
    sendTdpData();
  });

  script.stderr.on("data", (err) => {
    console.log(`stderr: ${err}`);
  });

  script.on("exit", (code) => {
    console.log(`Exit Code: ${code}`);
  });
}
function createTray() {
  tray = new Tray(
    path.join(__dirname, "../assets/tray_icons/favicon-32x32.png")
  );

  const click = (e) => {
    const tdp = e.value;
    setTdp(tdp);
  };

  const toggleWindow = () => {
    const windowIsVisible = window.isVisible();
    if (windowIsVisible) {
      window.hide();
      setItem(IS_WINDOW_HIDDEN, true);
    } else {
      window.show();
      setItem(IS_WINDOW_HIDDEN, false);
    }
  };

  const contextMenu = Menu.buildFromTemplate([
    { label: "toggle window", click: toggleWindow },
    {
      label: "5W TDP",
      type: "radio",
      value: 5,
      click,
    },
    {
      label: "8W TDP",
      type: "radio",
      value: 8,
      click,
    },
    {
      label: "12W TDP",
      type: "radio",
      value: 12,
      click,
    },
    {
      label: "15W TDP",
      type: "radio",
      value: 15,
      click,
    },
    {
      label: "18W TDP",
      type: "radio",
      value: 18,
      click,
    },
    {
      label: "22W TDP",
      type: "radio",
      value: 22,
      click,
    },
    { label: "Quit", click: () => app.quit() },
  ]);

  tray.setToolTip("Simple Ryzen TDP");
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  const show = !getItem(IS_WINDOW_HIDDEN);
  window = new BrowserWindow({
    width: 1280,
    height: 720,
    show,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  window.setMenuBarVisibility(false);

  window.loadFile("index.html").then(() => {
    const defaultTdp = getItem(DEFAULT_TDP);
    if (defaultTdp) {
      setTdp(defaultTdp);
    } else {
      sendTdpData();
    }
  });

  createTray();

  return window;
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.addListener("setRyzenadjPath", (_, ryzenadjPath) => {
  setItem(RYZENADJ_PATH, ryzenadjPath);
});

ipcMain.addListener("updateTdp", (e, tdp) => {
  setTdp(tdp);
});

ipcMain.addListener("setDefaultTdp", (e, tdp) => {
  setItem(DEFAULT_TDP, tdp);
});
