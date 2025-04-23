package com.ssafy.nobasebattle.domain.imagecharacter.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class BadFileExtensionException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new BadFileExtensionException();

    private BadFileExtensionException() {
        super(ErrorCode.BAD_FILE_EXTENSION);
    }
}
