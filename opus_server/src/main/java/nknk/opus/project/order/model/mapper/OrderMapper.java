package nknk.opus.project.order.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import nknk.opus.project.order.model.dto.Order;
import nknk.opus.project.order.model.dto.OrderItem;
import nknk.opus.project.order.model.dto.OrderListResponse;

@Mapper
public interface OrderMapper {

	/**
	 * 주문 생성
	 */
	int createOrder(Order order);

	/**
	 * 주문 상품 추가
	 */
	int insertOrderItem(OrderItem orderItem);

	/**
	 * 주문 조회 (ORDER_ID로) - 토스 결제 시 사용
	 */
	Order selectOrderByOrderId(String orderId);

	/**
	 * 주문 조회 (ORDER_NO로)
	 */
	Order selectOrderByOrderNo(int orderNo);

	/**
	 * 결제 승인 후 주문 업데이트
	 */
	int updateOrderAfterPayment(Order order);

	/**
	 * 주문 상태 업데이트
	 */
	int updateOrderStatus(Order order);

	/**
	 * 주문 상품 목록 조회 (ORDER_ID 기준)
	 */
	List<OrderItem> selectOrderItems(String orderId);

	/**
	 * 재고 차감
	 */
	int decreaseStock(@Param("goodsOptionNo") int goodsOptionNo, @Param("qty") int qty);

	/**
	 * 상품명 조회
	 */
	String selectGoodsName(int goodsNo);

	/**
	 * 회원별 주문 목록 조회
	 */
	List<OrderListResponse> selectOrderListByMember(@Param("memberNo") int memberNo);

	/**
	 * 주문 상태별 목록 조회
	 */
	List<OrderListResponse> selectOrderListByStatus(@Param("memberNo") int memberNo,
			@Param("orderStatus") String orderStatus);

	/**
	 * 주문 상세 조회
	 */
	Order selectOrderDetail(@Param("orderNo") int orderNo, @Param("memberNo") int memberNo);

	/**
	 * 주문 취소 처리
	 */
	int cancelOrder(@Param("orderId") String orderId, @Param("cancelReason") String cancelReason);

	/**
	 * 송장번호 등록
	 */
	int updateTrackingInfo(@Param("orderNo") int orderNo, @Param("trackingNumber") String trackingNumber,
			@Param("deliveryCompany") String deliveryCompany);

	/**
	 * 배송 완료 처리
	 */
	int completeDelivery(@Param("orderNo") int orderNo);
}
