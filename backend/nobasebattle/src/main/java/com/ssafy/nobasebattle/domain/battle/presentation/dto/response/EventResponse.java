package com.ssafy.nobasebattle.domain.battle.presentation.dto.response;

import com.ssafy.nobasebattle.domain.battle.domain.Event;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class EventResponse {

    private String id;
    private String text;
    private String imageUrl;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;

    public EventResponse(Event event) {
        this.id = event.getId();
        this.text = event.getText();
        this.imageUrl = event.getImageUrl();
        this.startTime = event.getStartTime();
        this.endTime = event.getEndTime();
        this.createdAt = event.getCreatedAt();
    }
}
