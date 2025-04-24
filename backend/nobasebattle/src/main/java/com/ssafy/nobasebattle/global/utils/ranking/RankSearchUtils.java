package com.ssafy.nobasebattle.global.utils.ranking;

public interface RankSearchUtils {
    Long getTextCharacterRank(String characterId);
    Long getTodayTextCharacterRank(String characterId);
    Long getImageCharacterRank(String characterId);
    Long getTodayImageCharacterRank(String characterId);
}
