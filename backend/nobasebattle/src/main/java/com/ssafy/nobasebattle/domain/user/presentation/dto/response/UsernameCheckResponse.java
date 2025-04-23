package com.ssafy.nobasebattle.domain.user.presentation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UsernameCheckResponse {

    private boolean exists;
}
