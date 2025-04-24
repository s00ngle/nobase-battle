package com.ssafy.nobasebattle.global.success;

import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpResponse;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@Slf4j
@RestControllerAdvice
public class SuccessResponseAdvice implements ResponseBodyAdvice<Object> {

    @Override
    public Object beforeBodyWrite(
        Object body,
        MethodParameter returnType,
        MediaType selectedContentType,
        Class selectedConverterType,
        ServerHttpRequest request,
        ServerHttpResponse response) {

        HttpServletResponse servletResponse =
            ((ServletServerHttpResponse) response).getServletResponse();

        int status = servletResponse.getStatus();
        HttpStatus resolve = HttpStatus.resolve(status);

        String requestPath = request.getURI().getPath();

        if (requestPath.startsWith("/actuator/prometheus")) {
            log.info("===== 여기1 ==== ");
            return body;
        }

        if (resolve == null) {
            log.info("===== 여기2 ==== ");
            return body;
        }

        if (returnType.getParameterType().equals(Void.TYPE)) {
            log.info("===== 여기5 (void 반환, status: {}, body: {}) =====", status, body);
            response.setStatusCode(HttpStatus.NO_CONTENT);
            return new SuccessResponse(status, null);
        }


        if (resolve.is2xxSuccessful()) {
            log.info("===== 여기3 ==== ");
            return new SuccessResponse(status, body);
        }

        log.info("===== 여기4 ==== ");
        return body;
    }

    @Override
    public boolean supports(MethodParameter returnType, Class converterType) {
        return true;
    }
}
