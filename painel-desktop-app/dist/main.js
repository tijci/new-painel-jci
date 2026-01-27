"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const socket_io_client_1 = require("socket.io-client");
let win = null;
let timerOcultar = null;
function createWindow() {
    const socket = (0, socket_io_client_1.io)("http://localhost:3000");
    socket.on("connect", () => {
        console.log("Electron conectado ao servidor Socket!");
    });
    const gerenciarJanelaDeAnuncios = () => {
        const displays = electron_1.screen.getAllDisplays();
        if (displays.length < 5) {
            const monitorSecundario = displays[0];
            if (!win) {
                console.log("Monitor secundário detectado. Criando janela...");
                // NOTA: Removemos o 'const' para usar a variável global 'win'
                win = new electron_1.BrowserWindow({
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
                // Variável de controle para saber se a página já renderizou visualmente
                let isReady = false;
                win.loadURL('http://localhost:3000');
                // O evento 'ready-to-show' é disparado pelo Electron quando a página 
                // terminou de desenhar a primeira tela (não é mais branca)
                win.once('ready-to-show', () => {
                    isReady = true;
                    console.log("Janela renderizada e pronta para exibição.");
                });
                win.on('closed', () => {
                    win = null;
                });
                // Guardamos a referência do estado 'isReady' na própria janela 
                // para acessar no evento do socket (hack técnico seguro em JS)
                win.isReady = false;
                win.once('ready-to-show', () => { win.isReady = true; });
            }
            else {
                win.setBounds(monitorSecundario.bounds);
            }
        }
        else {
            if (win) {
                console.log("Monitor secundário desconectado. Fechando janela de anúncios...");
                win.close();
                win = null;
            }
        }
    };
    gerenciarJanelaDeAnuncios();
    electron_1.screen.on('display-added', () => {
        console.log("Hardware: Display adicionado!");
        gerenciarJanelaDeAnuncios();
    });
    // Se remover um monitor, roda a função gerente
    electron_1.screen.on('display-removed', () => {
        console.log("Hardware: Display removido!");
        gerenciarJanelaDeAnuncios();
    });
    socket.on("exibir_anuncio", (data) => {
        console.log("Evento recebido! Processando exibição...");
        if (win && !win.isDestroyed()) {
            // Função auxiliar para mostrar a janela com segurança
            const mostrarAgora = () => {
                if (win && !win.isDestroyed()) {
                    console.log("Exibindo janela agora!");
                    win.show();
                    win.setAlwaysOnTop(true, 'screen-saver');
                    if (timerOcultar)
                        clearTimeout(timerOcultar);
                    timerOcultar = setTimeout(() => {
                        console.log("Escondendo janela...");
                        if (win && !win.isDestroyed())
                            win.hide();
                    }, 15000);
                }
            };
            // Se já estiver renderizada, mostra imediatamente.
            // Se não, espera o evento 'ready-to-show' para não mostrar tela branca.
            if (win.isReady) {
                mostrarAgora();
            }
            else {
                console.log("Janela ainda carregando... aguardando renderização.");
                win.once('ready-to-show', mostrarAgora);
            }
        }
    });
}
electron_1.app.on('window-all-closed', () => {
});
electron_1.app.whenReady().then(createWindow);
