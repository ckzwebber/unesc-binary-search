const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  fetchList: () => ipcRenderer.invoke("fetch-list"),
  fetchDetails: (url) => ipcRenderer.invoke("fetch-details", url),
});
