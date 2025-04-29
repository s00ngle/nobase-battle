package com.ssafy.nobasebattle.domain.textcharacter.service;

import com.ssafy.nobasebattle.domain.textcharacter.domain.TextCharacter;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.CreateTextCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request.UpdateTextCharacterRequest;
import com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.response.TextCharacterResponse;

import java.util.List;

public interface TextCharacterServiceUtils  {

    TextCharacterResponse createTextCharacter(CreateTextCharacterRequest createTextCharacterRequest);
    void deleteTextCharacter(String textCharacterId);
    TextCharacterResponse updateEssay(String textCharacterId, UpdateTextCharacterRequest updateTextCharacterRequest);
    TextCharacterResponse getTextCharacterDetail(String textCharacterId);
    List<TextCharacterResponse> findAllUsersTextCharacter();
    TextCharacter queryTextCharacter(String id);
}
