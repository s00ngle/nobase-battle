package com.ssafy.nobasebattle.domain.battle.presentation.dto.response;

import com.ssafy.nobasebattle.domain.battle.domain.Battle;
import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class BattleResponse {

    private String battleId;
    private BattleCharacterResponse firstCharacter;
    private BattleCharacterResponse secondCharacter;
    private Integer result;  // 1: first 승리, -1: second 승리, 0: 무승부
    private String battleLog;
    private LocalDateTime createdAt;

    public BattleResponse(Battle battle, ImageCharacter firstCharacter, ImageCharacter secondCharacter) {
        this.battleId = battle.getId();
        this.firstCharacter = new BattleCharacterResponse(firstCharacter);
        this.secondCharacter = new BattleCharacterResponse(secondCharacter);
        this.result = battle.getResult();
        this.battleLog = battle.getBattleLog();
        this.createdAt = battle.getCreatedAt();
    }

    public BattleResponse(Battle battle, TextCharacter firstCharacter, TextCharacter secondCharacter) {
        this.battleId = battle.getId();
        this.firstCharacter = new BattleCharacterResponse(firstCharacter);
        this.secondCharacter = new BattleCharacterResponse(secondCharacter);
        this.result = battle.getResult();
        this.battleLog = battle.getBattleLog();
        this.createdAt = battle.getCreatedAt();
    }
}
