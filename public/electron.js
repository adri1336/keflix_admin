const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

createWindow = () => {
	mainWindow = new BrowserWindow({ width: 900, height: 680 });
	mainWindow.removeMenu();
	mainWindow.loadURL(isDev ? "http://localhost:3000" : "file://" + path.join(__dirname, "../build/index.html"));
	mainWindow.setBackgroundColor("#282c34");
	if(isDev) {
		mainWindow.webContents.openDevTools();
	}
	mainWindow.on("closed", () => mainWindow = null);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if(process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if(mainWindow === null) {
		createWindow();
	}
});