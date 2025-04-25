package com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.response;

import lombok.Getter;

@Getter
public class BadgeResponse {

    private String badgeName;
    private String badgeUrl;

    public BadgeResponse(String badgeName, String badgeUrl) {
        this.badgeName = badgeName;
        this.badgeUrl = badgeUrl;
    }
}

