package nknk.opus.project.order.model.service;

import java.util.Map;

import nknk.opus.project.order.model.dto.OrderRequest;
import nknk.opus.project.order.model.dto.PaymentConfirmRequest;
import nknk.opus.project.order.model.dto.TossPaymentResponse;

public interface OrderService {

	Map<String, Object> createOrder(OrderRequest request, int memberNo);

	TossPaymentResponse confirmPayment(PaymentConfirmRequest request, int memberNo);

	void completeVirtualAccountDeposit(String orderId);

}
