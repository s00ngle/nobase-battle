package com.ssafy.nobasebattle.domain.battle.domain;

import com.ssafy.nobasebattle.global.common.BaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "events")
@Getter
@NoArgsConstructor
public class Event extends BaseEntity {

    private String text;
    private String imageUrl;
    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Builder
    public Event(String text, String imageUrl, LocalDateTime startTime, LocalDateTime endTime) {
        this.text = text;
        this.imageUrl = imageUrl;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}
