package com.ssafy.nobasebattle.domain.battle.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class BattleAgainstSelfException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new BattleAgainstSelfException();

    public BattleAgainstSelfException() { super(ErrorCode.BATTLE_AGAINST_SELF); }
}
