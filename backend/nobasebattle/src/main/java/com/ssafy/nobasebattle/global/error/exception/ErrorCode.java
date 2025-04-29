package com.ssafy.nobasebattle.global.error.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    /* 400 */
    DUPLICATE_EMAIL(400, "이메일 중복입니다"),
    DUPLICATE_USERNAME(400, "닉네임 중복입니다"),
    LOGIN_FAILED(400, "아이디 또는 비밀번호가 일치하지 않습니다."),
    CHARACTER_LIMIT(400, "캐릭터 생성 초과"),
    TEXT_CHARACTER_NOT_HOST(400, "캐릭터 주인이 아닙니다"),
    IMAGE_CHARACTER_NOT_HOST(400, "캐릭터 주인이 아닙니다"),
    INVALID_BATTLE_MODE(400, "유효하지 않은 배틀 모드입니다."),
    OPPONENT_REQUIRED(400, "CHALLENGE 모드에서는 상대 캐릭터 ID가 필요합니다."),
    BATTLE_AGAINST_SELF(400, "자신의 캐릭터끼리 배틀할 수 없습니다."),

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
    TEXT_CHARACTER_NOT_FOUND(404, "캐릭터를 찾을 수 없습니다"),
    IMAGE_CHARACTER_NOT_FOUND(404, "캐릭터를 찾을 수 없습니다"),

    /* 429 Too Many Requests : 시간 제한 내 중복 요청 */
    BATTLE_COOLDOWN(429, "10초 내에는 다시 배틀을 신청할 수 없습니다."),

    /* 500 */
    INTERNAL_SERVER_ERROR(500,"서버 에러");

    private final int status;
    private final String reason;
}