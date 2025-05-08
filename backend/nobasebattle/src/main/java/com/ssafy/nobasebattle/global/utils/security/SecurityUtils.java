package com.ssafy.nobasebattle.global.utils.security;

import com.ssafy.nobasebattle.global.exception.UnauthorizedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SecurityUtils {

    public static String getCurrentUserId() {

        log.info("===============SecurityContextHolder 에서 값을 가져옵니다 ============");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("Authentication={}",authentication.getName());

        if (authentication == null || !authentication.isAuthenticated()) {
            throw UnauthorizedException.EXCEPTION;
        }

        String principal = authentication.getName();

        if ("anonymousUser".equals(principal)) {
            throw UnauthorizedException.EXCEPTION;
        }

        try {
            return String.valueOf(principal);
        } catch (NumberFormatException e) {
            throw UnauthorizedException.EXCEPTION;
        }

    }

}
