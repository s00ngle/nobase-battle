package com.ssafy.nobasebattle.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = jwtTokenProvider.resolveToken(request);

        if (token != null) {

            Authentication authentication = jwtTokenProvider.getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("============== 필터를 타는가=========");
        }else {
            log.info("============== token이 null??????? =========");
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        String method = request.getMethod();

        List<String> excludePaths = Arrays.asList(
                "/api/v1/credentials/test-login",
                "/api/v1/credentials/sign-up-test",
                "/api/v1/credentials/oauth/link/kakao",
                "/api/v1/credentials/oauth/kakao",
                "/api/v1/credentials/oauth/link/google",
                "/api/v1/credentials/oauth/google",
                "/api/v1/credentials/oauth/valid/register",
                "/api/v1/credentials/login",
                "/api/v1/credentials/refresh",
                "/api/v1/user-preference/random",
                "/api/v1/users/signup"
        );

        if (path.equals("/api/v1/users/signup") && "POST".equalsIgnoreCase(method)) {
            return true;
        }

        return excludePaths.stream().anyMatch(path::startsWith);
    }
}
