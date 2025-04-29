package com.ssafy.nobasebattle.domain.user.presentation.dto.response;

import com.ssafy.nobasebattle.domain.user.domain.AccountRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AuthTokensResponse {

    private String accessToken;
    private AccountRole role;
}

