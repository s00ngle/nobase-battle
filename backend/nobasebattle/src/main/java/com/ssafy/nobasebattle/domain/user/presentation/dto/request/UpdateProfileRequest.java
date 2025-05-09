package com.ssafy.nobasebattle.domain.user.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UpdateProfileRequest {

    @NotBlank(message = "닉네임은 null이거나 빈 문자열일 수 없습니다.")
    @Size(max = 10, message = "닉네임은 1자 이상 10자 이하여야 합니다.")
    private String nickname;
}
