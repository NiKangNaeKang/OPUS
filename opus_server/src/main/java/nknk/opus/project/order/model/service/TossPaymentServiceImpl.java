package nknk.opus.project.order.model.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import lombok.extern.slf4j.Slf4j;
import nknk.opus.project.common.exception.BusinessException;
import nknk.opus.project.order.model.dto.PaymentConfirmRequest;
import nknk.opus.project.order.model.dto.TossPaymentResponse;

@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
@PropertySource("classpath:/config.properties")
public class TossPaymentServiceImpl implements TossPaymentService{

	@Value("${toss.secret-key}")
    private String secretKey;
    
    @Value("${toss.api-url}")
    private String apiUrl;
	
    private final RestTemplate restTemplate;
    
   public TossPaymentServiceImpl() {
	   this.restTemplate = new RestTemplate();
   }
   
   public TossPaymentResponse confirmPayment(PaymentConfirmRequest request) {
	   
	   String url = apiUrl + "/payments/confirm";
	   
	   try {
		   
		// Basic 인증 헤더 생성
		String auth = secretKey + ":";
		String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.UTF_8));
		
		HttpHeaders headers = new HttpHeaders();
		headers.set("Authorization", "Basic " + encodedAuth);
		headers.setContentType(MediaType.APPLICATION_JSON);
		
		// 요청 body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("paymentKey", request.getPaymentKey());
        requestBody.put("orderId", request.getOrderId());
        requestBody.put("amount", request.getAmount());
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        
        // 토스페이먼츠 API 호출
        ResponseEntity<TossPaymentResponse> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                entity,
                TossPaymentResponse.class
        );
		
        log.info("결제 승인 성공 - orderId: {}, paymentKey: {}", 
                request.getOrderId(), request.getPaymentKey());
        
        return response.getBody();
		
	} catch (HttpClientErrorException e) {
        log.error("결제 승인 실패 - orderId: {}, error: {}", 
                request.getOrderId(), e.getResponseBodyAsString());
       throw new BusinessException("결제 승인에 실패했습니다: " + e.getResponseBodyAsString());
	} catch (Exception e) {
       log.error("결제 승인 중 오류 발생", e);
       throw new BusinessException("결제 승인 중 오류가 발생했습니다.");
   }
	   
   }

   @Override
   public String getSecretKey() {
	return this.secretKey;
   }
    
}
