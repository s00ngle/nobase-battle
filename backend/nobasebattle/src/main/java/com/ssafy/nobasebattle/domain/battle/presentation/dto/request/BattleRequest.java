package com.ssafy.nobasebattle.domain.battle.presentation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BattleRequest {

    private String characterId;
    private String mode;  // 기본값: RANDOM
    private String opponentId;

    public void validate() {
        if (mode == null) {
            mode = "RANDOM";
        }
    }
}
