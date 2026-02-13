package nknk.opus.project.order.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.order.model.dto.Order;
import nknk.opus.project.order.model.dto.OrderItem;

@Mapper
public interface OrderMapper {

	int createOrder(Order order);

	void insertOrderItem(OrderItem orderItem);

	Order selectOrderByOrderId(String orderId);

	void updateOrderAfterPayment(Order order);

	List<OrderItem> selectOrderItems(String orderId);

	int decreaseStock(int goodsOptionNo, int qty);

	int updateOrderStatus(Order order);

	String getGoodsName(int goodsNo);

}
