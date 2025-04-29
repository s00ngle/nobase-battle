package com.ssafy.nobasebattle.domain.user.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class UserLoginFailedException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new UserLoginFailedException();

    private UserLoginFailedException() {
        super(ErrorCode.LOGIN_FAILED);
    }
}
