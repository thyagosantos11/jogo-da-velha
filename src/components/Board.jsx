import Square from "./Square.jsx";
import { useGame } from "../context/GameContext.jsx";

export default function Board() {
  const { board } = useGame();

  return (
    <div className="board">
      {board.map((value, index) => (
        <Square key={index} index={index} value={value} />
      ))}
    </div>
  );
}
