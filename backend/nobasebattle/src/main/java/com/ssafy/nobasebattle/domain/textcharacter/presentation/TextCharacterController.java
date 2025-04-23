package com.ssafy.nobasebattle.domain.textcharacter.presentation;

import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.CreateTextCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.response.TextCharacterResponse;
import com.ssafy.nobasebattle.domain.textcharacter.service.TextCharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1/characters/text")
@RequiredArgsConstructor
@RestController
public class TextCharacterController {

    private final TextCharacterService textCharacterService;

    @PostMapping
    public TextCharacterResponse createEssay(@RequestBody CreateTextCharacterRequest characterRequest) {
        return textCharacterService.createTextCharacter(characterRequest);
    }


}
