import { createServer } from "http";
import { parse } from "url";
import next from "next";

import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "192.168.15.138";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {

    const httpServer = createServer(async (req, res) => {
        const parsedUrl = parse(req.url!, true);
        await handle(req, res, parsedUrl);
    })

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log(`🔌 Cliente conectado: ${socket.id}`);
        socket.on("novo anuncio", (dadosDoAnuncio) => {
            // Log para confirmar recebimento
            console.log("📢 Evento 'novo anuncio' recebido:", dadosDoAnuncio);
            io.emit("exibir_anuncio", dadosDoAnuncio);
        });
        socket.on("novo comunicado", (dadosDoComunicado) => {
            // Log para confirmar recebimento
            console.log("🔔 Evento 'novo comunicado' recebido:", dadosDoComunicado);
            io.emit("exibir_comunicado", dadosDoComunicado);
        })
    });

    httpServer.listen(port, () => {
        console.log(`> Servidor pronto em http://${hostname}:${port}`);
    })

});