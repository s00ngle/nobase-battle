package com.ssafy.nobasebattle.domain.ranking.service;

import com.ssafy.nobasebattle.domain.imagecharacter.domain.ImageCharacter;
import com.ssafy.nobasebattle.domain.imagecharacter.domain.repository.ImageCharacterRepository;
import com.ssafy.nobasebattle.domain.ranking.presentation.response.RankingCharacterResponse;
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

    @EventListener(ApplicationReadyEvent.class)
    @Scheduled(cron = "0 0 0 * * *")
    public void initializeRankingFromMongo() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = start.plusDays(1);
        String todayTextKey = TEXT_RANKING_KEY + ":" + LocalDate.now();
        String todayImageKey = IMAGE_RANKING_KEY + ":" + LocalDate.now();

        List<TextCharacter> allText = textCharacterRepository.findAll();
        if (allText.isEmpty()) {
            log.info("No text characters found");
        }
        List<TextCharacter> todayTextRank = textCharacterRepository.findByCreatedAtBetween(start, end);
        if (todayTextRank.isEmpty()) {
            log.info("No Today text characters found");
        }
        List<ImageCharacter> allImage = imageCharacterRepository.findAll();
        if (allImage.isEmpty()) {
            log.info("No Image characters found");
        }
        List<ImageCharacter> todayImageRank = imageCharacterRepository.findByCreatedAtBetween(start, end);
        if (todayImageRank.isEmpty()) {
            log.info("No Today text characters found");
        }

        for (TextCharacter character : allText) {
            if (character.getEloScore() != null) {
                String redisKey = TEXT_RANKING_PREFIX + character.getId();
                redisTemplate.opsForZSet().add(TEXT_RANKING_KEY, redisKey, character.getEloScore());
                redisTemplate.opsForValue().set(redisKey, character);
            }
        }

        for (ImageCharacter character : allImage) {
            if (character.getEloScore() != null) {
                String redisKey = IMAGE_RANKING_PREFIX + character.getId();
                redisTemplate.opsForZSet().add(IMAGE_RANKING_KEY, redisKey, character.getEloScore());
                redisTemplate.opsForValue().set(redisKey, character);
            }
        }

        for (TextCharacter character : todayTextRank) {
            if (character.getEloScore() != null) {
                String redisKey = TEXT_RANKING_PREFIX + character.getId();
                redisTemplate.opsForZSet().add(todayTextKey, redisKey, character.getEloScore());
            }
        }

        for (ImageCharacter character : todayImageRank) {
            if (character.getEloScore() != null) {
                String redisKey = IMAGE_RANKING_PREFIX + character.getId();
                redisTemplate.opsForZSet().add(todayImageKey, redisKey, character.getEloScore());
            }
        }

    }

    public List<RankingCharacterResponse> getTextTopCharacters(int count) {
        return getFromRedisZSet(TEXT_RANKING_KEY, "TEXT", count);
    }

    public List<RankingCharacterResponse> getTodayTextTopRankers(int count) {
        return getFromRedisZSet(TEXT_RANKING_KEY + ":" + LocalDate.now(), "TEXT", count);
    }

    public List<RankingCharacterResponse> getImageTopCharacters(int count) {
        return getFromRedisZSet(IMAGE_RANKING_KEY, "IMAGE", count);
    }

    public List<RankingCharacterResponse> getTodayImageTopRankers(int count) {
        return getFromRedisZSet(IMAGE_RANKING_KEY + ":" + LocalDate.now(), "IMAGE", count);
    }

    private List<RankingCharacterResponse> getFromRedisZSet(String zsetKey, String type, int count) {
        Set<TypedTuple<Object>> top = redisTemplate.opsForZSet().reverseRangeWithScores(zsetKey, 0, count - 1);

        if (top == null || top.isEmpty()) return List.of();

        return top.stream()
            .map(tuple -> {
                String key = (String) tuple.getValue();
                Object obj = redisTemplate.opsForValue().get(key);

                if ("TEXT".equals(type) && obj instanceof TextCharacter text) {
                    return RankingCharacterResponse.builder()
                        .characterId(text.getId())
                        .name(text.getName())
                        .prompt(text.getPrompt())
                        .wins(text.getWins())
                        .losses(text.getLosses())
                        .draws(text.getDraws())
                        .eloScore(text.getEloScore())
                        .createdAt(text.getCreatedAt())
                        .updatedAt(text.getUpdatedAt())
                        .build();

                } else if ("IMAGE".equals(type) && obj instanceof ImageCharacter image) {
                    return RankingCharacterResponse.builder()
                        .characterId(image.getId())
                        .name(image.getName())
                        .imageUrl(image.getImageUrl())
                        .wins(image.getWins())
                        .losses(image.getLosses())
                        .draws(image.getDraws())
                        .eloScore(image.getEloScore())
                        .createdAt(image.getCreatedAt())
                        .updatedAt(image.getUpdatedAt())
                        .build();
                } else {
                    return null;
                }
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

}
