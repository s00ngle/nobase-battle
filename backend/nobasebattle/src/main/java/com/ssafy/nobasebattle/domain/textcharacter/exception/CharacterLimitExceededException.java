package com.ssafy.nobasebattle.domain.textcharacter.exception;


import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class CharacterLimitExceededException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new CharacterLimitExceededException();

    private CharacterLimitExceededException() {
        super(ErrorCode.CHARACTER_LIMIT);
    }
}
