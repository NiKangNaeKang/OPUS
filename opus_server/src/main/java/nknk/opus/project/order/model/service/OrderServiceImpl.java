package nknk.opus.project.order.model.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import nknk.opus.project.common.exception.BusinessException;
import nknk.opus.project.common.exception.ResourceNotFoundException;
import nknk.opus.project.notification.model.service.NotificationService;
import nknk.opus.project.order.model.dto.CancelRequest;
import nknk.opus.project.order.model.dto.Order;
import nknk.opus.project.order.model.dto.OrderItem;
import nknk.opus.project.order.model.dto.OrderListResponse;
import nknk.opus.project.order.model.dto.OrderRequest;
import nknk.opus.project.order.model.dto.PaymentConfirmRequest;
import nknk.opus.project.order.model.dto.TossPaymentResponse;
import nknk.opus.project.order.model.mapper.OrderMapper;

@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class OrderServiceImpl implements OrderService {

	@Autowired
	private OrderMapper mapper;

	@Autowired
	private TossPaymentService tossPaymentService;

	@Autowired
	private EmailService emailService; // 이메일 발송 서비스
	
	@Autowired
	private NotificationService notificationService;

	/**
	 * 주문 생성 (결제 전)
	 */
	@Override
	public Map<String, Object> createOrder(OrderRequest request, int memberNo) {

		// 1. 주문 번호 생성
		String orderId = "ORDER_" + System.currentTimeMillis() + "_" + memberNo;

		log.info("===== 주문 생성 시작 =====");
		log.info("orderId: {}", orderId);
		log.info("memberNo: {}", memberNo);
		log.info("recipient: {}", request.getRecipient());
		log.info("totalAmount: {}", request.getTotalAmount());

		// 2. 주문 정보 DB 저장
		Order order = Order.builder().orderId(orderId).memberNo(memberNo).recipient(request.getRecipient())
				.recipientTel(request.getRecipientTel()).postcode(request.getPostcode())
				.basicAddress(request.getBasicAddress()).detailAddress(request.getDetailAddress())
				.deliveryReq(request.getDeliveryReq()).email(request.getEmail()).ordererName(request.getOrdererName())
				.totalAmount(request.getTotalAmount()).goodsAmount(request.getTotalAmount()).deliveryAmount(0)
				.paymentMethod(request.getPaymentMethod()).orderStatus("READY").build();

		log.info("Order 객체 생성 완료: {}", order);

		int result = mapper.createOrder(order);

		if (result != 1) {
			throw new BusinessException("주문 생성에 실패했습니다.");
		}

		// 생성된 ORDER_NO 가져오기
		int orderNo = order.getOrderNo();

		// 3. 주문 상품 저장
		for (OrderItem item : request.getItems()) {
			OrderItem orderItem = OrderItem.builder().orderNo(orderNo).goodsNo(item.getGoodsNo())
					.goodsOptionNo(item.getGoodsOptionNo()).qty(item.getQty()).unitPrice(item.getUnitPrice()).build();

			mapper.insertOrderItem(orderItem);
		}

		// 4. 주문명 생성
		String orderName = generateOrderName(request.getItems());
		int itemCount = request.getItems().size();                      // 총 상품 개수

	    notificationService.createNotification(
	        memberNo,
	        "ORDER",
	        "주문이 완료되었습니다.",
	        itemCount == 1
	            ? orderName                                     // 1개면 상품명만
	            : orderName + " 외 " + (itemCount - 1) + "건", // 2개 이상이면 "외 N건"
	        "/mypage/orders"
	    );

		// 5. 응답 데이터
		Map<String, Object> response = new HashMap<>();
		response.put("orderId", orderId);
		response.put("orderName", orderName);
		response.put("amount", request.getTotalAmount());

		log.info("주문 생성 완료 - orderId: {}, memberNo: {}, amount: {}", orderId, memberNo, request.getTotalAmount());

		return response;
	}

	/**
	 * 결제 승인
	 */
	@Override
	public TossPaymentResponse confirmPayment(PaymentConfirmRequest request, int memberNo) {

		// 1. 주문 정보 조회
		Order order = mapper.selectOrderByOrderId(request.getOrderId());

		if (order == null) {
			throw new ResourceNotFoundException("주문 정보를 찾을 수 없습니다.");
		}

		if (order.getMemberNo() != memberNo) {
			throw new BusinessException("권한이 없습니다.");
		}

		// 2. 금액 검증 (변조 방지)
		if (order.getTotalAmount() != request.getAmount()) {
			throw new BusinessException("결제 금액이 일치하지 않습니다.");
		}

		// 3. 이미 승인된 주문인지 확인
		if ("DONE".equals(order.getOrderStatus())) {
			throw new BusinessException("이미 처리된 주문입니다.");
		}

		try {

			// 4. 토스페이먼츠 승인 요청
			TossPaymentResponse paymentResponse = tossPaymentService.confirmPayment(request);

			// 5. 주문 상태 업데이트
			order.setPaymentKey(paymentResponse.getPaymentKey());
			order.setOrderStatus(paymentResponse.getStatus()); // DONE 또는 WAITING_FOR_DEPOSIT
			order.setApprovedAt(paymentResponse.getApprovedAt());

			// 가상계좌인 경우 정보 저장
			if ("가상계좌".equals(paymentResponse.getMethod()) && paymentResponse.getVirtualAccount() != null) {
				order.setVirtualAccountBank(paymentResponse.getVirtualAccount().getBankName());
				order.setVirtualAccountNumber(paymentResponse.getVirtualAccount().getAccountNumber());
				order.setVirtualAccountDueDate(paymentResponse.getVirtualAccount().getDueDate());
			}

			mapper.updateOrderAfterPayment(order);

			// 6. 재고 차감 (결제 완료 시)
			if ("DONE".equals(paymentResponse.getStatus())) {
				List<OrderItem> orderItems = mapper.selectOrderItems(request.getOrderId());
				for (OrderItem item : orderItems) {
					if (item.getGoodsOptionNo() > 0) {
						mapper.decreaseStock(item.getGoodsOptionNo(), item.getQty());
					}
				}
			} else if ("WAITING_FOR_DEPOSIT".equals(paymentResponse.getStatus())) {
				log.info("가상계좌 발급 완료 - orderId: {}, 입금 대기 중", request.getOrderId());
			}

			log.info("결제 승인 완료 - orderId: {}, status: {}", request.getOrderId(), paymentResponse.getStatus());

			log.info("Virtual Account Info: {}", paymentResponse.getVirtualAccount());

			return paymentResponse;

		} catch (Exception e) {

			// 결제 실패 시 주문 상태 업데이트
			order.setOrderStatus("FAILED");
			mapper.updateOrderStatus(order);

			log.error("결제 승인 실패 - orderId: {}", request.getOrderId(), e);
			throw e;
		}
	}

	/**
	 * 가상계좌 입금 완료 처리 토스페이먼츠 Webhook에서 호출됨
	 */
	@Override
	public void completeVirtualAccountDeposit(String orderId) {

		log.info("가상계좌 입금 완료 처리 시작 - orderId: {}", orderId);

		// 1. 주문 조회
		Order order = mapper.selectOrderByOrderId(orderId);

		if (order == null) {
			log.error("주문을 찾을 수 없음 - orderId: {}", orderId);
			throw new ResourceNotFoundException("주문을 찾을 수 없습니다.");
		}

		// 2. 이미 입금 완료된 주문인지 확인 (중복 처리 방지)
		if ("DONE".equals(order.getOrderStatus())) {
			log.warn("이미 입금 완료된 주문 - orderId: {}", orderId);
			return; // 중복 처리 방지
		}

		// 3. 가상계좌 주문인지 확인
		if (!"가상계좌".equals(order.getPaymentMethod())) {
			log.error("가상계좌 주문이 아님 - orderId: {}, method: {}", orderId, order.getPaymentMethod());
			throw new BusinessException("가상계좌 주문이 아닙니다.");
		}
		
		// 4. 입금 대기 상태인지 확인	
		if (!"WAITING_FOR_DEPOSIT".equals(order.getOrderStatus())) {
	        log.error("입금 대기 상태가 아님 - orderId: {}, status: {}", 
	                 orderId, order.getOrderStatus());
	        throw new BusinessException("입금 대기 상태가 아닙니다.");
	    }

		// 4. 주문 상태를 '결제 완료'로 변경
		order.setOrderStatus("DONE");
		order.setApprovedAt(LocalDateTime.now().toString());

		int result = mapper.updateOrderStatus(order);

		if (result != 1) {
			log.error("주문 상태 업데이트 실패 - orderId: {}", orderId);
			throw new BusinessException("주문 상태 업데이트에 실패했습니다.");
		}

		// 5. 재고 차감
		List<OrderItem> orderItems = mapper.selectOrderItems(orderId);

		for (OrderItem item : orderItems) {
			// 옵션이 있는 상품만 재고 차감
			if (item.getGoodsOptionNo() > 0) {
				int stockResult = mapper.decreaseStock(item.getGoodsOptionNo(), item.getQty());

				if (stockResult == 0) {
					log.error("재고 차감 실패 - orderId: {}, optionNo: {}, qty: {}", orderId, item.getGoodsOptionNo(),
							item.getQty());
					throw new BusinessException("재고가 부족합니다.");
				}

				log.info("재고 차감 완료 - optionNo: {}, qty: {}", item.getGoodsOptionNo(), item.getQty());
			}
		}

		// 6. 입금 완료 이메일 발송
		try {
			sendDepositConfirmEmail(order);
		} catch (Exception e) {
			// 이메일 발송 실패는 로그만 남기고 진행
			log.error("입금 완료 이메일 발송 실패 - orderId: {}", orderId, e);
		}

		log.info("가상계좌 입금 완료 처리 완료 - orderId: {}, status: DONE", orderId);

	}
	
	@Override
	public List<OrderListResponse> getOrderList(int memberNo) {
		log.info("회원별 주문 목록 조회 - memberNo: {}", memberNo);
		
		List<OrderListResponse> orderList = mapper.selectOrderListByMember(memberNo);
		
		log.info("조회된 주문 개수: {}", orderList.size());
		
		return orderList;
	}
	
	@Override
	public List<OrderListResponse> getOrderListByStatus(int memberNo, String orderStatus) {
		log.info("주문 상태별 목록 조회 - memberNo: {}, status: {}", memberNo, orderStatus);
		
		List<OrderListResponse> orderList = mapper.selectOrderListByStatus(memberNo, orderStatus);
		
		return orderList;
	}
	
	@Override
	public Order getOrderDetail(int orderNo, int memberNo) {
		log.info("주문 상세 조회 - orderNo: {}, memberNo: {}", orderNo, memberNo);
		
		Order orderDetail = mapper.selectOrderDetail(orderNo, memberNo);
		
		if (orderDetail == null) {
			throw new BusinessException("주문을 찾을 수 없습니다.");
		}
		
		return orderDetail;
	}
	
	@Override
	public void cancelOrder(CancelRequest request, int memberNo) {
		log.info("주문 취소 요청 - orderId: {}, memberNo: {}", request.getOrderId(), memberNo);
		
		// 1. 주문 조회
		Order order = mapper.selectOrderByOrderId(request.getOrderId());
		
		if (order == null) {
			throw new BusinessException("주문을 찾을 수 없습니다.");
		}
		
		// 2. 권한 확인
		if (order.getMemberNo() != memberNo) {
			throw new BusinessException("주문 취소 권한이 없습니다.");
		}
		
		// 3. 취소 가능 상태 확인
		String status = order.getOrderStatus();
		if (!status.equals("READY") && 
		    !status.equals("WAITING_FOR_DEPOSIT") && 
		    !status.equals("PAID")) {
			throw new BusinessException("취소 가능한 주문 상태가 아닙니다.");
		}
		
		// 4. 결제 취소 (토스페이먼츠 API 호출)
		if (status.equals("PAID") || status.equals("DONE")) {
			try {
				tossPaymentService.cancelPayment(
					order.getPaymentKey(), 
					request.getCancelReason()
				);
			} catch (Exception e) {
				log.error("토스페이먼츠 취소 실패", e);
				throw new BusinessException("결제 취소에 실패했습니다.");
			}
		}
		
		// 5. DB 업데이트
		int result = mapper.cancelOrder(request.getOrderId(), request.getCancelReason());
		
		if (result == 0) {
			throw new BusinessException("주문 취소에 실패했습니다.");
		}
		
		log.info("주문 취소 완료 - orderId: {}", request.getOrderId());
	}
	
	@Override
	public void updateTrackingInfo(int orderNo, String trackingNumber, String deliveryCompany) {
		log.info("송장번호 등록 - orderNo: {}, tracking: {}", orderNo, trackingNumber);
		
		int result = mapper.updateTrackingInfo(orderNo, trackingNumber, deliveryCompany);
		
		if (result == 0) {
			throw new BusinessException("송장번호 등록에 실패했습니다.");
		}
	}
	
	@Override
	public void completeDelivery(int orderNo) {
		log.info("배송 완료 처리 - orderNo: {}", orderNo);
		
		int result = mapper.completeDelivery(orderNo);
		
		if (result == 0) {
			throw new BusinessException("배송 완료 처리에 실패했습니다.");
		}
	}

	/**
	 * 입금 완료 이메일 발송
	 */
	private void sendDepositConfirmEmail(Order order) {
		if (emailService != null) {
			emailService.sendDepositConfirmEmail(order.getEmail(), order.getOrdererName(), order.getOrderId(),
					order.getTotalAmount());
		}
	}

	/**
	 * 주문명 생성
	 */
	private String generateOrderName(List<OrderItem> items) {
		if (items.isEmpty()) {
			return "OPUS 상품";
		}

		String firstItemName = selectGoodsName(items.get(0).getGoodsNo());

		if (items.size() == 1) {
			return firstItemName;
		}

		return firstItemName + " 외 " + (items.size() - 1) + "건";
	}

	private String selectGoodsName(int goodsNo) {
		return mapper.selectGoodsName(goodsNo);
	}

}
