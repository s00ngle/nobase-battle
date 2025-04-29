package com.ssafy.nobasebattle.domain.battle.presentation.dto.response;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CharacterRecordResponse {

    private Integer eloScore;
    private Double winRate;
    private Integer totalBattles;
    private Integer wins;
    private Integer losses;
    private Integer draws;

    public CharacterRecordResponse(ImageCharacter character) {
        this.eloScore = character.getEloScore();
        this.winRate = character.calculateWinRate();
        this.totalBattles = character.calculateTotalBattles();
        this.wins = character.getWins();
        this.losses = character.getLosses();
        this.draws = character.getDraws();
    }

    public CharacterRecordResponse(TextCharacter character) {
        this.eloScore = character.getEloScore();
        this.winRate = character.calculateWinRate();
        this.totalBattles = character.calculateTotalBattle();
        this.wins = character.getWins();
        this.losses = character.getLosses();
        this.draws = character.getDraws();
    }
}
