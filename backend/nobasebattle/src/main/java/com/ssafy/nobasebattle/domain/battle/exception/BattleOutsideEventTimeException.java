package com.ssafy.nobasebattle.domain.battle.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class BattleOutsideEventTimeException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new BattleOutsideEventTimeException();

    public BattleOutsideEventTimeException() { super(ErrorCode.BATTLE_OUTSIDE_EVENT_TIME); }
}