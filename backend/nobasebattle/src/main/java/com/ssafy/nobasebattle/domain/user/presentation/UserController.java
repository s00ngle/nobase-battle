package com.ssafy.nobasebattle.domain.user.presentation;

import com.ssafy.nobasebattle.domain.user.presentation.dto.request.*;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.AuthTokensResponse;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.TestSignup;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.UserResponse;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.UsernameCheckResponse;
import com.ssafy.nobasebattle.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/users")
@RestController
public class UserController {

    private final UserService userService;

    @PostMapping("/test-login/{userId}")
    public AuthTokensResponse loginTest(@PathVariable("userId") String userId) {
        return userService.testLogin(userId);
    }

    @PostMapping("/sign-up-test")
    public TestSignup signUptTest() {
        return userService.singUpTest();
    }

    @PostMapping("/signup")
    public AuthTokensResponse registerUser(@RequestBody RegisterRequest registerRequest) {
        return userService.registerUser(registerRequest);
    }

    @PostMapping("/login")
    public AuthTokensResponse login(@RequestBody LoginRequest loginRequest) {
        return userService.login(loginRequest);
    }

    @PostMapping("/anonymous")
    public AuthTokensResponse registerAnonymity() {
        return userService.registerAnonymity();
    }

    @PatchMapping("/anonymous/signup")
    public UserResponse updateAnonymity(@RequestBody AnonymousUserUpgradeRequest userUpgradeRequest) {
        return userService.updateAnonymity(userUpgradeRequest);
    }

    @GetMapping("/profile")
    public UserResponse getUserProfile() {
        return userService.getUserProfile();
    }

    @PatchMapping("/profile")
    public UserResponse updateUserProfile(@RequestBody UpdateProfileRequest updateProfileRequest) {
        return userService.updateUserProfile(updateProfileRequest);
    }

    @DeleteMapping("/withdrawal")
    public void deleteUser() {
        userService.deleteUser();
    }

    @GetMapping("/check-nickname")
    public UsernameCheckResponse checkUsername(@RequestBody UsernameCheckRequest usernameCheckRequest) {
        return userService.checkUsername(usernameCheckRequest);
    }

}



