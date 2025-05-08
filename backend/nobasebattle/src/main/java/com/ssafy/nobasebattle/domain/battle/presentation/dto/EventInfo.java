package com.ssafy.nobasebattle.domain.battle.presentation.dto;

import com.ssafy.nobasebattle.domain.battle.domain.Event;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class EventInfo {

    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Integer eloScore;
    private Integer winStreak;
    private Integer loseStreak;
    private String eventId;
    private LocalDateTime eventStartTime;
    private LocalDateTime eventEndTime;

    public EventInfo(Event event) {

        this.wins = 0;
        this.losses = 0;
        this.draws = 0;
        this.eloScore = 1000;
        this.winStreak = 0;
        this.loseStreak = 0;
        this.eventId = event.getId();
        this.eventStartTime = event.getStartTime();
        this.eventEndTime = event.getEndTime();
    }

    public void updateEventEloScore(Integer eloScore){ this.eloScore = eloScore; }

    public void updateWins(Integer wins){ this.wins = wins; }

    public void updateLosses(Integer losses){ this.losses = losses; }

    public void updateDraws(Integer draws){ this.draws = draws; }

    public void updateWinStreak(Integer winStreak){ this.winStreak = winStreak; }

    public void updateLoseStreak(Integer loseStreak){ this.loseStreak = loseStreak; }

    public void resetWinStreak(){ this.winStreak = 0; }

    public void resetLoseStreak(){ this.loseStreak = 0; }

    public double calculateWinRate() {
        int w = wins != null ? wins : 0;
        int l = losses != null ? losses : 0;
        int d = draws != null ? draws : 0;
        int totalGames = w + l + d;
        if (totalGames == 0) {
            return 0.0;
        }
        double winRate = (double) w / totalGames * 100.0;
        return (int) Math.floor(winRate);
    }

    public Integer calculateTotalBattles() {
        return wins + losses + draws;
    }
}
