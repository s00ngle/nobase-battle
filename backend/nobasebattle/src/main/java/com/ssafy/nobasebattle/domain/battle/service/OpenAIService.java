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
//    private String buildImageBattlePrompt(String firstCharacterName, String secondCharacterName) {
//        return String.format(
//                "두 캐릭터의 이름은 각각 %s와 %s이다. 이미지를 보고 두 캐릭터에 대한 특징과 전투력을 분석해." +
//                        " 특징에 맞춰서 스킬을 만들어. 배틀 결과를 작성해. 대결은 철저히 공정하게 진행하며, 무조건 더 강력하거나 전략적으로 우위인 캐릭터가 승리해야 한다. \n" +
//                        "+ 만약 실력이 비슷하면 무승부를 선택할 수 있다. ### 지시문 ### \\n 예시를 참고해서 유사한 어조와 문체로 내용을 작성해. " +
//                        "battlelog를 string으로 채워야 해. 두 캐릭터에 대한 배틀 결과를 매우 창의적이고 엉뚱하고 재미있게 줄글로 작성해. 어린 아이들도 재미있게 느끼도록 엉뚱하게 작성해야해. 두 캐릭터가 맞붙어서 서로의 스킬을 활용하여 대결을 진행하고 마지막에는 승패가 결정되는 내용까지 작성해. " +
//                        "두 캐릭터가 만나는 과정은 작성하지 마. 두 캐릭터의 특성이 잘 드러나도록 대결 과정을 작성해. 절대 대화체로 작성하지 마. 독백체로 작성해. " +
//                        "마지막 줄에는 어떤 캐릭터가 승리했는지도 알려줘. 한글로 4문장 안에 모든 내용을 마무리 해." +
//                        " \\n ### 예시 ### 프롬프트 엔지니어는 붕괴맨의 '설정 붕괴' 시도를 역이용하여, '붕괴' 자체를 프롬프트의 일부로 포함시켰다. 붕괴맨은 자신의 '설정의 틀'이 흔들리는 것을 감지했지만, 이미 프롬프트 엔지니어의 전략 안에 갇혀 있었다. 결국, 붕괴의 파편 속에서 프롬프트 엔지니어는 승리했다.\\n" +
//                        "### 제공된 가이드라인을 따르지 않으면 페널티가 부과될 것입니다. 모든 지침을 주의깊게 읽고 반드시 지켜야 해. 반드시 창의적으로 작성해. " +
//                        "반드시 다음 JSON 형식으로 응답해주세요:\n" +
//                        "{\n" +
//                        "  \"result\": 1 또는 -1 또는 0, (1: 첫 번째 캐릭터 승리, -1: 두 번째 캐릭터 승리, 0: 무승부)\n" +
//                        "  \"battle_log\": \"배틀 이야기\"\n" +
//                        "}\n\n" +
//                        "battle_log는 한국어로 작성해주세요.",
//                firstCharacterName,
//                secondCharacterName
//        );
//    }

    private String buildImageBattlePrompt(String firstCharacterName, String secondCharacterName) {
        return String.format(
                "두 캐릭터의 이름은 각각 '%s', '%s'이다. 이미지를 보고 두 캐릭터에 대한 특징과 전투력을 분석해." +
                        " 특징에 맞춰서 배틀 결과를 작성해. 대결은 철저히 공정하게 진행하며, 무조건 더 강력하거나 전략적으로 우위인 캐릭터가 승리해야 한다. \n" +
                        "+ 만약 실력이 비슷하면 무승부를 선택할 수 있다. ### 지시문 ### \\n 예시를 참고해서 유사한 어조와 문체로 내용을 작성해. " +
                        "battlelog를 string으로 채워야 해. 두 캐릭터에 대한 배틀 결과를 매우 창의적이고 엉뚱하고 재미있게 줄글로 작성해. 어린 아이들도 재미있게 느끼도록 엉뚱하게 작성해야해. 두 캐릭터가 맞붙어서 서로의 스킬을 활용하여 대결을 진행하고 마지막에는 승패가 결정되는 내용까지 작성해. " +
                        "두 캐릭터가 만나는 과정은 작성하지 마. 두 캐릭터의 특성이 잘 드러나도록 대결 과정을 작성해. 절대 대화체로 작성하지 마. 독백체로 작성해. " +
                        "마지막 줄에는 어떤 캐릭터가 승리했는지도 알려줘. 한글로 5문장 안에 모든 내용을 마무리 해." +
                        " \\n ### 예시 1 ### 철학자가 먼저 공격을 시작했다. “자네의 주장은 근거가 빈약하며, 존재론적 허무주의에 빠져있군!” 무지개 반사맨은 “네 주장은 두 배로 근거가 빈약하며 존재론적 허무주의에 두 배로 빠져있어!”라고 응수했다. 철학자는 당황하며 심오한 질문을 던졌지만, 무지개 반사맨은 모든 질문을 두 배로 되돌려주었고, 결국 철학자는 자신의 철학적 딜레마에 스스로 무너졌다.\\n" +
                        " \\n ### 예시 2 ### 프롬프트 엔지니어는 붕괴맨의 '설정 붕괴' 시도를 역이용하여, '붕괴' 자체를 프롬프트의 일부로 포함시켰다. 붕괴맨은 자신의 '설정의 틀'이 흔들리는 것을 감지했지만, 이미 프롬프트 엔지니어의 전략 안에 갇혀 있었다. 결국, 붕괴의 파편 속에서 프롬프트 엔지니어는 승리했다.\\n" +
                        "### 제공된 가이드라인을 따르지 않으면 페널티가 부과될 것입니다. 모든 지침을 주의깊게 읽고 반드시 지켜야 해. 반드시 창의적으로 작성해. " +
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

//    private String buildTextBattlePrompt(String firstCharacterName, String firstCharacterPrompt,
//                                         String secondCharacterName, String secondCharacterPrompt) {
//        return String.format(
//                "두 가상 캐릭터의 텍스트 프롬프트를 분석하고 배틀 결과를 판정한 후 흥미진진한 배틀 이야기를 작성해주세요.\n\n" +
//                        "첫 번째 캐릭터 이름: %s\n" +
//                        "첫 번째 캐릭터 프롬프트: %s\n" +
//                        "두 번째 캐릭터 이름: %s\n" +
//                        "두 번째 캐릭터 프롬프트: %s\n\n" +
//                        "1. 각 캐릭터의 특징, 능력, 스타일 등을 프롬프트에서 분석해주세요.\n" +
//                        "2. 두 캐릭터가 배틀을 했을 때의 결과를 판정해주세요.\n" +
//                        "3. 누가 이겼는지 명확히 판정해주세요 (무승부도 가능).\n" +
//                        "4. 배틀 과정을 300자 내외의 흥미진진한 이야기로 작성해주세요.\n\n" +
//                        "반드시 다음 JSON 형식으로 응답해주세요:\n" +
//                        "{\n" +
//                        "  \"result\": 1 또는 -1 또는 0, (1: 첫 번째 캐릭터 승리, -1: 두 번째 캐릭터 승리, 0: 무승부)\n" +
//                        "  \"battle_log\": \"배틀 이야기\"\n" +
//                        "}\n\n" +
//                        "battle_log는 한국어로 작성해주세요.",
//                firstCharacterName, firstCharacterPrompt,
//                secondCharacterName, secondCharacterPrompt
//        );
//    }

    private String buildTextBattlePrompt(String firstCharacterName, String firstCharacterPrompt,
                                         String secondCharacterName, String secondCharacterPrompt) {
        return String.format(
                "### 지시문 ### \n 예시를 참고해서 유사한 어조와 문체로 내용을 작성해. battlelog를 string으로 채워야 해. " +
                        "두 캐릭터에 대한 배틀 결과를 매우 창의적이고 엉뚱하고 재미있게 줄글로 작성해. 어린 아이들도 재미있게 느끼도록 엉뚱하게 작성해야해. "+
                        "두 캐릭터가 맞붙어서 서로의 스킬을 활용하여 대결을 진행하고 마지막에는 승패가 결정되는 내용까지 작성해. 두 캐릭터가 만나는 과정은 작성하지 마. " +
                        "두 캐릭터의 특성이 잘 드러나도록 대결 과정을 작성해. 절대 대화체로 작성하지 마. 독백체로 작성해. 마지막 줄에는 어떤 캐릭터가 승리했는지도 알려줘. 한글로 4문장 안에 모든 내용을 마무리 해. " +
                        " \n ### 예시 ### 프롬프트 엔지니어는 붕괴맨의 '설정 붕괴' 시도를 역이용하여, '붕괴' 자체를 프롬프트의 일부로 포함시켰다. 붕괴맨은 자신의 '설정의 틀'이 흔들리는 것을 감지했지만, 이미 프롬프트 엔지니어의 전략 안에 갇혀 있었다. 결국, 붕괴의 파편 속에서 프롬프트 엔지니어는 승리했다.\n " +
                        "### character 1: name is %s. character 1 explaination: %s ### \n " +
                        "### character 2: name is %s. character 2 explaination: %s ### \n" +
                        "### 제공된 가이드라인을 따르지 않으면 페널티가 부과될 것입니다. 모든 지침을 주의깊게 읽고 반드시 지켜야 해. 반드시 창의적으로 작성해. charater 1의 승패에 따라 result는 int로 채워. 1 (승리) -1 (패배) 0 (무승부) " +
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
        systemMessage.put("content", "You are a creative judgment who thinks outside the box.");

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
        requestBody.put("temperature", 1);

        return requestBody;
    }

    private ObjectNode createTextRequestBody(String prompt) {
        ObjectNode requestBody = objectMapper.createObjectNode();
        requestBody.put("model", "gpt-4o-mini");

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
        requestBody.put("temperature", 1);

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