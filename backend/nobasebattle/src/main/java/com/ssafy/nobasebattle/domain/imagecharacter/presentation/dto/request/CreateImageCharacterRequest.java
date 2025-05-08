package com.ssafy.nobasebattle.domain.imagecharacter.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CreateImageCharacterRequest {

    @NotBlank(message = "캐릭터 name은 null이거나 빈 문자열일 수 없습니다.")
    @Size(max = 20, message = "캐릭터 name은 1자 이상 20자 이하여야 합니다.")
    private String name;
}
