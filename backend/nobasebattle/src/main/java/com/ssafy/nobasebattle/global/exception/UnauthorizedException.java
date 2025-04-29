package com.ssafy.nobasebattle.global.exception;


import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class UnauthorizedException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new UnauthorizedException();

    private UnauthorizedException() {
        super(ErrorCode.NECESSARY_LOGIN);
    }
}
