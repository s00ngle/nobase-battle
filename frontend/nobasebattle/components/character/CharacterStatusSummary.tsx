import { transparentForm } from "@/styles/form";

interface SummaryProps {
  eloScore: number;
  rank: number;
  winRate: number;
}

const CharacterStatusSummary = ({ eloScore, rank, winRate }: SummaryProps) => {
  return (
    <div className="flex gap-2 w-full">
      <div className="flex flex-col items-center gap-2 text-base w-full">
        <span>레이팅</span>
        <span className={`text-center w-full px-3 py-3 rounded-xl ${transparentForm}`}>
          {eloScore}점
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 text-base w-full">
        <span>순위</span>
        <span className={`text-center w-full px-3 py-3 rounded-xl ${transparentForm}`}>
          {rank}등
        </span>
      </div>
      <div className="flex flex-col items-center gap-2 text-base w-full">
        <span>승률</span>
        <span className={`text-center w-full px-3 py-3 rounded-xl ${transparentForm}`}>
          {winRate}%
        </span>
      </div>
    </div>
  );
};

export default CharacterStatusSummary;
