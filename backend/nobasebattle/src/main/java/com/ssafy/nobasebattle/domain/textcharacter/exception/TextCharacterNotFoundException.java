package com.ssafy.nobasebattle.domain.textcharacter.exception;


import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class TextCharacterNotFoundException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new TextCharacterNotFoundException();
    private TextCharacterNotFoundException() {
        super(ErrorCode.TEXT_CHARACTER_NOT_FOUND);
    }
}
