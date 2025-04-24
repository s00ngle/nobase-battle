package com.ssafy.nobasebattle.domain.imagecharacter.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class ImageCharacterNotFoundException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new ImageCharacterNotFoundException();

    private ImageCharacterNotFoundException() { super(ErrorCode.TEXT_CHARACTER_NOT_FOUND); }
}
