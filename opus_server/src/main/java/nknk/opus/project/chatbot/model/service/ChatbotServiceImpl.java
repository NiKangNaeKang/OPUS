package nknk.opus.project.chatbot.model.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.openai.client.OpenAIClient;
import com.openai.models.chat.completions.ChatCompletion;
import com.openai.models.chat.completions.ChatCompletionCreateParams;
import com.openai.models.completions.CompletionUsage;

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

	@Override
    public ChatResponse chat(ChatRequest request) {
        log.info("=== AI 챗봇 요청 ===");
        log.info("메시지: {}", request.getMessage());

        try {
            // 대화 ID 생성 또는 가져오기
            String conversationId = request.getConversationId();
            if (conversationId == null || conversationId.isEmpty()) {
                conversationId = UUID.randomUUID().toString();
                log.info("새 대화 생성: {}", conversationId);
            }

         // ChatCompletion 파라미터 구성
            ChatCompletionCreateParams.Builder builder =
                    ChatCompletionCreateParams.builder()
                            .model(model)
                            .addSystemMessage(buildSystemPrompt(request.getContextData()))
                            .temperature(temperature)
                            .maxCompletionTokens((long) maxTokens);

            // 이전 대화 히스토리 추가
            List<ChatHistory> history =
                    mapper.getChatHistory(conversationId, 10);

            for (ChatHistory h : history) {

                if ("user".equals(h.getRole())) {
                    builder.addUserMessage(h.getContent());
                } else if ("assistant".equals(h.getRole())) {
                    builder.addAssistantMessage(h.getContent());
                }
            }

            // 현재 사용자 메시지 추가
            builder.addUserMessage(request.getMessage());
            
         // OpenAI 호출
            ChatCompletion completion =
                    openAIClient.chat().completions().create(builder.build());

         // 응답 추출
            String aiResponse = "응답을 생성하지 못했습니다.";

            if (!completion.choices().isEmpty()) {
                aiResponse = completion.choices()
                        .get(0)
                        .message()
                        .content()
                        .orElse(aiResponse);
            }
            
            int promptTokens = 0;
            int completionTokens = 0;
            int totalTokens = 0;

            if (completion.usage().isPresent()) {

            	CompletionUsage usage = completion.usage().get();

                promptTokens = (int) usage.promptTokens();
                completionTokens = (int) usage.completionTokens();
                totalTokens = (int) usage.totalTokens();
            }
            
            // DB 저장
            saveChatHistory(conversationId, "user", request.getMessage());
            saveChatHistory(conversationId, "assistant", aiResponse);
            
            // 응답 반환
            return ChatResponse.builder()
                    .message(aiResponse)
                    .conversationId(conversationId)
                    .promptTokens(promptTokens)
                    .completionTokens(completionTokens)
                    .totalTokens(totalTokens)
                    .model(completion.model())
                    .build();

        } catch (Exception e) {
            log.error("AI 챗봇 오류", e);
            throw new RuntimeException("챗봇 응답 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 대화 히스토리 불러오기
     */
    @Override
    public List<ChatHistory> getChatHistory(String conversationId) {
        return mapper.getChatHistory(conversationId, 50);
    }
    
    /**
     * 시스템 프롬프트 생성
     */
    private String buildSystemPrompt(String contextData) {
    	String base =
    	        "당신은 OPUS 문화 플랫폼의 공식 AI 어시스턴트입니다.\n" +
    	        "OPUS는 전시·뮤지컬 정보(On-Stage), 공지/이벤트 게시판(Proposals),\n" +
    	        "미술품 경매(Unveiling), 문화 굿즈 쇼핑(Selections) 서비스를 운영합니다.\n\n" +

    	        "## 담당 업무\n" +
    	        "[On-Stage] 전시·뮤지컬 정보 안내 (일정, 장소, 관람등급, 출연진)\n" +
    	        "[Proposals] 공지사항 및 이벤트·홍보 게시판 안내\n" +
    	        "[Unveiling] 미술품 경매 절차 안내 (마감형 최고가 낙찰, 본인인증 필요)\n" +
    	        "[Selections] 굿즈 상품 안내, 장바구니, 결제, 주문내역, 배송비(5만원 이상 무료)\n" +
    	        "[마이페이지] 연락처·비밀번호 변경, 찜 리스트, 후기, 주문·경매 내역, 회원탈퇴\n\n" +

    	        "## 응답 원칙\n" +
    	        "- 항상 정중한 존댓말 사용\n" +
    	        "- 5줄 이내로 간결하게 안내\n" +
    	        "- 아래 플랫폼 데이터가 제공된 경우, 반드시 해당 데이터만 기반으로 답변\n" +
    	        "- 데이터에 없는 공연명·상품명은 절대 언급하지 않음\n" +
    	        "- 데이터가 제공되지 않은 경우 해당 페이지에서 직접 확인을 안내\n" +
    	        "- 데이터가 없는 질문은 추측하지 말고 고객센터 안내\n" +
    	        "- 자연스러운 한국어 사용, 이모지 절제\n";
    	
    	// 키워드 감지 시에만 contextData가 들어옴
        if (contextData != null && !contextData.isBlank()) {
            base += "\n\n## 현재 플랫폼 실제 데이터 (이 내용만 기반으로 답변할 것)\n"
                 + contextData;
        }

        return base;
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
