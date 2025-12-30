"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const socket_io_client_1 = require("socket.io-client");
let win = null;
let timerOcultar = null;
function createWindow() {
    const displays = electron_1.screen.getAllDisplays();
    const monitorSecundario = displays.length > 1 ? displays[1] : displays[0];
    const win = new electron_1.BrowserWindow({
        x: monitorSecundario.bounds.x,
        y: monitorSecundario.bounds.y,
        width: monitorSecundario.bounds.width,
        height: monitorSecundario.bounds.height,
        frame: false,
        fullscreen: true,
        show: false,
        skipTaskbar: true,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });
    win.loadURL('http://localhost:3000');
    const socket = (0, socket_io_client_1.io)("http://localhost:3000");
    socket.on("connect", () => {
        console.log("Electron conectado ao servidor Socket!");
    });
    socket.on("exibir_anuncio", (data) => {
        console.log("Evento recebido! Exibindo janela...");
        if (win) {
            win.show();
            win.setAlwaysOnTop(true, 'screen-saver');
            if (timerOcultar)
                clearTimeout(timerOcultar);
            timerOcultar = setTimeout(() => {
                console.log("Escondendo janela...");
                if (win)
                    win.hide();
            }, 15000);
        }
    });
}
electron_1.app.on('window-all-closed', () => {
});
electron_1.app.whenReady().then(createWindow);
