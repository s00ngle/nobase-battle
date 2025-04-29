package com.ssafy.nobasebattle.domain.badge.presentation.dto;

import com.ssafy.nobasebattle.domain.badge.domain.Badge;
import lombok.Getter;

@Getter
public class BadgeInfo {

    private String text;
    private String imageUrl;
    private String badgeType;
    private Integer condition;

    public BadgeInfo(Badge badge) {
        this.text = badge.getText();
        this.imageUrl = badge.getImageUrl();
        this.badgeType = badge.getBadgeType();
        this.condition = badge.getCondition();
    }
}
