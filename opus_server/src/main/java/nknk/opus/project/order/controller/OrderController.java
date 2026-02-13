package nknk.opus.project.order.controller;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import nknk.opus.project.order.model.dto.OrderRequest;
import nknk.opus.project.order.model.dto.PaymentConfirmRequest;
import nknk.opus.project.order.model.dto.TossPaymentResponse;
import nknk.opus.project.order.model.service.OrderService;
import nknk.opus.project.order.model.service.TossPaymentService;

@Slf4j
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("orders")
public class OrderController {

	@Autowired
	private OrderService orderService;
	
	@Autowired
	private TossPaymentService tossPaymentService;

	/**
	 * 주문 생성
	 */
	@PostMapping
	public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderRequest request,
			Authentication authentication) {

		String memberNoStr = (String) authentication.getPrincipal();
		int memberNo = Integer.parseInt(memberNoStr);

		Map<String, Object> result = orderService.createOrder(request, memberNo);

		return ResponseEntity.status(HttpStatus.CREATED).body(result);

	}

	/**
	 * 결제 승인
	 */
	@PostMapping("confirm")
	public ResponseEntity<TossPaymentResponse> confirmPayment(@RequestBody PaymentConfirmRequest request,
			Authentication authentication) {

		String memberNoStr = (String) authentication.getPrincipal();
		int memberNo = Integer.parseInt(memberNoStr);

		TossPaymentResponse response = orderService.confirmPayment(request, memberNo);

		return ResponseEntity.ok(response);
	}

	/**
	 * 가상계좌 입금 Webhook
	 */
	@PostMapping("webhook/virtual-account")
	public ResponseEntity<Map<String, String>> handleVirtualAccountWebhook(
			@RequestHeader(value = "X-Toss-Signature", required = false) String signature,
			@RequestBody String payload) {

		log.info("가상계좌 입금 Webhook 수신");
		log.debug("Signature: {}", signature);
		log.debug("Payload: {}", payload);

		try {
			// 1. Webhook 검증 (보안)
			if (!verifyWebhookSignature(signature, payload)) {
				log.error("Webhook 서명 검증 실패");
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
						.body(Map.of("status", "FAIL", "message", "Invalid signature"));
			}

			// 2. JSON 파싱
			ObjectMapper objectMapper = new ObjectMapper();
			Map<String, Object> webhookData = objectMapper.readValue(payload, new TypeReference<Map<String, Object>>() {
			});

			String orderId = (String) webhookData.get("orderId");
			String status = (String) webhookData.get("status");

			log.info("Webhook 데이터 - orderId: {}, status: {}", orderId, status);

			// 3. 입금 완료 처리
			if ("DONE".equals(status)) {
				orderService.completeVirtualAccountDeposit(orderId);
				log.info("가상계좌 입금 완료 처리 성공 - orderId: {}", orderId);
			} else {
				log.warn("입금 완료가 아닌 상태 - orderId: {}, status: {}", orderId, status);
			}

			// 4. 토스페이먼츠에 성공 응답
			return ResponseEntity.ok(Map.of("status", "SUCCESS"));

		} catch (Exception e) {
			log.error("Webhook 처리 실패", e);

			// 실패 응답 (토스페이먼츠가 재시도함)
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("status", "FAIL", "message", e.getMessage()));
		}
	}

	/**
	 * Webhook 서명 검증
	 */
	private boolean verifyWebhookSignature(String signature, String payload) {
		// signature가 없으면 테스트 환경으로 간주하고 통과
		if (signature == null || signature.isEmpty()) {
			log.warn("Webhook 서명이 없음 (테스트 환경)");
			return true;
		}

		try {
			// 토스페이먼츠 시크릿 키로 HMAC-SHA256 검증
			String secretKey = tossPaymentService.getSecretKey();

			Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
			SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
			sha256_HMAC.init(secret_key);

			byte[] hash = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));
			String calculatedSignature = Base64.getEncoder().encodeToString(hash);

			return calculatedSignature.equals(signature);

		} catch (Exception e) {
			log.error("Webhook 서명 검증 중 오류", e);
			return false;
		}
	}

}
