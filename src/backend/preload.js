/* eslint-disable import/no-extraneous-dependencies */
// Import the necessary Electron components.
const { contextBridge } = require("electron");
const { ipcRenderer } = require("electron");

// Exposed protected methods in the render process.
contextBridge.exposeInMainWorld(
  // Allowed 'ipcRenderer' methods.
  "ipcRender",
  {
    // From render to main.
    send: (channel, args) => {
      ipcRenderer.send(channel, args);
    },
    // From main to render.
    receive: (channel, listener) => {
      ipcRenderer.on(channel, (event, ...args) => listener(...args));
    },
    // From render to main and back again.
    invoke: (channel, args) => ipcRenderer.invoke(channel, args),
  }
);
