const { app, BrowserWindow, ipcMain } = require("electron");
const { download } = require("electron-dl");
const fs = require("fs");
const youtubedl = require("youtube-dl");

const { name, version } = require("../package.json");
const os = require('os');
const app_tmpDir = os.tmpdir() + "/" + name;

const path = require("path");
const isDev = require("electron-is-dev");
if(!isDev) {
	youtubedl.setYtdlBinary(
		youtubedl.getYtdlBinary().replace("app.asar", "app.asar.unpacked")
	);
}

const execa = require("execa");
let ffprobePath = require("@ffprobe-installer/ffprobe").path;
if(!isDev) {
	ffprobePath = require("@ffprobe-installer/ffprobe").path.replace(
		"app.asar",
		"app.asar.unpacked"
	);
}

let mainWindow;

createWindow = () => {
	mainWindow = new BrowserWindow({ width: 1000, height: 755, webPreferences: {
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

	ipcMain.on("get-app-version", (event, arg) => {
		event.returnValue = version;
	});

	ipcMain.on("download-file", (event, data) => {
		download(BrowserWindow.getFocusedWindow(), data.url, { saveAs: true });
	});

	ipcMain.on("download-tmp-file", (event, data) => {
		let options = {
			filename: data.fileName || null,
			onProgress: status => {
				event.reply("download-tmp-file-progress", status);
			},
			directory: app_tmpDir
		}		
		
		download(BrowserWindow.getFocusedWindow(), data.url, options)
        	.then(dl => {
				event.reply("download-tmp-file", dl.getSavePath());
			});
	});

	ipcMain.on("download-youtube-video", (event, data) => {
		const fullPath = app_tmpDir + "/" + data.fileName;
		const video = youtubedl(data.url, ["--format=18"], { cwd: app_tmpDir });

		video.on("error", () => {
			event.reply("download-youtube-video", null);
		});

		let size = 0;
		video.on("info", info => {
			size = info.size;
			video.pipe(fs.createWriteStream(fullPath));
		});

		let pos = 0;
		video.on("data", chunk => {
			pos += chunk.length;
			
			let progress = (pos / size) * 100.0;
			if(progress < 0) progress = 0;
			else if(progress > 100) progress = 100;

			event.reply("download-youtube-video-progress", progress);
		});

		video.on("end", () => {
			event.reply("download-youtube-video", fullPath);
		});
	});

	ipcMain.on("get-video-duration", async (event, data) => {
		const videoPath = data.videoPath;
		const params = ['-v', 'error', '-show_format', '-show_streams'];

		const { stdout } = await execa(ffprobePath, [...params, videoPath]);
		const matched = stdout.match(/duration="?(\d*\.\d*)"?/);
		
		let duration = 0;
		if(matched && matched[1]) {
			duration = parseFloat(matched[1]);
		}
		
		event.reply("get-video-duration", duration);
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