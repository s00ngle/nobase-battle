package com.ssafy.nobasebattle.domain.user.presentation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenRefreshRequest {

    private String refreshToken;
}
