package com.ssafy.nobasebattle.domain.battle.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class EloRatingService {

    private static final int K_FACTOR = 32; // ELO 상수 (변화 강도)
    private static final int DEFAULT_RATING = 1000; // 초기 레이팅

    /**
     * ELO 레이팅 업데이트 계산
     * @param playerRating 플레이어 현재 레이팅
     * @param opponentRating 상대방 현재 레이팅
     * @param result 경기 결과 (1.0: 승리, 0.5: 무승부, 0.0: 패배)
     * @return 업데이트된 ELO 레이팅
     */
    public int calculateNewRating(int playerRating, int opponentRating, double result) {
        // 기본값 설정
        if (playerRating <= 0) playerRating = DEFAULT_RATING;
        if (opponentRating <= 0) opponentRating = DEFAULT_RATING;

        // 기대 승률 계산
        double expectedScore = calculateExpectedScore(playerRating, opponentRating);

        // 새 ELO 레이팅 계산
        return (int) Math.round(playerRating + K_FACTOR * (result - expectedScore));
    }

    /**
     * 기대 승률 계산
     * @param playerRating 플레이어 레이팅
     * @param opponentRating 상대방 레이팅
     * @return 기대 승률 (0.0 ~ 1.0)
     */
    private double calculateExpectedScore(int playerRating, int opponentRating) {
        return 1.0 / (1.0 + Math.pow(10.0, (opponentRating - playerRating) / 400.0));
    }

    /**
     * 두 플레이어의 새 레이팅을 계산하여 배열로 반환
     * @param player1Rating 첫 번째 플레이어 레이팅
     * @param player2Rating 두 번째 플레이어 레이팅
     * @param result 결과 값 (1: 첫 번째 플레이어 승, 0: 무승부, -1: 두 번째 플레이어 승)
     * @return 업데이트된 두 플레이어의 ELO 레이팅 배열 [player1NewRating, player2NewRating]
     */
    public int[] calculateNewRatings(int player1Rating, int player2Rating, int result) {
        double player1Result, player2Result;

        // 결과에 따른 점수 할당
        if (result == 1) {          // 첫 번째 플레이어 승리
            player1Result = 1.0;
            player2Result = 0.0;
        } else if (result == -1) {  // 두 번째 플레이어 승리
            player1Result = 0.0;
            player2Result = 1.0;
        } else {                    // 무승부
            player1Result = 0.5;
            player2Result = 0.5;
        }

        // 각 플레이어의 새 레이팅 계산
        int player1NewRating = calculateNewRating(player1Rating, player2Rating, player1Result);
        int player2NewRating = calculateNewRating(player2Rating, player1Rating, player2Result);

        return new int[] { player1NewRating, player2NewRating };
    }
}
