package com.ssafy.nobasebattle.domain.imagecharacter.presentation.dto.response;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ImageCharacterResponse {

    private String imageCharacterId;
    private String name;
    private String imageUrl;
    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Integer totalBattles;
    private Double winRate;
    private Integer eloScore;
    private LocalDateTime lastBattleTime;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    // private HostInfoDto hostInfo;
    // private Boolean isOwner;

    public ImageCharacterResponse(ImageCharacter character) {
        this.imageCharacterId = character.getId();
        this.name = character.getName();
        this.imageUrl = character.getImageUrl();
        this.wins = character.getWins();
        this.losses = character.getLosses();
        this.draws =  character.getDraws();
        this.totalBattles = character.calculateTotalBattles();
        this.winRate = character.calculateWinRate();
        this.eloScore = character.getEloScore();
        this.lastBattleTime = character.getLastBattleTime();
        this.createAt = character.getCreatedAt();
        this.updateAt = character.getUpdatedAt();
    }
}
