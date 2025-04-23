package com.ssafy.nobasebattle.domain.textcharacter.exception;


import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class NotTextCharacterHostException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new NotTextCharacterHostException();
    private NotTextCharacterHostException() {
        super(ErrorCode.TEXT_CHARACTER_NOT_HOST);
    }
}
