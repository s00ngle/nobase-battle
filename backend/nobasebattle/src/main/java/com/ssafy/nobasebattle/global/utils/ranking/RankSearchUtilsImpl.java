package com.ssafy.nobasebattle.global.utils.ranking;

import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RankSearchUtilsImpl implements RankSearchUtils{

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String TEXT_RANKING_KEY = "text_character_ranking";
    private static final String TEXT_RANKING_PREFIX = "text_character:";
    private static final String IMAGE_RANKING_KEY = "image_character_ranking";
    private static final String IMAGE_RANKING_PREFIX = "image_character:";

    public Long getTextCharacterRank(String characterId) {
        return redisTemplate.opsForZSet().reverseRank(TEXT_RANKING_KEY, TEXT_RANKING_PREFIX + characterId);
    }

    public Long getTodayTextCharacterRank(String characterId) {
        return redisTemplate.opsForZSet().reverseRank(TEXT_RANKING_KEY + ":" + LocalDate.now(), TEXT_RANKING_PREFIX + characterId);
    }

    public Long getImageCharacterRank(String characterId) {
        return redisTemplate.opsForZSet().reverseRank(IMAGE_RANKING_KEY, IMAGE_RANKING_PREFIX + characterId);
    }

    public Long getTodayImageCharacterRank(String characterId) {
        return redisTemplate.opsForZSet().reverseRank(IMAGE_RANKING_KEY + ":" + LocalDate.now(), IMAGE_RANKING_PREFIX + characterId);
    }
}
