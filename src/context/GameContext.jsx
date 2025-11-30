import { createContext, useContext, useEffect, useState } from "react";

const GameContext = createContext();

const STORAGE_KEY = "jogo-da-velha-score-v1";

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function GameProvider({ children }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X");
  const [winner, setWinner] = useState(null); // "X" | "O" | null
  const [isDraw, setIsDraw] = useState(false);

  const [score, setScore] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore parse errors
    }
    return { X: 0, O: 0, draws: 0 };
  });

  // persist score to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(score));
    } catch (e) {
      // ignore
    }
  }, [score]);

  function handlePlay(index) {
    if (board[index] || winner || isDraw) return;

    const newBoard = [...board];
    newBoard[index] = player;

    const gameWinner = calculateWinner(newBoard);

    setBoard(newBoard);
    setPlayer((p) => (p === "X" ? "O" : "X"));

    if (gameWinner) {
      setWinner(gameWinner);
      setScore((s) => ({ ...s, [gameWinner]: s[gameWinner] + 1 }));
      return;
    }

    // check draw (board full and no winner)
    if (newBoard.every(Boolean)) {
      setIsDraw(true);
      setScore((s) => ({ ...s, draws: s.draws + 1 }));
    }
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setPlayer("X");
    setWinner(null);
    setIsDraw(false);
  }

  function resetScore() {
    setScore({ X: 0, O: 0, draws: 0 });
  }

  return (
    <GameContext.Provider
      value={{
        board,
        player,
        winner,
        isDraw,
        handlePlay,
        resetGame,
        score,
        resetScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
