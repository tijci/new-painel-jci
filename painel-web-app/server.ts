import { createServer } from "http";
import { parse } from "url";
import next from "next";

import { Server } from "socket.io";

const dev = false;
const hostname = process.env.HOSTNAME || "0.0.0.0";
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
        socket.on("novo anuncio", (dadosDoAnuncio) => {
            io.emit("exibir_anuncio", dadosDoAnuncio);
        });
        socket.on("novo comunicado", (dadosDoComunicado) => {
            io.emit("exibir_comunicado", dadosDoComunicado);
        })
    });

    httpServer.listen(port, () => {
        console.log(`> Servidor pronto em http://${hostname}:${port}`);
    })

});