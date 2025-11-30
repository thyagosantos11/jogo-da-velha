import { useState } from "react";
import "./styles.css";

export default function App() {
  const emptyBoard = Array(9).fill(null);

  const [board, setBoard] = useState(emptyBoard);
  const [player, setPlayer] = useState("X");
  const [score, setScore] = useState({ X: 0, O: 0, empates: 0 });
  const [winner, setWinner] = useState(null);

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  const checkWinner = (newBoard) => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = player;
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
      setScore({ ...score, [result]: score[result] + 1 });
      return;
    }

    if (newBoard.every((cell) => cell)) {
      setWinner("E");
      setScore({ ...score, empates: score.empates + 1 });
      return;
    }

    setPlayer(player === "X" ? "O" : "X");
  };

  const resetBoard = () => {
    setBoard(emptyBoard);
    setWinner(null);
    setPlayer("X");
  };

  const resetScore = () => {
    setScore({ X: 0, O: 0, empates: 0 });
    resetBoard();
  };

  return (
    <div className="container">
      <h1>Jogo da Velha</h1>

      <div className="scoreboard">
        <div className="score-item">
          <strong>X</strong>
          <span>{score.X}</span>
        </div>

        <div className="score-item">
          <strong>Empates</strong>
          <span>{score.empates}</span>
        </div>

        <div className="score-item">
          <strong>O</strong>
          <span>{score.O}</span>
        </div>

        <div className="score-actions">
          <button className="small" onClick={resetScore}>Resetar placar</button>
          <button className="small" onClick={resetBoard}>Reiniciar partida</button>
        </div>
      </div>

      <div className="turno">
        {winner
          ? winner === "E"
            ? "Empate!"
            : `Vitória de: ${winner}`
          : `Vez do jogador: ${player}`}
      </div>

      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className="cell"
            onClick={() => handleClick(index)}
          >
            {cell}
          </button>
        ))}
      </div>

      <p className="info">
        Dica: clique em reiniciar partida para zerar o tabuleiro sem alterar o placar.
      </p>
    </div>
  );
}
