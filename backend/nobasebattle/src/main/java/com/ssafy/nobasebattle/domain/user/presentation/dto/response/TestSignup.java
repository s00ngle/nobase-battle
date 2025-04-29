package com.ssafy.nobasebattle.domain.user.presentation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TestSignup {

    private String accessToken;
    private String id;
}
