package com.ssafy.nobasebattle.domain.user.presentation.dto.response;

import com.ssafy.nobasebattle.domain.user.domain.AccountRole;
import com.ssafy.nobasebattle.domain.user.domain.User;
import lombok.Getter;

@Getter
public class UserResponse {

    private String email;
    private String nickname;
    private AccountRole accountRole;

    public UserResponse(User user) {
        this.email = user.getEmail();
        this.nickname = user.getNickname();
        this.accountRole = user.getAccountRole();
    }
}

