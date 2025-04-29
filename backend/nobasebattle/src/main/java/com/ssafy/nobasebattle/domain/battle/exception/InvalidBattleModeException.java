package com.ssafy.nobasebattle.domain.battle.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class InvalidBattleModeException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new InvalidBattleModeException();

    public InvalidBattleModeException() { super(ErrorCode.INVALID_BATTLE_MODE); }
}