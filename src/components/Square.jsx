import { useGame } from "../context/GameContext.jsx";

export default function Square({ index, value }) {
  const { handlePlay } = useGame();

  return (
    <button className="square" onClick={() => handlePlay(index)}>
      {value}
    </button>
  );
}
