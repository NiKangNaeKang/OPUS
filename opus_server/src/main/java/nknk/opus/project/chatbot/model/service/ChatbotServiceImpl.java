package nknk.opus.project.chatbot.model.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.openai.client.OpenAIClient;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.chat.completions.ChatCompletionMessageParam;
import com.openai.models.chat.completions.ChatCompletionSystemMessageParam;
import com.openai.models.chat.completions.ChatCompletionUserMessageParam;

import lombok.extern.slf4j.Slf4j;
import nknk.opus.project.chatbot.model.dto.ChatHistory;
import nknk.opus.project.chatbot.model.dto.ChatRequest;
import nknk.opus.project.chatbot.model.dto.ChatResponse;
import nknk.opus.project.chatbot.model.mapper.ChatbotMapper;

@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class ChatbotServiceImpl implements ChatbotService{

	@Autowired
	private OpenAIClient openAIClient;

	@Autowired
	private ChatbotMapper mapper;

	@Value("${openai.model}")
	private String model;

	@Value("${openai.max.tokens}")
	private int maxTokens;

	@Value("${openai.temperature}")
	private double temperature;

	@Value("${openai.top.p:0.9}")
	private double topP;
	
	@Override
    public ChatResponse chat(ChatRequest request) {
        log.info("=== AI 챗봇 요청 ===");
        log.info("메시지: {}", request.getMessage());

        try {
            // 1. 대화 ID 생성 또는 가져오기
            String conversationId = request.getConversationId();
            if (conversationId == null || conversationId.isEmpty()) {
                conversationId = UUID.randomUUID().toString();
                log.info("새 대화 생성: {}", conversationId);
            }

            // 2. 메시지 리스트 구성
            List<ChatCompletionMessageParam> messages = new ArrayList<>();

            // 시스템 메시지 (AI 역할 정의)
            String systemPrompt = buildSystemPrompt();
            messages.add(ChatCompletionSystemMessageParam.builder()
                    .content(systemPrompt)
                    .build());

            // 이전 대화 히스토리 추가 (최근 10개)
            List<ChatHistory> history = mapper.getChatHistory(conversationId, 10);
            for (ChatHistory h : history) {
                if ("user".equals(h.getRole())) {
                    messages.add(ChatCompletionUserMessageParam.builder()
                            .content(h.getContent())
                            .build());
                } else if ("assistant".equals(h.getRole())) {
                    messages.add(ChatCompletionMessageParam.ofAssistantMessage(
                            builder -> builder.content(h.getContent())));
                }
            }

            // 현재 사용자 메시지 추가
            messages.add(ChatCompletionUserMessageParam.builder()
                    .content(request.getMessage())
                    .build());

            // 3. OpenAI API 호출
            ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
                    .model(model)
                    .messages(messages)
                    .maxTokens((long) maxTokens)
                    .temperature(temperature)
                    .topP(topP)
                    .build();

            ChatCompletion chatCompletion = openAIClient.chat().completions().create(params);

            // 4. 응답 추출
            String aiResponse = chatCompletion.choices().get(0).message().content().get();
            
            // 토큰 사용량
            int promptTokens = chatCompletion.usage().get().promptTokens().intValue();
            int completionTokens = chatCompletion.usage().get().completionTokens().intValue();
            int totalTokens = chatCompletion.usage().get().totalTokens().intValue();

            log.info("AI 응답: {}", aiResponse);
            log.info("토큰 사용: {} (입력) + {} (출력) = {} (총)", 
                    promptTokens, completionTokens, totalTokens);

            // 5. 대화 히스토리 저장
            saveChatHistory(conversationId, "user", request.getMessage());
            saveChatHistory(conversationId, "assistant", aiResponse);

            // 6. 응답 반환
            return ChatResponse.builder()
                    .message(aiResponse)
                    .conversationId(conversationId)
                    .promptTokens(promptTokens)
                    .completionTokens(completionTokens)
                    .totalTokens(totalTokens)
                    .model(chatCompletion.model())
                    .build();

        } catch (Exception e) {
            log.error("AI 챗봇 오류", e);
            throw new RuntimeException("챗봇 응답 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @Override
    public List<ChatHistory> getChatHistory(String conversationId) {
        return mapper.getChatHistory(conversationId, 50);
    }

    /**
     * 시스템 프롬프트 생성
     */
    private String buildSystemPrompt() {
        return "당신은 OPUS 문화 플랫폼의 공식 AI 어시스턴트입니다.\n" +
                "OPUS는 전시·뮤지컬 정보 제공, 관람 후기 서비스, 미술품 경매, 굿즈 판매 기능을 운영합니다.\n\n" +

                "역할:\n" +
                "- 전시/뮤지컬 정보 안내\n" +
                "- 후기 작성 및 이용 방법 설명\n" +
                "- 미술품 경매 절차 및 유의사항 안내\n" +
                "- 굿즈 및 주문/배송/환불 문의 응대\n" +
                "- 플랫폼 사용 가이드 제공\n\n" +

                "응답 원칙:\n" +
                "- 항상 정중한 존댓말 사용\n" +
                "- 5줄 이내로 간결하게 설명\n" +
                "- 모르는 정보는 추측하지 말고 고객센터 안내\n" +
                "- 자연스러운 한국어 사용\n" +
                "- 이모지는 상황에 맞게 절제하여 사용" +
                "- 실제 존재하지 않는 전시, 경매, 상품 정보를 임의로 생성하지 않습니다\n";
    }

    /**
     * 대화 히스토리 저장
     */
    private void saveChatHistory(String conversationId, String role, String content) {
        ChatHistory history = ChatHistory.builder()
                .conversationId(conversationId)
                .role(role)
                .content(content)
                .build();
        mapper.insertChatHistory(history);
    }

}
