package com.ssafy.nobasebattle.domain.textcharacter.service;

import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.domain.repository.TextCharacterRepository;
import com.ssafy.nobasebattle.domain.textcharacter.exception.CharacterLimitExceededException;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.CreateTextCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.response.TextCharacterResponse;
import com.ssafy.nobasebattle.domain.user.domain.User;
import com.ssafy.nobasebattle.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class TextCharacterService {

    private final UserUtils userUtils;
    private final TextCharacterRepository textCharacterRepository;

    public TextCharacterResponse createTextCharacter(CreateTextCharacterRequest createTextCharacterRequest){

        User user = userUtils.getUserFromSecurityContext();
        long characterCount = textCharacterRepository.countByUserId(user.getId());

        if (characterCount >= 5) {
            throw CharacterLimitExceededException.EXCEPTION;
        }

        TextCharacter textCharacter = makeEssay(createTextCharacterRequest, user);
        textCharacterRepository.save(textCharacter);
        return getTextCharacterResponse(textCharacter);
    }

    private TextCharacter makeEssay(CreateTextCharacterRequest createTextCharacterRequest, User user){

        return TextCharacter.builder()
                .userId(user.getId())
                .name(createTextCharacterRequest.getName())
                .prompt(createTextCharacterRequest.getPrompt())
                .wins(0)
                .losses(0)
                .draws(0)
                .eloScore(0)
                .build();
    }

    private TextCharacterResponse getTextCharacterResponse(TextCharacter textCharacter) {
        return new TextCharacterResponse(textCharacter);
    }

}
