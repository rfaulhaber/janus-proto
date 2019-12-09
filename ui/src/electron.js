const { app, BrowserWindow, ipcMain } = require('electron');
const { spawn } = require('child_process');
const { argv, exit } = require('process');

let win;

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});

if (!argv[2]) {
	console.error('no executable found');
	exit(1);
}

const corePath = argv[2];

const core = spawn(corePath);

core.stdout.on('data', function(data) {
	console.log(`core emitted data "${data.toString()}"`);
	win.webContents.send('ipc', JSON.parse(data));
});

core.stderr.on('data', function(data) {
	console.error(`core emitted error"${data.toString()}"`);
});

ipcMain.on('ipc', function(event, arg) {
	console.log('received command from renderer', arg);
	core.stdin.write(`${JSON.stringify(arg)}\n`);
});

function createWindow() {
	console.log('creating window in main');
	win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true
		}
	});

	if (process.env.NODE_ENV == 'production') {
		win.loadFile('dist/index.html');
	} else {
		win.loadURL('http://localhost:8080');
	}

	// win.webContents.openDevTools();

	win.on('closed', () => {
		win = null;
	});
}
