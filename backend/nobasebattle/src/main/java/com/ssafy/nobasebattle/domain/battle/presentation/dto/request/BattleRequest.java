package com.ssafy.nobasebattle.domain.battle.presentation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BattleRequest {

    private String characterId;
    private String mode = "RANDOM";  // 기본값: RANDOM
    private String opponentId;
}
