package com.ssafy.nobasebattle.domain.battle.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class BattleCooldownException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new BattleCooldownException();

    public BattleCooldownException() { super(ErrorCode.BATTLE_COOLDOWN); }
}
