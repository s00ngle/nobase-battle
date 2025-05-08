package com.ssafy.nobasebattle.domain.battle.presentation.dto.response;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class BattleCharacterResponse {

    private String characterId;
    private String name;
    private String prompt;
    private String imageUrl;
    private CharacterRecordResponse record;

    public BattleCharacterResponse(TextCharacter character) {
        this.characterId = character.getId();
        this.name = character.getName();
        this.prompt = character.getPrompt();
        this.record = new CharacterRecordResponse(character);
    }

    public BattleCharacterResponse(ImageCharacter character) {
        this.characterId = character.getId();
        this.name = character.getName();
        this.imageUrl = character.getImageUrl();
        this.record = new CharacterRecordResponse(character);
    }

//    public static BattleCharacterResponse fromTextCharacter(TextCharacter textCharacter) {
//        int wins = textCharacter.getWins() != null ? textCharacter.getWins() : 0;
//        int losses = textCharacter.getLosses() != null ? textCharacter.getLosses() : 0;
//        int draws = textCharacter.getDraws() != null ? textCharacter.getDraws() : 0;
//        int totalBattles = wins + losses + draws;
//
//        CharacterRecordResponse record = CharacterRecordResponse.builder()
//                .eloScore(textCharacter.getEloScore())
//                .winRate(textCharacter.calculateWinRate())
//                .totalBattles(totalBattles)
//                .wins(wins)
//                .losses(losses)
//                .draws(draws)
//                .build();
//
//        return BattleCharacterResponse.builder()
//                .characterId(textCharacter.getId().toString())
//                .name(textCharacter.getName())
//                .prompt(textCharacter.getPrompt())
//                .record(record)
//                .build();
//    }
//
//    public static BattleCharacterResponse fromImageCharacter(ImageCharacter imageCharacter) {
//        int wins = imageCharacter.getWins() != null ? imageCharacter.getWins() : 0;
//        int losses = imageCharacter.getLosses() != null ? imageCharacter.getLosses() : 0;
//        int draws = imageCharacter.getDraws() != null ? imageCharacter.getDraws() : 0;
//        int totalBattles = wins + losses + draws;
//
//        CharacterRecordResponse record = CharacterRecordResponse.builder()
//                .eloScore(imageCharacter.getEloScore())
//                .winRate(imageCharacter.calculateWinRate())
//                .totalBattles(totalBattles)
//                .wins(wins)
//                .losses(losses)
//                .draws(draws)
//                .build();
//
//        return BattleCharacterResponse.builder()
//                .characterId(imageCharacter.getId().toString())
//                .name(imageCharacter.getName())
//                .imageUrl(imageCharacter.getImageUrl())
//                .record(record)
//                .build();
//    }
}
