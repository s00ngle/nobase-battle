package com.ssafy.nobasebattle.domain.user.service;

import com.ssafy.nobasebattle.domain.user.domain.AccountRole;
import com.ssafy.nobasebattle.domain.user.domain.User;
import com.ssafy.nobasebattle.domain.user.domain.repository.UserRepository;
import com.ssafy.nobasebattle.domain.user.presentation.dto.request.RegisterRequest;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.AuthTokensResponse;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.TestSignup;
import com.ssafy.nobasebattle.global.security.JwtTokenProvider;
import com.ssafy.nobasebattle.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Transactional
@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserUtils userUtils;

    public TestSignup singUpTest(){

        User user =
                User.builder()
                        .email(UUID.randomUUID().toString())
                        .username(UUID.randomUUID().toString())
                        .password(UUID.randomUUID().toString())
                        .accountRole(AccountRole.USER)
                        .build();
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getAccountRole());

        return new TestSignup(accessToken, user.getId());

    }

    public AuthTokensResponse testLogin(String userId){
        User user = userUtils.getUserById(userId);
        String accessToken = jwtTokenProvider.generateAccessToken(userId, user.getAccountRole());

        return AuthTokensResponse.builder()
                .accessToken(accessToken)
                .role(user.getAccountRole())
                .build();
    }

    public AuthTokensResponse registerUser(RegisterRequest registerRequest) {

        log.info("=== register [service]  ===");

        User user =
                User.builder()
                        .email(registerRequest.getEmail())
                        .username(registerRequest.getNickname())
                        .password(registerRequest.getPassword())
                        .accountRole(AccountRole.USER)
                        .build();
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getAccountRole());

        log.info("========회원가입을 완료했습니다=================");

        return AuthTokensResponse.builder()
                .accessToken(accessToken)
                .role(user.getAccountRole())
                .build();
    }
}

