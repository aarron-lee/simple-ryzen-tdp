const path = require("path");
const fs = require("fs");

function initializeSettings(app) {
  const CONFIG_PATH = app.getPath("appData");
  const SETTINGS_PATH = path.join(CONFIG_PATH, "ryzen-tdp-settings.json");

  let settings = {};

  console.log(SETTINGS_PATH);

  const saveSettings = () => {
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

  return { setItem, getItem };
}

module.exports = {
  initializeSettings,
};
