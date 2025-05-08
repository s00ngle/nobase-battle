package com.ssafy.nobasebattle.domain.user.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class UsernameAlreadyExistsException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new UsernameAlreadyExistsException();

    private UsernameAlreadyExistsException() {
        super(ErrorCode.DUPLICATE_USERNAME);
    }
}
