package com.ssafy.nobasebattle.global.exception;


import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class InvalidTokenException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new InvalidTokenException();

    private InvalidTokenException() {
        super(ErrorCode.INVALID_TOKEN);
    }
}
