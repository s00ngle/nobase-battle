package com.ssafy.nobasebattle.global.utils.ranking;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import java.util.Optional;

public interface RankSearchUtils {
    Long getTextCharacterRank(String characterId);
    Long getTodayTextCharacterRank(String characterId);
    Long getImageCharacterRank(String characterId);
    Long getTodayImageCharacterRank(String characterId);

    void addTextCharacterToRank(TextCharacter character);
    void addImageCharacterToRank(ImageCharacter character);

    void deleteTextCharacterFromRank(TextCharacter character);
    void deleteImageCharacterFromRank(ImageCharacter character);

    Optional<TextCharacter> matchTextCharacter(String characterId);
    Optional<ImageCharacter> matchImageCharacter(String characterId);
}
