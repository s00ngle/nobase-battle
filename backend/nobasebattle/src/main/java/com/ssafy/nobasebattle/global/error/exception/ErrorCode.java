package com.ssafy.nobasebattle.global.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    /* 400 */

    /* 401 UNAUTHORIZED : 인증되지 않은 사용자 */
    INVALID_TOKEN(401, "토큰이 유효하지 않습니다."),
    EXPIRED_TOKEN(401, "토큰이 만료되었습니다."),

    /* 403 UNAUTHORIZED : 인가되지 않은 사용자 */
    REFRESH_TOKEN_EXPIRED_TOKEN(HttpStatus.FORBIDDEN.value(),"refreshToken 만료되었습니다."),
    NECESSARY_LOGIN(403,"로그인이 반드시 필요한 서비스입니다"),

    /* 404 NOT_FOUND : Resource를 찾을 수 없음 */
    USER_NOT_FOUND(404, "사용자를 찾을 수 없습니다."),
    FILE_EMPTY(404,  "FILE empty"),
    BAD_FILE_EXTENSION(404,  "FILE extension error"),
    FILE_UPLOAD_FAIL(404,  "FILE upload fail"),
    FILE_OVER_SIZE(404,  "FILE 크기가 10mb를 초과 하였습니다"),

    /* 500 */
    INTERNAL_SERVER_ERROR(500,"서버 에러");

    private final int status;
    private final String reason;
}