package com.ssafy.nobasebattle.domain.badge.presentation.dto.response;

import com.ssafy.nobasebattle.domain.badge.domain.Badge;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class BadgeResponse {

    private String text;
    private LocalDateTime achievedAt;

    public BadgeResponse(Badge badge){
        this.text = badge.getText();
        this.achievedAt = LocalDateTime.now();
    }

    public BadgeResponse(String text, LocalDateTime achievedAt) {
        this.text = text;
        this.achievedAt = achievedAt;
    }
}
