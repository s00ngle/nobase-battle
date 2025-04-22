package com.ssafy.nobasebattle.domain.ranking.service;

import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.repository.TextCharacterRepository;
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
import org.springframework.stereotype.Service;


@Slf4j
@Service
@RequiredArgsConstructor
public class RankingService {
    private final TextCharacterRepository textCharacterRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String RANKING_KEY = "text_character_ranking";
    private static final String PREFIX = "text_character:";

    @EventListener(ApplicationReadyEvent.class)
    public void initializeRankingFromMongo() {
        List<TextCharacter> all = textCharacterRepository.findAll();
        if (all.isEmpty()) {
            log.info("No text characters found");
        }

        for (TextCharacter character : all) {
            if (character.getEloScore() != null) {
                String redisKey = PREFIX + character.getId();
                redisTemplate.opsForZSet().add(RANKING_KEY, redisKey, character.getEloScore());
                redisTemplate.opsForValue().set(redisKey, character);
            }
        }
    }

    public List<TextCharacter> getTopCharacters(int count) {
        Set<TypedTuple<Object>> topRanked =
            redisTemplate.opsForZSet().reverseRangeWithScores(RANKING_KEY, 0, count - 1);
        
        if (topRanked == null) return List.of();

        return topRanked.stream()
            .map(tuple -> {
                String redisKey = (String) tuple.getValue();
                return (TextCharacter) redisTemplate.opsForValue().get(redisKey);
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    public Long getCharacterRank(String characterId) {
        return redisTemplate.opsForZSet().reverseRank(RANKING_KEY, PREFIX + characterId);
    }
}
