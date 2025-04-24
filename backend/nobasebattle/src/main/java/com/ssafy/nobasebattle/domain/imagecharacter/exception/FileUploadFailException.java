package com.ssafy.nobasebattle.domain.imagecharacter.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class FileUploadFailException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new FileUploadFailException();

    private FileUploadFailException() { super(ErrorCode.FILE_UPLOAD_FAIL); }
}
