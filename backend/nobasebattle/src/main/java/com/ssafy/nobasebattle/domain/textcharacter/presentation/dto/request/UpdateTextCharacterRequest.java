package com.ssafy.nobasebattle.domain.textcharacter.presentation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateTextCharacterRequest {

    private String name;
    private String prompt;
}
