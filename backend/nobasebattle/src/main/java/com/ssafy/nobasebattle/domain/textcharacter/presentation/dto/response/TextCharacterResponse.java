package com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.response;

import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class TextCharacterResponse {

    private String TextCharacterId;
    private String name;
    private String prompt;
    private Integer totalBattles;
    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Integer eloScore;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private LocalDateTime lastBattleTime;
    private Double winRate;
    private Long rank;
    private List<BadgeResponse> badges;

    public TextCharacterResponse(TextCharacter character, Long rank) {
        this.TextCharacterId = character.getId();
        this.name = character.getName();
        this.prompt = character.getPrompt();
        this.totalBattles = character.calculateTotalBattle();
        this.wins = character.getWins();
        this.losses = character.getLosses();
        this.draws =  character.getDraws();
        this.eloScore = character.getEloScore();
        this.createAt = character.getCreatedAt();
        this.updateAt = character.getUpdatedAt();
        this.winRate = character.calculateWinRate();
        this.lastBattleTime = character.getLastBattleTime();
        this.rank = rank;
        this.badges = character.getBadges();
    }
}

