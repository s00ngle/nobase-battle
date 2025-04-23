package com.ssafy.nobasebattle.domain.imagecharacter.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class FileEmptyException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new FileEmptyException();

    private FileEmptyException() {
        super(ErrorCode.FILE_EMPTY);
    }
}