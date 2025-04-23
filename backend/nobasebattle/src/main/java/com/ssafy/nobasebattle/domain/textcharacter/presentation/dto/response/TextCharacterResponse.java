package com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.response;

import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class TextCharacterResponse {

    private String TextCharacterId;
    private String name;
    private String prompt;
    private Integer wins;
    private Integer losses;
    private Integer draws;
    private Integer eloScore;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    // private HostInfoDto hostInfo;
    // private Boolean isOwner;


    public TextCharacterResponse(TextCharacter character) {
        this.TextCharacterId = character.getId();
        this.name = character.getName();
        this.prompt = character.getPrompt();
        this.wins = character.getWins();
        this.losses = character.getLosses();
        this.draws =  character.getDraws();
        this.eloScore = character.getEloScore();
        this.createAt = character.getCreatedAt();
        this.updateAt = character.getUpdatedAt();
    }
}

