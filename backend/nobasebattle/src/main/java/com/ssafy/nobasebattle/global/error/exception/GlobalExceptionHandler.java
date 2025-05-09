package com.ssafy.nobasebattle.global.error.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.nobasebattle.global.error.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.SneakyThrows;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.ssafy.nobasebattle.global.error.exception.ErrorCode.METHOD_NOT_ALLOWED;
import static com.ssafy.nobasebattle.global.error.exception.ErrorCode.URL_INPUT_ERROR;


@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(NoBaseBattleException.class)
    public ResponseEntity<ErrorResponse> techMateExceptionHandler(
            NoBaseBattleException e, HttpServletRequest request) {

        ErrorCode code = e.getErrorCode();
        ErrorResponse errorResponse =
                new ErrorResponse(
                        code.getStatus(),
                        code.getReason(),
                        request.getRequestURL().toString());
        return ResponseEntity.status(HttpStatus.valueOf(code.getStatus())).body(errorResponse);
    }

    @ExceptionHandler(Exception.class)
    protected ResponseEntity<ErrorResponse> handleException(Exception e, HttpServletRequest request) {

        StringBuffer requestURL = request.getRequestURL();
        String queryString = request.getQueryString();

        if (queryString != null) {
            requestURL.append('?').append(queryString);
        }

        String url = requestURL.toString();

        log.error("INTERNAL_SERVER_ERROR", e);
        ErrorCode internalServerError = ErrorCode.INTERNAL_SERVER_ERROR;
        ErrorResponse errorResponse =
                new ErrorResponse(
                        internalServerError.getStatus(),
                        internalServerError.getReason(),
                        url);

        return ResponseEntity.status(HttpStatus.valueOf(internalServerError.getStatus()))
                .body(errorResponse);
    }

    @SneakyThrows
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {

        List<FieldError> errors = ex.getBindingResult().getFieldErrors();
        Map<String, Object> fieldAndErrorMessages = errors.stream()
                .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage));

        // 요청 URL 추출
        ServletWebRequest servletWebRequest = (ServletWebRequest) request;
        HttpServletRequest httpServletRequest = servletWebRequest.getRequest();
        String url = UriComponentsBuilder.fromHttpUrl(httpServletRequest.getRequestURL().toString())
                .replaceQuery(httpServletRequest.getQueryString()) // 쿼리 파라미터 포함
                .build()
                .toUriString();

        String errorsToJsonString = new ObjectMapper().writeValueAsString(fieldAndErrorMessages);
        ErrorResponse errorResponse = new ErrorResponse(status.value(), errorsToJsonString, url);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex,
                                                                         HttpHeaders headers,
                                                                         HttpStatusCode status,
                                                                         WebRequest request) {

        ServletWebRequest servletWebRequest = (ServletWebRequest) request;
        String url = servletWebRequest.getRequest().getRequestURI();
        ErrorResponse errorResponse = new ErrorResponse(status.value(), METHOD_NOT_ALLOWED.getReason(), url);
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(errorResponse);
    }

    @Override
    protected ResponseEntity<Object> handleNoResourceFoundException(NoResourceFoundException ex,
                                                                    HttpHeaders headers,
                                                                    HttpStatusCode status,
                                                                    WebRequest request) {
        ServletWebRequest servletWebRequest = (ServletWebRequest) request;
        String url = servletWebRequest.getRequest().getRequestURI();
        ErrorResponse errorResponse = new ErrorResponse(status.value(), URL_INPUT_ERROR.getReason(), url);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

}