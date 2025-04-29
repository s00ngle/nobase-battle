package com.ssafy.nobasebattle.domain.textcharacter.presentation;

import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.CreateTextCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.UpdateTextCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.response.TextCharacterResponse;
import com.ssafy.nobasebattle.domain.textcharacter.service.TextCharacterService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api/v1/characters/text")
@RequiredArgsConstructor
@RestController
public class TextCharacterController {

    private final TextCharacterService textCharacterService;

    @PostMapping
    public TextCharacterResponse createTextCharacter(@RequestBody CreateTextCharacterRequest characterRequest) {
        return textCharacterService.createTextCharacter(characterRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteTextCharacter(@PathVariable("id") String textCharacterId) {
        textCharacterService.deleteTextCharacter(textCharacterId);
    }

    @PatchMapping("/{id}")
    public TextCharacterResponse updateTextCharacter(
            @PathVariable("id") String textCharacterId,
            @RequestBody UpdateTextCharacterRequest updateTextCharacterRequest) {

        return textCharacterService.updateEssay(textCharacterId, updateTextCharacterRequest);
    }

    @GetMapping("/{id}")
    public TextCharacterResponse getTextCharacterDetail(@PathVariable("id") String textCharacterId) {
        return textCharacterService.getTextCharacterDetail(textCharacterId);
    }

    @GetMapping
    public List<TextCharacterResponse> findUserTextCharacter() {
        return textCharacterService.findAllUsersTextCharacter();
    }

}
