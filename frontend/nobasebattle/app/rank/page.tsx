"use client";

import Button from "@/components/common/Button";
import RankingList from "@/components/ranking/RankingList";
import type { CharacterRankingApiResponse } from "@/types/Ranking";
import { fetchDailyTextRankings } from "@/utils/api/rankings";
import { useEffect, useState } from "react";

const RankPage = () => {
  const [textailyRanking, setTextailyRanking] =
    useState<CharacterRankingApiResponse | null>(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetchDailyTextRankings();
        if (response?.data) {
          setTextailyRanking(response);
        }
      } catch (error) {
        console.error("랭킹 데이터를 불러오는데 실패했습니다:", error);
      }
    };
    fetchRankings();
  }, []);

  return (
    <div className="text-2xl w-full flex flex-col items-center gap-4">
      랭커에게 도전해보세요!
      {textailyRanking && <RankingList rankingData={textailyRanking} />}
      <Button text="그림 캐릭터 랭킹 보기" />
    </div>
  );
};

export default RankPage;
