package nknk.opus.project.order.model.service;

import nknk.opus.project.order.model.dto.PaymentConfirmRequest;
import nknk.opus.project.order.model.dto.TossPaymentResponse;

public interface TossPaymentService {

	String getSecretKey();

	TossPaymentResponse confirmPayment(PaymentConfirmRequest request);

}
