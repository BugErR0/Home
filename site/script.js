let socket; // <- variavel para armazenar a conexão do servidor
let user; // <- variavel para guarda nome do usuario
let inderecoSerivdor; // <- variavel para guarda indereço do servidor

// função para definer nome do usuario
function nome() {
    user = document.getElementById("nome").value;
};

// função para definer indereço do servidor
function SetIndereco() {
    inderecoSerivdor = document.getElementById("indereco").value;
};

function conectar() {
    if (!socket || socket.readyState === WebSocket.CLOSED) { // <-  verificar se já tem conexão se sim vai fazer uma nova conexão
        socket = new WebSocket(inderecoSerivdor + ":9890"); // <- faz uma nova conexão com servidor pelo indereço

        // eventos do socket 

        // verificar se está conectado
        socket.onopen = () => {
            console.log("Conexão estabelecida!");
        };

        // quando receber um dado
        socket.onmessage = (event) => {
            console.log("Mensagem recebida:", event.data);

            // Exibe a mensagem na página
            const chatBox = document.getElementById("chat");
            const messageElement = document.createElement("p");
            messageElement.textContent = event.data;
            chatBox.appendChild(messageElement);
        };

        // quando da um erro
        socket.onerror = (error) => {
            console.error("Erro:", error);
        };

        // quando for encerrada a comunicação
        socket.onclose = (event) => {
            console.log("Conexão encerrada. Código:", event.code, "Razão:", event.reason);
        };
    } else {
        console.log("Já está conectado");
    }
}

function fechar() {
    console.log("Estado do WebSocket:", socket.readyState); // <- isso só para saber estado do socket, para saber se deu um erro

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(user + " foi desconectando"); // <- para enviar dado para servidor e depois para outros clientes recebe esse dado

        socket.close(1000, "Conexão fechada pelo cliente."); // <- cancelar conexão com servidor
        console.log("Enviando solicitação de fechamento para o servidor.");
    } else {
        console.log("Conexão já está fechada ou em processo de fechamento.");
    }
}

// função para enviar messagem
function msg() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const mensagem = document.getElementById("messagem").value;
        socket.send(user + ": " + mensagem); // <- isso enviar dado para servidor e depois para outros clientes recebe esse dado

        // Exibe a mensagem enviada pelo cliente
        const chatBox = document.getElementById("chat");
        const messageElement = document.createElement("p");
        messageElement.textContent = "Você: " + mensagem;
        messageElement.style.color = "blue"; // <- só para saber qual sua messagem
        chatBox.appendChild(messageElement);

        document.getElementById("messagem").value = ""; // <- Limpa o campo de entrada
    } else {
        console.log("Não é possível enviar, o WebSocket está fechado.");
    }
}
