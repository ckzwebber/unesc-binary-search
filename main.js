import { app, BrowserWindow, ipcMain } from "electron";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

ipcMain.handle("fetch-list", async () => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");
  return response.json();
});

ipcMain.handle("fetch-details", async (event, url) => {
  const response = await fetch(url);
  return response.json();
});

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  mainWindow.loadFile("index.html");
}

app
  .whenReady()
  .then(createWindow)
  .catch((error) => console.error(error));

process.on("unhandledRejection", (error) => console.error("Unhandled Promise Rejection:", error));

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
