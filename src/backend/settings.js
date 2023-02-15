const path = require("path");
const fs = require("fs");

const DEFAULT_SETTINGS = {
  appVerson: undefined,
  defaultTdp: undefined,
  isWindowHidden: false,
  ryzenadjPath: undefined,
  tdpRange: [5, 18],
  showIntroDialog: true,
};

function initializeSettings(app) {
  const appVersion = app.getVersion();
  const CONFIG_PATH = app.getPath("appData");
  const SETTINGS_PATH = path.join(CONFIG_PATH, "ryzen-tdp-settings.json");

  let settings = DEFAULT_SETTINGS;

  const saveSettings = () => {
    settings.appVersion = appVersion;
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2));
  };

  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const rawData = fs.readFileSync(SETTINGS_PATH);

      settings = JSON.parse(rawData);
    } else {
      // initialize settings file
      saveSettings();
    }
  } catch (e) {
    console.error(e);
  }

  const setItem = (key, value) => {
    settings[key] = value;
    saveSettings();
  };

  const getItem = (key) => settings[key];

  const getSettings = () => settings;

  return { getSettings, setItem, getItem };
}

module.exports = {
  initializeSettings,
};
