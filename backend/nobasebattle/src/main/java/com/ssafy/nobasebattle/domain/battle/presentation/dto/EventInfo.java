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

}
