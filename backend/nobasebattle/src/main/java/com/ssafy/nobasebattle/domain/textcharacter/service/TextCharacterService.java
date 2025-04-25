package com.ssafy.nobasebattle.domain.textcharacter.service;

import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.repository.TextCharacterRepository;
import com.ssafy.nobasebattle.domain.textcharacter.exception.CharacterLimitExceededException;
import com.ssafy.nobasebattle.domain.textcharacter.exception.TextCharacterNotFoundException;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.CreateTextCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.UpdateTextCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.response.TextCharacterResponse;
import com.ssafy.nobasebattle.global.utils.ranking.RankSearchUtils;
import com.ssafy.nobasebattle.global.utils.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class TextCharacterService implements TextCharacterServiceUtils {

    private final TextCharacterRepository textCharacterRepository;
    private final RankSearchUtils rankSearchUtils;

    public TextCharacterResponse createTextCharacter(CreateTextCharacterRequest createTextCharacterRequest){

        String userId = SecurityUtils.getCurrentUserId();
        long characterCount = textCharacterRepository.countByUserId(userId);

        if (characterCount >= 5) {
            throw CharacterLimitExceededException.EXCEPTION;
        }

        TextCharacter textCharacter = makeTextCharacter(createTextCharacterRequest, userId);
        textCharacterRepository.save(textCharacter);
        insertRanking(textCharacter);
        Long ranking = getRanking(textCharacter);
        return getTextCharacterResponse(textCharacter,ranking);
    }

    public void deleteTextCharacter(String textCharacterId){

        String userId = SecurityUtils.getCurrentUserId();
        TextCharacter textCharacter = queryTextCharacter(textCharacterId);
        textCharacter.validUserIsHost(userId);
        textCharacterRepository.delete(textCharacter);
    }

    public TextCharacterResponse updateEssay(String textCharacterId, UpdateTextCharacterRequest updateTextCharacterRequest) {

        String currentUserId = SecurityUtils.getCurrentUserId();
        TextCharacter textCharacter = queryTextCharacter(textCharacterId);
        textCharacter.validUserIsHost(currentUserId);
        textCharacter.updateCharacter(updateTextCharacterRequest);
        textCharacterRepository.save(textCharacter);
        Long ranking = getRanking(textCharacter);
        return getTextCharacterResponse(textCharacter,ranking);
    }

    public TextCharacterResponse getTextCharacterDetail(String textCharacterId) {

        String currentUserId = SecurityUtils.getCurrentUserId();
        TextCharacter textCharacter = queryTextCharacter(textCharacterId);
        textCharacter.validUserIsHost(currentUserId);
        Long ranking = getRanking(textCharacter);
        return getTextCharacterResponse(textCharacter,ranking);
    }

    public List<TextCharacterResponse> findAllUsersTextCharacter() {
        String currentUserId = SecurityUtils.getCurrentUserId();
        List<TextCharacter> characters = textCharacterRepository.findByUserId(currentUserId);
        return characters.stream()
                .map(character -> new TextCharacterResponse(character, getRanking(character)))
                .collect(Collectors.toList());
    }

    public TextCharacter queryTextCharacter(String id) {
        return textCharacterRepository
                .findById(id)
                .orElseThrow(()-> TextCharacterNotFoundException.EXCEPTION);
    }

    private TextCharacter makeTextCharacter(CreateTextCharacterRequest createTextCharacterRequest, String userId){

        return TextCharacter.builder()
                .userId(userId)
                .name(createTextCharacterRequest.getName())
                .prompt(createTextCharacterRequest.getPrompt())
                .wins(0)
                .losses(0)
                .draws(0)
                .eloScore(1000)
                .badges(new ArrayList<>())
                .lastBattleTime(LocalDateTime.now().minusMinutes(2))
                .build();
    }

    private TextCharacterResponse getTextCharacterResponse(TextCharacter textCharacter, Long ranking) {
        return new TextCharacterResponse(textCharacter, ranking);
    }

    private void insertRanking(TextCharacter textCharacter) {
        rankSearchUtils.addTextCharacterToRank(textCharacter);
    }

    private Long getRanking(TextCharacter textCharacter) {

        LocalDate today = LocalDate.now();
        LocalDate createdDate = textCharacter.getCreatedAt().toLocalDate();

        if (today.equals(createdDate)) {
             return rankSearchUtils.getTodayTextCharacterRank(textCharacter.getId());
        }
        return rankSearchUtils.getTextCharacterRank(textCharacter.getId());
    }

}
