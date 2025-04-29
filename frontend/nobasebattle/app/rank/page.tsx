"use client";

import Button from "@/components/common/Button";
import RankingList from "@/components/ranking/RankingList";
import { transparentForm } from "@/styles/form";
import type { CharacterRankingApiResponse } from "@/types/Ranking";
import {
  fetchDailyTextRankings,
  fetchInfTextRankings,
} from "@/utils/api/rankings";
import { useCallback, useEffect, useState } from "react";

const RankPage = () => {
  const [textailyRanking, setTextailyRanking] =
    useState<CharacterRankingApiResponse | null>(null);
  const [rankType, setRankType] = useState<"daily" | "infinite">("daily");

  const fetchRankings = useCallback(async (type: "daily" | "infinite") => {
    try {
      const response =
        type === "daily"
          ? await fetchDailyTextRankings()
          : await fetchInfTextRankings();

      if (response?.data) {
        setTextailyRanking(response);
      }
    } catch (error) {
      console.error("랭킹 데이터를 불러오는데 실패했습니다:", error);
    }
  }, []);

  useEffect(() => {
    fetchRankings(rankType);
  }, [rankType, fetchRankings]);

  return (
    <div className="text-2xl w-full flex flex-col items-center gap-4">
      랭커에게 도전해보세요!
      <div className="w-full max-w-150">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl">랭킹</span>
          <div className="flex rounded-lg overflow-hidden border">
            <button
              type="button"
              onClick={() => setRankType("daily")}
              className={`px-3 py-1 text-base ${
                rankType === "daily"
                  ? "bg-gray-500/20 dark:bg-white/20"
                  : transparentForm
              }`}
            >
              일간
            </button>
            <button
              type="button"
              onClick={() => setRankType("infinite")}
              className={`px-3 py-1 text-base ${
                rankType === "infinite"
                  ? "bg-gray-500/20 dark:bg-white/20"
                  : transparentForm
              }`}
            >
              무기한
            </button>
          </div>
        </div>
        {textailyRanking && <RankingList rankingData={textailyRanking} />}
      </div>
      <Button text="그림 캐릭터 랭킹 보기" />
    </div>
  );
};

export default RankPage;
