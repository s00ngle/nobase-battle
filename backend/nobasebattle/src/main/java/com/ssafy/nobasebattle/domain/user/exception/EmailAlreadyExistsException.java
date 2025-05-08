package com.ssafy.nobasebattle.domain.user.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class EmailAlreadyExistsException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new EmailAlreadyExistsException();

    private EmailAlreadyExistsException() {
        super(ErrorCode.DUPLICATE_EMAIL);
    }
}
