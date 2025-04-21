package com.ssafy.nobasebattle.domain.user.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;


public class RefreshTokenExpiredException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new RefreshTokenExpiredException();

    private RefreshTokenExpiredException() {
        super(ErrorCode.REFRESH_TOKEN_EXPIRED_TOKEN);
    }
}
