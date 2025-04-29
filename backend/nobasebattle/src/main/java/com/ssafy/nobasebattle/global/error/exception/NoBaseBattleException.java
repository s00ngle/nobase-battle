package com.ssafy.nobasebattle.global.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class NoBaseBattleException extends RuntimeException{

    private ErrorCode errorCode;
}
