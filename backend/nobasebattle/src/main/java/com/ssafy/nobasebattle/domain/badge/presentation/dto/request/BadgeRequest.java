package com.ssafy.nobasebattle.domain.badge.presentation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BadgeRequest {

    private String text;
    private String imageUrl;
    private String badgeType;
    private int condition;
}
