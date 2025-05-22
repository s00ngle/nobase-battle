package com.ssafy.nobasebattle.domain.user.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "email은 null이거나 빈 문자열일 수 없습니다.")
    @Size(max = 30, message = "email은 1자 이상 30자 이하여야 합니다.")
    private String email;

    @NotBlank(message = "비밀번호는 null이거나 빈 문자열일 수 없습니다.")
    @Size(max = 30, message = "비밀번호는 1자 이상 30자 이하여야 합니다.")
    private String password;
}
