const { app, BrowserWindow, ipcMain } = require("electron");
const { download } = require("electron-dl");
const fs = require("fs");

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;

createWindow = () => {
	mainWindow = new BrowserWindow({ width: 900, height: 680, webPreferences: {
			nodeIntegration: true,
			webSecurity: false
		}
	});
	mainWindow.removeMenu();
	mainWindow.loadURL(isDev ? "http://localhost:3000" : "file://" + path.join(__dirname, "../build/index.html"));
	mainWindow.setBackgroundColor("#282c34");
	if(isDev) {
		mainWindow.webContents.openDevTools();
	}
	mainWindow.on("closed", () => mainWindow = null);

	ipcMain.on("download-file", (event, data) => {
		if(!data.options) {
			data.options = {};
		}

		if(data.directory) {
			data.options.directory = app.getAppPath() + "/" + data.directory;
		}

		data.options.onProgress = status => {
			event.reply("download-progress", status);
		};
		download(BrowserWindow.getFocusedWindow(), data.url, data.options)
        	.then(dl => {
				event.reply("download-file", dl.getSavePath());
			});
	});
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