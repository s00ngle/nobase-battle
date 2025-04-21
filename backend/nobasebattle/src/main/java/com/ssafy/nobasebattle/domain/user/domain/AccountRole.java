package com.ssafy.nobasebattle.domain.user.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum AccountRole {

    USER("USER"),
    GUEST("GUEST"),
    ADMIN("ADMIN");

    private final String value;
}
