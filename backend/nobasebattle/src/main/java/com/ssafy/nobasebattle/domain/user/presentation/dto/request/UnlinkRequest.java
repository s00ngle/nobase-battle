package com.ssafy.nobasebattle.domain.user.presentation.dto.request;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UnlinkRequest {

    private String accessToken;
}