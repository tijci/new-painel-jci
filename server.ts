import { createServer } from "http";
import { parse } from "url";
import next from "next";

import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
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
        console.log("Alguem se conectou: ", socket.id);
        socket.on("novo anuncio", (dadosDoAnuncio) => {
            io.emit("exibir_anuncio", dadosDoAnuncio);
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Servidor pronto em http://${hostname}:${port}`);
    })

});