package com.ssafy.nobasebattle.domain.textcharacter.presentation;

import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.CreateTextCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.UpdateTextCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.response.TextCharacterResponse;
import com.ssafy.nobasebattle.domain.textcharacter.service.TextCharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/v1/characters/text")
@RequiredArgsConstructor
@RestController
public class TextCharacterController {

    private final TextCharacterService textCharacterService;

    @PostMapping
    public TextCharacterResponse createEssay(@RequestBody CreateTextCharacterRequest characterRequest) {
        return textCharacterService.createTextCharacter(characterRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteEssay(@PathVariable("id") String textCharacterId) {
        textCharacterService.deleteTextCharacter(textCharacterId);
    }

    @PatchMapping("/{id}")
    public TextCharacterResponse updateEssay(
            @PathVariable("id") String textCharacterId,
            @RequestBody UpdateTextCharacterRequest updateTextCharacterRequest) {

        return textCharacterService.updateEssay(textCharacterId, updateTextCharacterRequest);
    }

}
