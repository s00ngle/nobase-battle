package com.ssafy.nobasebattle.domain.battle.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpenAIService {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * GPT-4o 모델을 사용하여 이미지를 분석하고 배틀 결과 생성
     */
    public BattleResult analyzeImagesAndDetermineBattle(String firstCharacterName, String firstCharacterImageUrl,
                                                        String secondCharacterName, String secondCharacterImageUrl) {
        try {
            String prompt = buildImageBattlePrompt(firstCharacterName, secondCharacterName);

            HttpHeaders headers = createHeaders();
            ObjectNode requestBody = createVisionRequestBody(prompt, firstCharacterImageUrl, secondCharacterImageUrl);

            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);

            log.info("OpenAI API 요청 전송 중...");
            String response = restTemplate.postForObject(openaiApiUrl, request, String.class);

            // 응답 파싱
            JsonNode responseJson = objectMapper.readTree(response);
            String content = responseJson.path("choices").path(0).path("message").path("content").asText();
            log.info("OpenAI API 응답 받음: {}", content.substring(0, Math.min(100, content.length())) + "...");

            return parseBattleResponse(content);

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생: {}", e.getMessage());
            return new BattleResult(0, "API 오류로 인해 배틀 결과를 생성할 수 없습니다. 두 캐릭터는 비겼습니다.");
        }
    }

    public BattleResult analyzeTextAndDetermineBattle(String firstCharacterName, String firstCharacterPrompt,
                                                      String secondCharacterName, String secondCharacterPrompt) {
        try {
            String prompt = buildTextBattlePrompt(firstCharacterName, firstCharacterPrompt, secondCharacterName, secondCharacterPrompt);

            HttpHeaders headers = createHeaders();
            ObjectNode requestBody = createTextRequestBody(prompt);

            HttpEntity<String> request = new HttpEntity<>(requestBody.toString(), headers);

            log.info("OpenAI API 요청 전송 중...");
            String response = restTemplate.postForObject(openaiApiUrl, request, String.class);

            // 응답 파싱
            JsonNode responseJson = objectMapper.readTree(response);
            String content = responseJson.path("choices").path(0).path("message").path("content").asText();
            log.info("OpenAI API 응답 받음: {}", content.substring(0, Math.min(100, content.length())) + "...");

            return parseBattleResponse(content);

        } catch (Exception e) {
            log.error("OpenAI API 호출 중 오류 발생: {}", e.getMessage());
            return new BattleResult(0, "API 오류로 인해 배틀 결과를 생성할 수 없습니다. 두 캐릭터는 비겼습니다.");
        }
    }


    /**
     * 배틀 프롬프트 생성
     */
    private String buildImageBattlePrompt(String firstCharacterName, String secondCharacterName) {
        return String.format(
                "두 가상 캐릭터 이미지를 분석하고 배틀 결과를 판정한 후 흥미진진한 배틀 이야기를 작성해주세요.\n\n" +
                        "첫 번째 캐릭터 이름: %s\n" +
                        "두 번째 캐릭터 이름: %s\n\n" +
                        "1. 각 캐릭터의 특징, 능력, 장비, 스타일 등을 분석해주세요.\n" +
                        "2. 두 캐릭터가 배틀을 했을 때의 결과를 판정해주세요.\n" +
                        "3. 누가 이겼는지 명확히 판정해주세요 (무승부도 가능).\n" +
                        "4. 배틀 과정을 300자 내외의 흥미진진한 이야기로 작성해주세요.\n\n" +
                        "반드시 다음 JSON 형식으로 응답해주세요:\n" +
                        "{\n" +
                        "  \"result\": 1 또는 -1 또는 0, (1: 첫 번째 캐릭터 승리, -1: 두 번째 캐릭터 승리, 0: 무승부)\n" +
                        "  \"battle_log\": \"배틀 이야기\"\n" +
                        "}\n\n" +
                        "battle_log는 한국어로 작성해주세요.",
                firstCharacterName,
                secondCharacterName
        );
    }

    private String buildTextBattlePrompt(String firstCharacterName, String firstCharacterPrompt,
                                         String secondCharacterName, String secondCharacterPrompt) {
        return String.format(
                "두 가상 캐릭터의 텍스트 프롬프트를 분석하고 배틀 결과를 판정한 후 흥미진진한 배틀 이야기를 작성해주세요.\n\n" +
                        "첫 번째 캐릭터 이름: %s\n" +
                        "첫 번째 캐릭터 프롬프트: %s\n" +
                        "두 번째 캐릭터 이름: %s\n" +
                        "두 번째 캐릭터 프롬프트: %s\n\n" +
                        "1. 각 캐릭터의 특징, 능력, 스타일 등을 프롬프트에서 분석해주세요.\n" +
                        "2. 두 캐릭터가 배틀을 했을 때의 결과를 판정해주세요.\n" +
                        "3. 누가 이겼는지 명확히 판정해주세요 (무승부도 가능).\n" +
                        "4. 배틀 과정을 300자 내외의 흥미진진한 이야기로 작성해주세요.\n\n" +
                        "반드시 다음 JSON 형식으로 응답해주세요:\n" +
                        "{\n" +
                        "  \"result\": 1 또는 -1 또는 0, (1: 첫 번째 캐릭터 승리, -1: 두 번째 캐릭터 승리, 0: 무승부)\n" +
                        "  \"battle_log\": \"배틀 이야기\"\n" +
                        "}\n\n" +
                        "battle_log는 한국어로 작성해주세요.",
                firstCharacterName, firstCharacterPrompt,
                secondCharacterName, secondCharacterPrompt
        );
    }

    /**
     * Vision API 요청 본문 생성
     */
    private ObjectNode createVisionRequestBody(String prompt, String firstImageUrl, String secondImageUrl) {
        ObjectNode requestBody = objectMapper.createObjectNode();
        // gpt-4o는 이미지 처리 가능
        requestBody.put("model", "gpt-4.1-mini");

        // JSON 응답 형식 지정
        ObjectNode responseFormat = objectMapper.createObjectNode();
        responseFormat.put("type", "json_object");
        requestBody.set("response_format", responseFormat);

        ArrayNode messagesArray = objectMapper.createArrayNode();

        // 시스템 메시지
        ObjectNode systemMessage = objectMapper.createObjectNode();
        systemMessage.put("role", "system");
        systemMessage.put("content", "당신은 창의적인 배틀 게임 마스터입니다. 캐릭터 이미지를 분석하고 흥미로운 배틀 결과를 판정합니다. 항상 JSON 형식으로 응답하세요.");

        // 유저 메시지
        ObjectNode userMessage = objectMapper.createObjectNode();
        userMessage.put("role", "user");

        ArrayNode contentArray = objectMapper.createArrayNode();

        // 텍스트 프롬프트
        ObjectNode textContent = objectMapper.createObjectNode();
        textContent.put("type", "text");
        textContent.put("text", prompt);
        contentArray.add(textContent);

        // 첫 번째 이미지
        if (firstImageUrl != null && !firstImageUrl.isEmpty()) {
            ObjectNode imageContent = objectMapper.createObjectNode();
            imageContent.put("type", "image_url");

            ObjectNode imageUrlObj = objectMapper.createObjectNode();
            imageUrlObj.put("url", firstImageUrl);
            imageContent.set("image_url", imageUrlObj);

            contentArray.add(imageContent);
        }

        // 두 번째 이미지
        if (secondImageUrl != null && !secondImageUrl.isEmpty()) {
            ObjectNode imageContent = objectMapper.createObjectNode();
            imageContent.put("type", "image_url");

            ObjectNode imageUrlObj = objectMapper.createObjectNode();
            imageUrlObj.put("url", secondImageUrl);
            imageContent.set("image_url", imageUrlObj);

            contentArray.add(imageContent);
        }

        userMessage.set("content", contentArray);

        messagesArray.add(systemMessage);
        messagesArray.add(userMessage);
        requestBody.set("messages", messagesArray);

        requestBody.put("max_tokens", 800);
        requestBody.put("temperature", 0.7);

        return requestBody;
    }

    private ObjectNode createTextRequestBody(String prompt) {
        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", "gpt-4.1 nano");

        ObjectNode responseFormat = objectMapper.createObjectNode();
        responseFormat.put("type", "json_object");
        requestBody.set("response_format", responseFormat);

        ArrayNode messagesArray = objectMapper.createArrayNode();

        ObjectNode systemMessage = objectMapper.createObjectNode();
        systemMessage.put("role", "system");
        systemMessage.put("content", "당신은 창의적인 배틀 게임 마스터입니다. 캐릭터 프롬프트를 분석하고 흥미로운 배틀 결과를 판정합니다. 항상 JSON 형식으로 응답하세요.");

        ObjectNode userMessage = objectMapper.createObjectNode();
        userMessage.put("role", "user");

        ArrayNode contentArray = objectMapper.createArrayNode();

        ObjectNode textContent = objectMapper.createObjectNode();
        textContent.put("type", "text");
        textContent.put("text", prompt);
        contentArray.add(textContent);

        userMessage.set("content", contentArray);

        messagesArray.add(systemMessage);
        messagesArray.add(userMessage);
        requestBody.set("messages", messagesArray);

        requestBody.put("max_tokens", 800);
        requestBody.put("temperature", 0.7);

        return requestBody;
    }

    /**
     * OpenAI API JSON 응답 파싱
     */
    private BattleResult parseBattleResponse(String jsonContent) {
        try {
            // JSON 파싱
            JsonNode responseNode = objectMapper.readTree(jsonContent);

            // 결과 및 배틀 로그 추출
            int result = responseNode.path("result").asInt(0); // 기본값은 무승부(0)
            String battleLog = responseNode.path("battle_log").asText("배틀 로그를 생성할 수 없습니다.");

            // 유효성 검사
            if (result != 1 && result != -1 && result != 0) {
                log.warn("잘못된 배틀 결과 값: {}", result);
                result = 0; // 기본값은 무승부
            }

            return new BattleResult(result, battleLog);

        } catch (Exception e) {
            log.error("JSON 파싱 중 오류 발생: {}", e.getMessage());
            // 오류 발생 시 기본값으로 무승부 반환
            return new BattleResult(0, "배틀 로그 파싱 오류로 인해 무승부로 판정됩니다.");
        }
    }

    /**
     * HTTP 헤더 생성
     */
    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);
        return headers;
    }

    /**
     * 배틀 결과를 저장하는 내부 클래스
     */
    public static class BattleResult {
        private final int result;
        private final String battleLog;

        public BattleResult(int result, String battleLog) {
            this.result = result;
            this.battleLog = battleLog;
        }

        public int getResult() {
            return result;
        }

        public String getBattleLog() {
            return battleLog;
        }
    }
}