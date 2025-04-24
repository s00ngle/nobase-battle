package com.ssafy.nobasebattle.domain.imagecharacter.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class NotImageChracterHostException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new NotImageChracterHostException();

    private NotImageChracterHostException() { super(ErrorCode.TEXT_CHARACTER_NOT_HOST); }
}
