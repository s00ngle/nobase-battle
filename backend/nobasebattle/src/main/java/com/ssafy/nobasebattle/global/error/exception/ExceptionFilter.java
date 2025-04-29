package com.ssafy.nobasebattle.global.error.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.nobasebattle.global.error.ErrorResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class ExceptionFilter extends OncePerRequestFilter {

    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal (
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (NoBaseBattleException e) {

            log.info("============= NoBaseBattleException ===================");
            writeErrorResponse(response, e.getErrorCode(), request.getRequestURL().toString());
        } catch (Exception e) {

            log.info("============= exception ===================");
            if (e.getCause() instanceof NoBaseBattleException) {
                writeErrorResponse(
                        response,
                        ((NoBaseBattleException) e.getCause()).getErrorCode(),
                        request.getRequestURL().toString());
            } else {
                e.printStackTrace();
                writeErrorResponse(
                        response,
                        ErrorCode.INTERNAL_SERVER_ERROR,
                        request.getRequestURL().toString());
            }
        }
    }


    private void writeErrorResponse(HttpServletResponse response, ErrorCode errorCode, String path)
            throws IOException {

        log.info("=============예외 잡히는 곳 ===================");
        ErrorResponse errorResponse =
                new ErrorResponse(
                        errorCode.getStatus(), errorCode.getReason(), path);

        response.setStatus(errorCode.getStatus());
        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }


}