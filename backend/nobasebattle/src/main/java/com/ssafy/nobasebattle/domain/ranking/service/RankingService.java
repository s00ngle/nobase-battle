package com.ssafy.nobasebattle.domain.ranking.service;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.imagecharacter.domain.repository.ImageCharacterRepository;
import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.repository.TextCharacterRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ZSetOperations.TypedTuple;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class RankingService {
    private final TextCharacterRepository textCharacterRepository;
    private final ImageCharacterRepository imageCharacterRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String TEXT_RANKING_KEY = "text_character_ranking";
    private static final String TEXT_RANKING_PREFIX = "text_character:";
    private static final String IMAGE_RANKING_KEY = "image_character_ranking";
    private static final String IMAGE_RANKING_PREFIX = "image_character:";
    private static final int rate = 1000 * 60 * 60 * 24;

    @EventListener(ApplicationReadyEvent.class)
    @Scheduled(fixedRate = rate)
    public void initializeRankingFromMongo() {
        List<TextCharacter> all = textCharacterRepository.findAll();
        if (all.isEmpty()) {
            log.info("No text characters found");
        }

        for (TextCharacter character : all) {
            if (character.getEloScore() != null) {
                log.info("all characters : {}", character.getName());
                String redisKey = TEXT_RANKING_PREFIX + character.getId();
                redisTemplate.opsForZSet().add(TEXT_RANKING_KEY, redisKey, character.getEloScore());
                redisTemplate.opsForValue().set(redisKey, character);
            }
        }

        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        String todayKey = TEXT_RANKING_KEY + ":" + LocalDate.now();

        List<TextCharacter> todayRank = textCharacterRepository.findByCreatedAtBetween(start, end);
        for (TextCharacter character : todayRank) {
            if (character.getEloScore() != null) {
                log.info("today characters : {}", character.getName());
                String redisKey = TEXT_RANKING_PREFIX + character.getId();
                redisTemplate.opsForZSet().add(todayKey, redisKey, character.getEloScore());
            }
        }

    }

    public List<TextCharacter> getTextTopCharacters(int count) {
        return getFromRedisZSet(TEXT_RANKING_KEY, "TEXT", count);
    }

    public List<TextCharacter> getTodayTextTopRankers(int count) {
        return getFromRedisZSet(TEXT_RANKING_KEY + ":" + LocalDate.now(), "TEXT", count);
    }

    public List<ImageCharacter> getImageTopCharacters(int count) {
        return getFromRedisZSet(IMAGE_RANKING_KEY, "IMAGE", count);
    }

    public List<ImageCharacter> getTodayImageTopRankers(int count) {
        return getFromRedisZSet(IMAGE_RANKING_KEY + ":" + LocalDate.now(), "IMAGE", count);
    }

    public Long getCharacterRank(String characterId) {
        return redisTemplate.opsForZSet().reverseRank(TEXT_RANKING_KEY, TEXT_RANKING_PREFIX + characterId);
    }

    private <T> List<T> getFromRedisZSet(String zsetKey, String type, int count) {
        Set<TypedTuple<Object>> top = redisTemplate.opsForZSet().reverseRangeWithScores(zsetKey, 0, count - 1);

        if (top == null || top.isEmpty()) return List.of();

        if (type.equals("TEXT")) {
            return (List<T>) top.stream()
                .map(tuple -> (TextCharacter) redisTemplate.opsForValue()
                    .get((String) tuple.getValue()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        } else if (type.equals("IMAGE")) {
            return (List<T>) top.stream()
                .map(tuple -> (ImageCharacter) redisTemplate.opsForValue()
                    .get((String) tuple.getValue()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        } else return List.of();
    }


}
