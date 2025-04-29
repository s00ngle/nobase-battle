package com.ssafy.nobasebattle.domain.user.service;

import com.ssafy.nobasebattle.domain.user.domain.AccountRole;
import com.ssafy.nobasebattle.domain.user.domain.User;
import com.ssafy.nobasebattle.domain.user.domain.repository.UserRepository;
import com.ssafy.nobasebattle.domain.user.exception.EmailAlreadyExistsException;
import com.ssafy.nobasebattle.domain.user.exception.UserLoginFailedException;
import com.ssafy.nobasebattle.domain.user.exception.UsernameAlreadyExistsException;
import com.ssafy.nobasebattle.domain.user.presentation.dto.request.*;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.AuthTokensResponse;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.TestSignup;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.UserResponse;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.UsernameCheckResponse;
import com.ssafy.nobasebattle.global.security.JwtTokenProvider;
import com.ssafy.nobasebattle.global.utils.user.UserUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
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
                        .nickname(UUID.randomUUID().toString())
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

    /*
    추후 테스트를 위한 코드 삭제
     */

    public AuthTokensResponse registerUser(RegisterRequest registerRequest) {

        User user = userRepository.findByEmail(registerRequest.getEmail()).orElse(null);

        if (user != null) {

            if (!userRepository.existsByEmailAndPassword(registerRequest.getEmail(), registerRequest.getPassword())) {
                throw UserLoginFailedException.EXCEPTION;
            }

        } else {

            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                throw EmailAlreadyExistsException.EXCEPTION;
            }

            User newUser = createUser(registerRequest);
            userRepository.save(newUser);
            String accessToken = jwtTokenProvider.generateAccessToken(newUser.getId(), newUser.getAccountRole());
            return getUserToken(accessToken,newUser);
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getAccountRole());
        return getUserToken(accessToken,user);
    }

    public AuthTokensResponse registerAnonymity() {

        User user = createAnonymousUser();
        userRepository.save(user);
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getAccountRole());
        return getUserToken(accessToken,user);
    }

    public UserResponse updateAnonymity(AnonymousUserUpgradeRequest userUpgradeRequest) {

        if (userRepository.existsByEmail(userUpgradeRequest.getEmail())) {
            throw EmailAlreadyExistsException.EXCEPTION;
        }

        User user = userUtils.getUserFromSecurityContext();
        user.updateAnonymousUser(userUpgradeRequest);
        userRepository.save(user);
        return getUserResponse(user);
    }

    public AuthTokensResponse login(LoginRequest loginRequest){

        User user = userRepository.findByEmailAndPassword(loginRequest.getEmail(), loginRequest.getPassword())
                .orElseThrow(() -> UserLoginFailedException.EXCEPTION);

        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getAccountRole());
        return getUserToken(accessToken,user);
    }

    public UserResponse getUserProfile() {
        User user = userUtils.getUserFromSecurityContext();
        return getUserResponse(user);
    }

    public UserResponse updateUserProfile(UpdateProfileRequest updateProfileRequest) {

        if (userRepository.existsByNickname(updateProfileRequest.getNickname())) {
            throw UsernameAlreadyExistsException.EXCEPTION;
        }

        User user = userUtils.getUserFromSecurityContext();
        user.updateUsername(updateProfileRequest);
        userRepository.save(user);
        return getUserResponse(user);
    }

    public void deleteUser() {
        User user = userUtils.getUserFromSecurityContext();
        userRepository.delete(user);
    }

    public UsernameCheckResponse checkUsername(UsernameCheckRequest usernameCheckRequest) {

        if (userRepository.existsByNickname(usernameCheckRequest.getNickname())) {
            return new UsernameCheckResponse(true);
        }
        return new UsernameCheckResponse(false);
    }

    private User createAnonymousUser() {

        return User.builder()
                .email(UUID.randomUUID().toString().substring(0, 5))
                .nickname("무근본유저" + UUID.randomUUID().toString().substring(0, 5))
                .password(UUID.randomUUID().toString().substring(0, 5))
                .accountRole(AccountRole.GUEST)
                .build();
    }

    private User createUser(RegisterRequest registerRequest) {

        return User.builder()
                    .email(registerRequest.getEmail())
                    .nickname("무근본유저" + UUID.randomUUID().toString().substring(0, 5))
                    .password(registerRequest.getPassword())
                    .accountRole(AccountRole.USER)
                    .build();
    }

    private UserResponse getUserResponse(User user) {
        return new UserResponse(user);
    }

    private AuthTokensResponse getUserToken(String accessToken, User user) {
        return AuthTokensResponse.builder()
                .accessToken(accessToken)
                .role(user.getAccountRole())
                .build();
    }
}

