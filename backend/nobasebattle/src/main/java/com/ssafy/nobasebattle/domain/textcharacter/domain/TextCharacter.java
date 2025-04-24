package com.ssafy.nobasebattle.domain.textcharacter.domain;

import com.ssafy.nobasebattle.domain.textcharacter.exception.NotTextCharacterHostException;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.UpdateTextCharacterRequest;
import com.ssafy.nobasebattle.global.common.BaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

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
//    private String colorRank;

    @Builder
    public TextCharacter(String userId, String name, String prompt, Integer wins, Integer losses, Integer draws, Integer eloScore, LocalDateTime lastBattleTime) {
        this.userId = userId;
        this.name = name;
        this.prompt = prompt;
        this.wins = wins;
        this.losses = losses;
        this.draws = draws;
        this.eloScore = eloScore;
        this.lastBattleTime = lastBattleTime;
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
}
