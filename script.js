// ==============================
// DOMINÓ - JOGO CONTRA COMPUTADOR
// ==============================

const playerHandElement = document.getElementById("playerHand");
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");

const newGameButton = document.getElementById("newGame");
const drawButton = document.getElementById("drawTile");

const playerScoreElement = document.getElementById("playerScore");
const computerScoreElement = document.getElementById("computerScore");

let deck = [];
let playerHand = [];
let computerHand = [];
let board = [];

let playerScore = 0;
let computerScore = 0;

let gameStarted = false;
let playerTurn = true;


// ==============================
// CRIAR DOMINÓ
// ==============================

function createDeck() {
    const newDeck = [];

    for (let a = 0; a <= 6; a++) {
        for (let b = a; b <= 6; b++) {
            newDeck.push([a, b]);
        }
    }

    return newDeck;
}


// ==============================
// EMBARALHAR
// ==============================

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}


// ==============================
// INICIAR JOGO
// ==============================

function startGame() {
    deck = createDeck();
    shuffle(deck);

    playerHand = deck.splice(0, 7);
    computerHand = deck.splice(0, 7);

    board = [];

    gameStarted = true;
    playerTurn = true;

    drawButton.disabled = false;

    statusElement.textContent = "Sua vez! Escolha uma peça.";

    render();
}


// ==============================
// MOSTRAR PEÇA
// ==============================

function createDominoElement(tile, clickable = false, index = null) {
    const domino = document.createElement(
        clickable ? "button" : "div"
    );

    domino.classList.add("domino");

    if (clickable) {
        domino.classList.add("domino-button");

        domino.addEventListener("click", () => {
            playPlayerTile(index);
        });
    }

    domino.appendChild(createHalf(tile[0]));
    domino.appendChild(createHalf(tile[1]));

    return domino;
}


// ==============================
// CRIAR METADE DA PEÇA
// ==============================

function createHalf(number) {
    const half = document.createElement("div");
    half.classList.add("half");

    const positions = {
        0: [],
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8]
    };

    positions[number].forEach(position => {
        const dot = document.createElement("span");
        dot.classList.add("dot");

        const row = Math.floor(position / 3) + 1;
        const column = (position % 3) + 1;

        dot.style.gridRow = row;
        dot.style.gridColumn = column;

        half.appendChild(dot);
    });

    return half;
}


// ==============================
// RENDERIZAR JOGO
// ==============================

function render() {
    renderPlayerHand();
    renderBoard();

    playerScoreElement.textContent = playerScore;
    computerScoreElement.textContent = computerScore;
}


// ==============================
// MOSTRAR MÃO DO JOGADOR
// ==============================

function renderPlayerHand() {
    playerHandElement.innerHTML = "";

    playerHand.forEach((tile, index) => {
        const playable = canPlay(tile);

        const element = createDominoElement(
            tile,
            playable && playerTurn,
            index
        );

        if (!playable || !playerTurn) {
            element.disabled = true;
        }

        playerHandElement.appendChild(element);
    });
}


// ==============================
// MOSTRAR MESA
// ==============================

function renderBoard() {
    boardElement.innerHTML = "";

    if (board.length === 0) {
        const message = document.createElement("p");

        message.classList.add("empty");
        message.textContent = "Coloque uma peça para começar!";

        boardElement.appendChild(message);

        return;
    }

    board.forEach(tile => {
        boardElement.appendChild(
            createDominoElement(tile)
        );
    });
}


// ==============================
// VERIFICAR SE PODE JOGAR
// ==============================

function canPlay(tile) {
    if (board.length === 0) {
        return true;
    }

    const left = board[0][0];
    const right = board[board.length - 1][1];

    return (
        tile[0] === left ||
        tile[1] === left ||
        tile[0] === right ||
        tile[1] === right
    );
}


// ==============================
// JOGAR PEÇA DO JOGADOR
// ==============================

function playPlayerTile(index) {
    if (!gameStarted || !playerTurn) {
        return;
    }

    const tile = playerHand[index];

    if (!canPlay(tile)) {
        statusElement.textContent = "Essa peça não pode ser jogada.";
        return;
    }

    playerHand.splice(index, 1);

    placeTile(tile);

    statusElement.textContent = "Você jogou uma peça!";

    checkEndGame();

    if (gameStarted) {
        playerTurn = false;

        render();

        setTimeout(computerTurn, 800);
    }
}


