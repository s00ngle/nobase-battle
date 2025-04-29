package com.ssafy.nobasebattle.global.exception;


import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class ExpiredTokenException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new ExpiredTokenException();

    private ExpiredTokenException() {
        super(ErrorCode.EXPIRED_TOKEN);
    }
}
