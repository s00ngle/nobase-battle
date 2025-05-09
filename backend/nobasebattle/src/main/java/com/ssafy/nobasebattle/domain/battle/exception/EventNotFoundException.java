package com.ssafy.nobasebattle.domain.battle.exception;

import com.ssafy.nobasebattle.global.error.exception.ErrorCode;
import com.ssafy.nobasebattle.global.error.exception.NoBaseBattleException;

public class EventNotFoundException extends NoBaseBattleException {

    public static final NoBaseBattleException EXCEPTION = new EventNotFoundException();

    public EventNotFoundException() { super(ErrorCode.EVENT_NOT_FOUND); }
}

