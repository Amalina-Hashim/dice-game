document.addEventListener("DOMContentLoaded", function () {
  const rollDiceBtn = document.getElementById("roll-dice-btn");
  const restartBtn = document.getElementById("restart-btn");
  const player1Board = document.getElementById("player1-board");
  const player2Board = document.getElementById("player2-board");
  const gameInfo = document.getElementById("game-info");
  const diceImage = document.getElementById("diceImage");

  diceImage.src = "/images/dice6.png";

  let player1Position = 0;
  let player2Position = 0;
  let currentPlayer = 1;

  const diceImages = [
    "/images/dice1.png",
    "/images/dice2.png",
    "/images/dice3.png",
    "/images/dice4.png",
    "/images/dice5.png",
    "/images/dice6.png",
  ];

  function initializeGame() {
    diceImage.src = "/images/dice6.png";
    player1Position = 0;
    player2Position = 0;
    currentPlayer = 1;
    rollDiceBtn.disabled = false;
    updateGameInfo("");

    initializeBoard(player1Board, "player1");
    initializeBoard(player2Board, "player2");
  }

  function initializeBoard(playerBoard, playerClass) {
    playerBoard.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
      playerBoard.appendChild(createSquareElement(i, playerClass));
    }
  }

  function createSquareElement(position, playerClass) {
    const square = document.createElement("div");
    square.classList.add("square", playerClass);
    square.textContent = position;
    return square;
  }

  function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function updateDiceImage(diceRoll) {
    diceImage.src = diceImages[diceRoll - 1];
    shakeDiceImage(diceImage);
  }

  function shakeDiceImage(element) {
    element.classList.add("shake");
    void element.offsetWidth;
    setTimeout(() => {
      element.classList.remove("shake");
    }, 500);
  }

  function updatePosition(playerPosition, playerBoard, playerClass, diceRoll) {
    const newPosition = playerPosition + diceRoll;

    if (newPosition > 10) {
      return 10 - (newPosition - 10);
    } else {
      return newPosition;
    }
  }

  function updatePlayerPosition(position, playerBoard, playerClass) {
    const squares = playerBoard.getElementsByClassName(playerClass);

    for (let i = 0; i < squares.length; i++) {
      squares[i].classList.remove("active");

      if (i === position - 1) {
        squares[i].classList.add("active");
        squares[i].textContent = "X";
      } else {
        squares[i].textContent = i + 1;
      }
    }
  }

  function handleRollDice() {
    const diceRoll = rollDice();
    updateDiceImage(diceRoll);

    const currentPosition =
      currentPlayer === 1 ? player1Position : player2Position;

    let bouncedBackMessage = "";

    if (currentPlayer === 1) {
      const newPosition = updatePosition(
        player1Position,
        player1Board,
        "player1",
        diceRoll
      );
      if (newPosition < player1Position) {
        bouncedBackMessage = `Oops, Player 1 bounced back! Rolled a ${diceRoll}. Current position is now: ${newPosition}`;
      }
      player1Position = newPosition;
      updatePlayerPosition(player1Position, player1Board, "player1");

      const move = document.getElementById("move");
      if (move) {
        move.play();
      }
    } else {
      const newPosition = updatePosition(
        player2Position,
        player2Board,
        "player2",
        diceRoll
      );
      if (newPosition < player2Position) {
        bouncedBackMessage = `Oops, Player 2 bounced back! Rolled a ${diceRoll}. Current position is now: ${newPosition}`;
      }
      player2Position = newPosition;
      updatePlayerPosition(player2Position, player2Board, "player2");

      const move = document.getElementById("move");
      if (move) {
        move.play();
      }
    }

    if (getCurrentPlayerPosition() === 10) {
      const winnerPlayer = currentPlayer === 1 ? "Player 1" : "Player 2";
      updateGameInfo(
        `🏁 ${winnerPlayer} wins reaching position 10 first with dice count: ${diceRoll}!`
      );
      rollDiceBtn.disabled = true;

      const winSound = document.getElementById("winSound");
      if (winSound) {
        winSound.play();
      }
    } else {
      const message = `Player ${currentPlayer} rolled a ${diceRoll}. Position is now: ${getCurrentPlayerPosition()}`;
      updateGameInfo(message);

      if (bouncedBackMessage) {
        updateGameInfo(bouncedBackMessage);
      }

      const move = document.getElementById("move");
      if (move) {
        move.play();
      }

      currentPlayer = currentPlayer === 1 ? 2 : 1;
    }
  }

  function getCurrentPlayerPosition() {
    return currentPlayer === 1 ? player1Position : player2Position;
  }

  function handleRestart() {
    initializeGame();
  }

  function updateGameInfo(message) {
    gameInfo.innerHTML = message;
  }

  rollDiceBtn.addEventListener("click", handleRollDice);
  restartBtn.addEventListener("click", handleRestart);

  initializeGame();
});
