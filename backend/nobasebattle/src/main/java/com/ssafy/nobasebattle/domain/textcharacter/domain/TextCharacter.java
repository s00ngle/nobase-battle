package com.ssafy.nobasebattle.domain.textcharacter.domain;

import com.ssafy.nobasebattle.domain.textcharacter.exception.NotTextCharacterHostException;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.UpdateTextCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.response.BadgeResponse;
import com.ssafy.nobasebattle.global.common.BaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "text_characters")
@NoArgsConstructor
@Getter
public class TextCharacter extends BaseEntity {

    private String userId;
    private String name;
    private String prompt;
    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Integer eloScore;
    private LocalDateTime lastBattleTime;
    private List<BadgeResponse> badges;

    @Builder
    public TextCharacter(String userId, String name, String prompt, Integer wins, Integer losses, Integer draws, Integer eloScore, LocalDateTime lastBattleTime, List<BadgeResponse> badges) {
        this.userId = userId;
        this.name = name;
        this.prompt = prompt;
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

    public void updateCharacter(UpdateTextCharacterRequest updateTextCharacterRequest) {
        this.name = updateTextCharacterRequest.getName();
        this.prompt = updateTextCharacterRequest.getPrompt();
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

    public Integer calculateTotalBattle() {
        return wins + losses + draws;
    }

    public void updateLastBattleTime() {
        this.lastBattleTime = LocalDateTime.now();
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

    public void insertBadge(BadgeResponse badge) {
       badges.add(badge);
    }
}
