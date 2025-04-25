package com.ssafy.nobasebattle.global.utils.ranking;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import java.time.LocalDate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RankSearchUtilsImpl implements RankSearchUtils {

    private final RedisTemplate<String, Object> redisTemplate;

    private static final String TEXT_RANKING_KEY = "text_character_ranking";
    private static final String TEXT_RANKING_PREFIX = "text_character:";
    private static final String IMAGE_RANKING_KEY = "image_character_ranking";
    private static final String IMAGE_RANKING_PREFIX = "image_character:";

    @Override
    public Long getTextCharacterRank(String characterId) {
        return redisTemplate.opsForZSet().reverseRank(TEXT_RANKING_KEY, TEXT_RANKING_PREFIX + characterId);
    }

    @Override
    public Long getTodayTextCharacterRank(String characterId) {
        return redisTemplate.opsForZSet().reverseRank(TEXT_RANKING_KEY + ":" + LocalDate.now(), TEXT_RANKING_PREFIX + characterId);
    }

    @Override
    public Long getImageCharacterRank(String characterId) {
        return redisTemplate.opsForZSet().reverseRank(IMAGE_RANKING_KEY, IMAGE_RANKING_PREFIX + characterId);
    }

    @Override
    public Long getTodayImageCharacterRank(String characterId) {
        return redisTemplate.opsForZSet().reverseRank(IMAGE_RANKING_KEY + ":" + LocalDate.now(), IMAGE_RANKING_PREFIX + characterId);
    }

    @Override
    public void addTextCharacterToRank(TextCharacter character) {
        String redisKey = TEXT_RANKING_PREFIX + character.getId();
        String todayTextKey = TEXT_RANKING_KEY + ":" + LocalDate.now();

        redisTemplate.opsForZSet().add(TEXT_RANKING_KEY, redisKey, character.getEloScore());
        redisTemplate.opsForValue().set(redisKey, character);
        redisTemplate.opsForZSet().add(todayTextKey, redisKey, character.getEloScore());
    }

    @Override
    public void addImageCharacterToRank(ImageCharacter character) {
        String redisKey = IMAGE_RANKING_PREFIX + character.getId();
        String todayImageKey = IMAGE_RANKING_KEY + ":" + LocalDate.now();

        redisTemplate.opsForZSet().add(IMAGE_RANKING_KEY, redisKey, character.getEloScore());
        redisTemplate.opsForValue().set(redisKey, character);
        redisTemplate.opsForZSet().add(todayImageKey, redisKey, character.getEloScore());
    }

    @Override
    public void deleteTextCharacterFromRank(TextCharacter character) {
        String redisKey = TEXT_RANKING_PREFIX + character.getId();
        String todayTextKey = TEXT_RANKING_KEY + ":" + LocalDate.now();

        redisTemplate.opsForZSet().remove(TEXT_RANKING_KEY, redisKey);
        redisTemplate.delete(redisKey);
        redisTemplate.opsForZSet().remove(todayTextKey, redisKey);
    }

    @Overrided
    public void deleteImageCharacterFromRank(ImageCharacter character) {
        String redisKey = IMAGE_RANKING_PREFIX + character.getId();
        String todayImageKey = IMAGE_RANKING_KEY + ":" + LocalDate.now();

        redisTemplate.opsForZSet().remove(IMAGE_RANKING_KEY, redisKey);
        redisTemplate.delete(redisKey);
        redisTemplate.opsForZSet().remove(todayImageKey, redisKey);
    }
}
