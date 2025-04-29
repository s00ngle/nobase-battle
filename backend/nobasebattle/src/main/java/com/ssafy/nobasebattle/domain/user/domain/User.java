package com.ssafy.nobasebattle.domain.user.domain;

import com.ssafy.nobasebattle.domain.user.presentation.dto.request.AnonymousUserUpgradeRequest;
import com.ssafy.nobasebattle.domain.user.presentation.dto.request.UpdateProfileRequest;
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
    private String nickname;

    private String password;

    AccountRole accountRole;

    @Builder
    public User(String email, String nickname, String password, AccountRole accountRole) {
        this.email = email;
        this.nickname = nickname;
        this.password = password;
        this.accountRole = accountRole;
    }

    public void updateAnonymousUser(AnonymousUserUpgradeRequest anonymousUserUpgradeRequest) {
        this.email = anonymousUserUpgradeRequest.getEmail();
        this.password = anonymousUserUpgradeRequest.getPassword();
        this.accountRole = AccountRole.USER;
    }

    public void updateUsername(UpdateProfileRequest updateProfileRequest) {
        this.nickname = updateProfileRequest.getNickname();
    }
}