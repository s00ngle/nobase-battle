package com.ssafy.nobasebattle.global.utils.ranking;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
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
        Long rank = redisTemplate.opsForZSet().reverseRank(TEXT_RANKING_KEY, TEXT_RANKING_PREFIX + characterId);
        return rank == null ? null : rank + 1;
    }

    @Override
    public Long getTodayTextCharacterRank(String characterId) {
        Long rank = redisTemplate.opsForZSet().reverseRank(
            TEXT_RANKING_KEY + ":" + LocalDate.now(), TEXT_RANKING_PREFIX + characterId);
        return rank == null ? null : rank + 1;
    }

    @Override
    public Long getImageCharacterRank(String characterId) {
        Long rank = redisTemplate.opsForZSet().reverseRank(IMAGE_RANKING_KEY, IMAGE_RANKING_PREFIX + characterId);
        return rank == null ? null : rank + 1;
    }

    @Override
    public Long getTodayImageCharacterRank(String characterId) {
        Long rank = redisTemplate.opsForZSet().reverseRank(
            IMAGE_RANKING_KEY + ":" + LocalDate.now(), IMAGE_RANKING_PREFIX + characterId);
        return rank == null ? null : rank + 1;
    }


    @Override
    public void addTextCharacterToRank(TextCharacter character) {
        String redisKey = TEXT_RANKING_PREFIX + character.getId();
        String todayTextKey = TEXT_RANKING_KEY + ":" + LocalDate.now();

        redisTemplate.opsForZSet().add(TEXT_RANKING_KEY, redisKey, character.getEloScore());
        redisTemplate.opsForValue().set(redisKey, character);
        if (LocalDate.now().equals(character.getCreatedAt().toLocalDate())) {
            redisTemplate.opsForZSet().add(todayTextKey, redisKey, character.getEloScore());
        }
    }

    @Override
    public void addImageCharacterToRank(ImageCharacter character) {
        String redisKey = IMAGE_RANKING_PREFIX + character.getId();
        String todayImageKey = IMAGE_RANKING_KEY + ":" + LocalDate.now();

        redisTemplate.opsForZSet().add(IMAGE_RANKING_KEY, redisKey, character.getEloScore());
        redisTemplate.opsForValue().set(redisKey, character);
        if (LocalDate.now().equals(character.getCreatedAt().toLocalDate())) {
            redisTemplate.opsForZSet().add(todayImageKey, redisKey, character.getEloScore());
        }
    }

    @Override
    public void deleteTextCharacterFromRank(TextCharacter character) {
        String redisKey = TEXT_RANKING_PREFIX + character.getId();
        String todayTextKey = TEXT_RANKING_KEY + ":" + LocalDate.now();

        redisTemplate.opsForZSet().remove(TEXT_RANKING_KEY, redisKey);
        redisTemplate.delete(redisKey);
        redisTemplate.opsForZSet().remove(todayTextKey, redisKey);
    }

    @Override
    public void deleteImageCharacterFromRank(ImageCharacter character) {
        String redisKey = IMAGE_RANKING_PREFIX + character.getId();
        String todayImageKey = IMAGE_RANKING_KEY + ":" + LocalDate.now();

        redisTemplate.opsForZSet().remove(IMAGE_RANKING_KEY, redisKey);
        redisTemplate.delete(redisKey);
        redisTemplate.opsForZSet().remove(todayImageKey, redisKey);
    }

    @Override
    public Optional<TextCharacter> matchTextCharacter(String characterId) {
        String redisKey = TEXT_RANKING_PREFIX + characterId;
        Long rank = redisTemplate.opsForZSet().reverseRank(TEXT_RANKING_KEY, redisKey);
        long start = Math.max(rank - 15, 0);
        long end = rank + 15;

        Set<Object> candidateKeys = redisTemplate.opsForZSet().reverseRange(TEXT_RANKING_KEY, start, end);
        if (candidateKeys == null || candidateKeys.size() <= 1) return Optional.empty();

        List<Object> filteredKeys = candidateKeys.stream()
            .filter(key -> !key.equals(redisKey))
            .toList();

        if (filteredKeys.isEmpty()) return Optional.empty();
        String selectedKey = (String) filteredKeys.get(new Random().nextInt(filteredKeys.size()));
        TextCharacter selected = (TextCharacter) redisTemplate.opsForValue().get(selectedKey);

        return Optional.ofNullable(selected);
    }

    @Override
    public Optional<ImageCharacter> matchImageCharacter(String characterId) {
        String redisKey = IMAGE_RANKING_PREFIX + characterId;
        Long rank = redisTemplate.opsForZSet().reverseRank(IMAGE_RANKING_KEY, redisKey);
        long start = Math.max(rank - 15, 0);
        long end = rank + 15;

        Set<Object> candidateKeys = redisTemplate.opsForZSet().reverseRange(IMAGE_RANKING_KEY, start, end);
        if (candidateKeys == null || candidateKeys.size() <= 1) return Optional.empty();

        List<Object> filteredKeys = candidateKeys.stream()
            .filter(key -> !key.equals(redisKey))
            .toList();

        if (filteredKeys.isEmpty()) return Optional.empty();
        String selectedKey = (String) filteredKeys.get(new Random().nextInt(filteredKeys.size()));
        ImageCharacter selected = (ImageCharacter) redisTemplate.opsForValue().get(selectedKey);

        return Optional.ofNullable(selected);    }
}