// ==============================
// COLOCAR PEÇA NA MESA
// ==============================

function placeTile(tile) {
    if (board.length === 0) {
        board.push(tile);
        return;
    }

    const left = board[0][0];
    const right = board[board.length - 1][1];

    if (tile[1] === left) {
        board.unshift(tile);
    } else if (tile[0] === left) {
        board.unshift([tile[1], tile[0]]);
    } else if (tile[0] === right) {
        board.push(tile);
    } else if (tile[1] === right) {
        board.push([tile[1], tile[0]]);
    }
}


// ==============================
// VEZ DO COMPUTADOR
// ==============================

function computerTurn() {
    if (!gameStarted) {
        return;
    }

    const possibleMoves = [];

    computerHand.forEach((tile, index) => {
        if (canPlay(tile)) {
            possibleMoves.push(index);
        }
    });

    if (possibleMoves.length === 0) {
        if (deck.length > 0) {
            computerHand.push(deck.pop());

            statusElement.textContent =
                "O computador comprou uma peça.";

            render();

            setTimeout(computerTurn, 700);
            return;
        }

        statusElement.textContent =
            "O computador não pode jogar. Sua vez!";

        playerTurn = true;
        render();

        return;
    }

    // Escolhe uma peça aleatória
    const randomIndex =
        possibleMoves[
            Math.floor(Math.random() * possibleMoves.length)
        ];

    const tile = computerHand[randomIndex];

    computerHand.splice(randomIndex, 1);

    placeTile(tile);

    statusElement.textContent =
        "O computador jogou uma peça.";

    checkEndGame();

    if (gameStarted) {
        playerTurn = true;

        render();

        statusElement.textContent =
            "Sua vez! Escolha uma peça.";
    }
}


// ==============================
// COMPRAR PEÇA
// ==============================

function drawTile() {
    if (!gameStarted || !playerTurn) {
        return;
    }

    if (deck.length === 0) {
        statusElement.textContent =
            "Não existem mais peças para comprar.";

        return;
    }

    const tile = deck.pop();

    playerHand.push(tile);

    statusElement.textContent =
        "Você comprou uma peça.";

    render();

    // Se a peça não puder ser jogada, passa a vez
    if (!canPlay(tile)) {
        setTimeout(() => {
            playerTurn = false;

            statusElement.textContent =
                "Você não pode jogar. Vez do computador.";

            render();

            setTimeout(computerTurn, 800);
        }, 600);
    }
}


// ==============================
// VERIFICAR FIM DA PARTIDA
// ==============================

function checkEndGame() {
    if (playerHand.length === 0) {
        playerScore++;

        statusElement.textContent =
            "🎉 Você venceu a rodada!";

        endRound();

        return true;
    }

    if (computerHand.length === 0) {
        computerScore++;

        statusElement.textContent =
            "🤖 O computador venceu a rodada!";

        endRound();

        return true;
    }

    // Caso ninguém possa jogar
    const playerCanPlay =
        playerHand.some(tile => canPlay(tile));

    const computerCanPlay =
        computerHand.some(tile => canPlay(tile));

    if (
        !playerCanPlay &&
        !computerCanPlay &&
        deck.length === 0
    ) {
        const playerPoints = countPips(playerHand);
        const computerPoints = countPips(computerHand);

        if (playerPoints < computerPoints) {
            playerScore++;

            statusElement.textContent =
                "🏆 Rodada encerrada! Você venceu por pontos.";
        } else if (computerPoints < playerPoints) {
            computerScore++;

            statusElement.textContent =
                "🤖 Rodada encerrada! O computador venceu por pontos.";
        } else {
            statusElement.textContent =
                "🤝 Rodada empatada!";
        }

        endRound();

        return true;
    }

    return false;
}


// ==============================
// CONTAR PONTOS DAS PEÇAS
// ==============================

function countPips(hand) {
    return hand.reduce(
        (total, tile) => total + tile[0] + tile[1],
        0
    );
}


// ==============================
// ENCERRAR RODADA
// ==============================

function endRound() {
    gameStarted = false;
    playerTurn = false;

    drawButton.disabled = true;

    render();
}


// ==============================
// BOTÕES
// ==============================

newGameButton.addEventListener("click", () => {
    startGame();
});

drawButton.addEventListener("click", () => {
    drawTile();
});


// ==============================
// ESTADO INICIAL
// ==============================

render();