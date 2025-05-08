package com.ssafy.nobasebattle.domain.battle.presentation.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class CreateEventRequest {
    private String text;
    private String imageUrl;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
