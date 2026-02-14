package nknk.opus.project.order.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.order.model.dto.Order;
import nknk.opus.project.order.model.dto.OrderItem;

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
    int decreaseStock(int goodsOptionNo, int qty);
    
    /**
     * 상품명 조회
     */
    String selectGoodsName(int goodsNo);
}
