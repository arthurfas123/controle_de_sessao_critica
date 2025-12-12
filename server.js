const tls = require("tls")
const fs = require("fs");
const { KeyObject, Certificate } = require("crypto");

const pedidos = [];
let ocupado = false;

const options = {
    key: fs.readFileSync("server.key"),
    cert: fs.readFileSync("server.cert")
}

const server = tls.createServer(options, (socket) => {
    socket.setEncoding("utf8");

    socket.on("data", (data) => {
        const {mensagem, id} = JSON.parse(data.trim());

        if(mensagem == "REQUEST")
        {
            if(ocupado == false)
            {
                ocupado = true;
                socket.write("GRANT");
                console.log("GRANT enviado para o cliente" + id);
            }
            else
            {
                pedidos.push(socket);
                console.log("Cliente adicionado na fila de espera, id: " + id);
            }
        }

        if(mensagem == "RELEASE")
        {
            console.log("Cliente " + id + " liberou a sala");
            ocupado = false;
            if(pedidos.length > 0)
            {
                ocupado = true;
                socket = pedidos[0];
                pedidos.shift();
                console.log("GRANT enviado para o proximo da fila.")
                socket.write("GRANT");
            }
        }
    })
})

server.listen(8000, () => {
    console.log("Coordenador rodando na porta 8000.");
}); 