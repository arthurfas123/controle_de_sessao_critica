const tls = require("tls");
const id = 1;

const options = {
    rejectUnauthorized: false
}

const client = tls.connect(8000, options, () => {
    console.log("Conectado ao Coordenador.");
    console.log("Pedindo acesso.")
    client.write(JSON.stringify({mensagem: "REQUEST", id: id}));
})

client.setEncoding("utf-8");

client.on("data", (data) => {
    const mensagem = data.trim();

    if(mensagem == "GRANT")
    {
        console.log("Entrando na seção critica.")
        setTimeout(() => {
            console.log("Saindo da seção critica.");

            client.write(JSON.stringify({mensagem: "RELEASE", id: id}));

            setTimeout(() => {
                client.write(JSON.stringify({mensagem: "REQUEST", id: id}));
            }, 5000)
        }, 3000)
    }
})