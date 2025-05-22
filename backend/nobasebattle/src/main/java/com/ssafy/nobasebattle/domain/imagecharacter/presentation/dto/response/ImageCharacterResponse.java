package com.ssafy.nobasebattle.domain.imagecharacter.presentation.dto.response;

import com.ssafy.nobasebattle.domain.badge.presentation.dto.BadgeInfo;
import com.ssafy.nobasebattle.domain.battle.presentation.dto.EventInfo;
import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

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
    private Integer winStreak;
    private Integer loseStreak;
    private LocalDateTime lastBattleTime;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private Long rank;
    private List<BadgeInfo> badges;

    public ImageCharacterResponse(ImageCharacter character, Long rank, List<BadgeInfo> badges) {
        this.imageCharacterId = character.getId();
        this.name = character.getName();
        this.imageUrl = character.getImageUrl();
        this.wins = character.getWins();
        this.losses = character.getLosses();
        this.draws =  character.getDraws();
        this.totalBattles = character.calculateTotalBattles();
        this.winRate = character.calculateWinRate();
        this.eloScore = character.getEloScore();
        this.winStreak = character.getWinStreak();
        this.loseStreak = character.getLoseStreak();
        this.lastBattleTime = character.getLastBattleTime();
        this.createAt = character.getCreatedAt();
        this.updateAt = character.getUpdatedAt();
        this.rank = rank;
        this.badges = badges;
    }

    public ImageCharacterResponse(ImageCharacter character, EventInfo eventinfo, Long rank, List<BadgeInfo> badges) {
        this.imageCharacterId = character.getId();
        this.name = character.getName();
        this.imageUrl = character.getImageUrl();
        this.wins = eventinfo.getWins();
        this.losses = eventinfo.getLosses();
        this.draws =  eventinfo.getDraws();
        this.totalBattles = eventinfo.calculateTotalBattles();
        this.winRate = eventinfo.calculateWinRate();
        this.eloScore = eventinfo.getEloScore();
        this.winStreak = eventinfo.getWinStreak();
        this.loseStreak = eventinfo.getLoseStreak();
        this.lastBattleTime = character.getLastBattleTime();
        this.createAt = character.getCreatedAt();
        this.updateAt = character.getUpdatedAt();
        this.rank = rank;
        this.badges = badges;
    }
}
