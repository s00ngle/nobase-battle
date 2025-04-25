package com.ssafy.nobasebattle.domain.imagecharacter.domain;

import com.ssafy.nobasebattle.domain.imagecharacter.presentation.dto.request.UpdateImageCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.exception.NotTextCharacterHostException;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.response.BadgeResponse;
import com.ssafy.nobasebattle.global.common.BaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "image_characters")
@Getter
@NoArgsConstructor
public class ImageCharacter extends BaseEntity {

    private String userId;
    private String name;
    private String imageUrl;
    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Integer eloScore;
    private LocalDateTime lastBattleTime;
    private List<BadgeResponse> badges;

    @Builder
    public ImageCharacter(String userId, String name, String imageUrl, Integer wins, Integer losses, Integer draws, Integer eloScore, LocalDateTime lastBattleTime, List<BadgeResponse> badges) {
        this.userId = userId;
        this.name = name;
        this.imageUrl = imageUrl;
        this.wins = wins;
        this.losses = losses;
        this.draws = draws;
        this.eloScore = eloScore;
        this.lastBattleTime = lastBattleTime;
        this.badges = badges;
    }

    public void validUserIsHost(String id) {
        if (!checkUserIsHost(id)) {
            throw NotTextCharacterHostException.EXCEPTION;
        }
    }

    public Boolean checkUserIsHost(String id) {
        return userId.equals(id);
    }

    public void updateWins(Integer wins) {
        this.wins = wins;
    }

    public void updateLosses(Integer losses) {
        this.losses = losses;
    }

    public void updateDraws(Integer draws) {
        this.draws = draws;
    }

    public void updateEloScore(Integer eloScore) {
        this.eloScore = eloScore;
    }

    public void updateLastBattleTime() {
        this.lastBattleTime = LocalDateTime.now();
    }

    public void updateName(UpdateImageCharacterRequest updateImageCharacterRequest) {
        this.name = updateImageCharacterRequest.getName();
    }

    public void updateImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double calculateWinRate() {
        int w = wins != null ? wins : 0;
        int l = losses != null ? losses : 0;
        int d = draws != null ? draws : 0;
        int totalGames = w + l + d;
        if (totalGames == 0) {
            return 0.0;
        }
        double winRate = (double) w / totalGames * 100.0;
        return (int) Math.floor(winRate);
    }

    public Integer calculateTotalBattles() {
        return wins + losses + draws;
    }
}
