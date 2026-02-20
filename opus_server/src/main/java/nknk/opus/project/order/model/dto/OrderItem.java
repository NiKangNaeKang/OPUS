package nknk.opus.project.order.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class OrderItem {

	private int orderItemNo; // 주문 상품 번호 (PK)
	private int orderNo; // 주문 번호 (FK)
	private int goodsNo; // 상품 번호 (FK)
	private int goodsOptionNo; // 상품 옵션 번호
	private int qty; // 수량
	private int unitPrice; // 단가

	// JOIN 결과용 필드
	private String goodsName; // 상품명
	private String goodsSize; // 옵션 사이즈
	private String goodsColor; // 옵션 색상
	private String thumbnail; // 썸네일 이미지
}
