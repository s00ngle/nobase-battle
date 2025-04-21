package com.ssafy.nobasebattle.domain.user.presentation;

import com.ssafy.nobasebattle.domain.user.presentation.dto.request.RegisterRequest;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.AuthTokensResponse;
import com.ssafy.nobasebattle.domain.user.presentation.dto.response.TestSignup;
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
    public AuthTokensResponse loginTest(@PathVariable("userId") String userId){
        return userService.testLogin(userId);
    }

    @PostMapping("/sign-up-test")
    public TestSignup signUptTest(){
       return userService.singUpTest();
    }

    @PostMapping("/signup")
    public AuthTokensResponse registerUser(@RequestBody RegisterRequest registerRequest) {
        log.info("=========== register api start ============");
        return userService.registerUser(registerRequest);
    }



}
