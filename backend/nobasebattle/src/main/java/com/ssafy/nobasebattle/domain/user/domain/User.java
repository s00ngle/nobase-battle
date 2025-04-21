package com.ssafy.nobasebattle.domain.user.domain;

import com.ssafy.nobasebattle.global.common.BaseEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@NoArgsConstructor
@Getter
public class User extends BaseEntity {

    @Indexed(unique = true)
    private String email;

    @Indexed(unique = true)
    private String username;

    private String password;

    AccountRole accountRole;

    @Builder
    public User(String email, String username, String password, AccountRole accountRole) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.accountRole = accountRole;
    }
}