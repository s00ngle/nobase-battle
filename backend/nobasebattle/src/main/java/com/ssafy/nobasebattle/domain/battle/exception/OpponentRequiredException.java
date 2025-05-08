package com.ssafy.nobasebattle.domain.battle.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class OpponentRequiredException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new OpponentRequiredException();

    private OpponentRequiredException() { super(ErrorCode.OPPONENT_REQUIRED); };
}
