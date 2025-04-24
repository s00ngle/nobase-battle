package com.ssafy.nobasebattle.domain.imagecharacter.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class FileOversizeException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new FileOversizeException();

    private FileOversizeException() { super(ErrorCode.FILE_OVER_SIZE); }
}
