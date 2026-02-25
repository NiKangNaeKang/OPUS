package nknk.opus.project.admin.model.service;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import nknk.opus.project.admin.model.dto.GoodsRegist;
import nknk.opus.project.admin.model.mapper.AdminMapper;
import nknk.opus.project.common.config.FileConfig;
import nknk.opus.project.notification.model.service.NotificationService;
import nknk.opus.project.reviews.model.dto.Report;
import nknk.opus.project.selections.model.dto.Goods;
import nknk.opus.project.selections.model.dto.GoodsImg;
import nknk.opus.project.selections.model.dto.GoodsOption;
import nknk.opus.project.unveiling.model.dto.Unveiling;
import nknk.opus.project.reviews.model.dto.Reviews;

@Slf4j
@Service
@Transactional(rollbackFor = Exception.class)
public class AdminServiceImpl implements AdminService {

	@Autowired
	private AdminMapper mapper;

	@Autowired
	private FileConfig fileConfig;

	@Autowired
	private NotificationService notificationService;

	@Override
	public List<Report> getReport() {
		return mapper.getReport();
	}

	@Override
	public int confirmReview(int reportNo) {
		int hideReview = mapper.hideReview(reportNo);
		int confirmResult = mapper.confirmReview(reportNo);
		
		return hideReview * confirmResult;
	}

	@Override
	public int rejectReview(int reportNo) {
		int rejectReview = mapper.rejectReview(reportNo);
		
		return rejectReview;
	}

	@Override
	public List<Reviews> getRestore() {
		return mapper.getRestore();
	}

	@Override
	public int restoreReview(int reviewNo) {
		return mapper.restoreReview(reviewNo);
	}

	@Override
	public int registGoods(GoodsRegist dto) throws Exception {

	    String uploadPath = fileConfig.getGoodsUploadPath();

	    // GOODS 먼저 INSERT (번호 생성용)
	    Goods goods = Goods.builder()
	            .goodsName(dto.getGoodsName())
	            .goodsSort(dto.getGoodsSort())
	            .goodsCategory(dto.getGoodsCategory())
	            .goodsPrice(dto.getGoodsPrice())
	            .deliveryCost(dto.getDeliveryCost())
	            .goodsSeller(dto.getGoodsSeller())
	            .goodsInfo(dto.getGoodsInfo())
	            .build();

	    int result = mapper.insertGoods(goods);

	    int goodsNo = goods.getGoodsNo();
	    String category = dto.getGoodsCategory();

	    File dir = new File(uploadPath);
	    if (!dir.exists()) dir.mkdirs();

	    // 썸네일 저장 (order = 0)
	    MultipartFile thumbnail = dto.getThumbnail();

	    if (thumbnail != null && !thumbnail.isEmpty()) {

	        String ext = thumbnail.getOriginalFilename()
	                .substring(thumbnail.getOriginalFilename().lastIndexOf("."));

	        String fileName = category + "_" + goodsNo + "_0" + ext;

	        thumbnail.transferTo(new File(uploadPath + fileName));

	        GoodsImg thumbImg = GoodsImg.builder()
	                .goodsNo(goodsNo)
	                .goodsImgPath("/images/goods/")
	                .goodsImgRe(fileName)
	                .goodsImgOrder("0")
	                .build();

	        mapper.insertGoodsImg(thumbImg);
	    }

	    // 상세 이미지 (1부터 시작)
	    if (dto.getDetailImgs() != null) {

	        int order = 1;

	        for (MultipartFile img : dto.getDetailImgs()) {

	            if (!img.isEmpty()) {

	                String ext = img.getOriginalFilename()
	                        .substring(img.getOriginalFilename().lastIndexOf("."));

	                String fileName = category + "_" + goodsNo + "_" + order + ext;

	                img.transferTo(new File(uploadPath + fileName));

	                GoodsImg goodsImg = GoodsImg.builder()
	                        .goodsNo(goodsNo)
	                        .goodsImgPath("/images/goods/")
	                        .goodsImgRe(fileName)
	                        .goodsImgOrder(String.valueOf(order))
	                        .build();

	                mapper.insertGoodsImg(goodsImg);

	                order++;
	            }
	        }
	    }
	    
	    boolean hasRealOption = false;
	    int defaultStock = 0;

	    if (dto.getOptionsJson() != null && !dto.getOptionsJson().isEmpty()) {

	        ObjectMapper om = new ObjectMapper();
	        GoodsOption[] options =
	                om.readValue(dto.getOptionsJson(), GoodsOption[].class);

	        for (GoodsOption option : options) {

	            // 기본 재고 저장 (옵션 없는 경우 대비)
	            defaultStock = option.getStock();

	            // 실제 옵션인지 체크 (사이즈 or 컬러 값이 있을 때)
	            if ((option.getGoodsSize() != null && !option.getGoodsSize().isBlank())
	                    || (option.getGoodsColor() != null && !option.getGoodsColor().isBlank())) {

	                hasRealOption = true;

	                option.setGoodsNo(goodsNo);
	                mapper.insertGoodsOption(option);
	            }
	        }
	    }

	    // 옵션이 없을 경우만 NULL NULL + 입력한 재고값
	    if (!hasRealOption) {

	        GoodsOption nullOption = GoodsOption.builder()
	                .goodsNo(goodsNo)
	                .goodsSize(null)
	                .goodsColor(null)
	                .stock(defaultStock) // 프론트에서 입력한 재고 사용
	                .build();

	        mapper.insertGoodsOption(nullOption);
	    }

	    return result;
	}

	@Override
	public int updateGoods(int goodsNo, GoodsRegist dto) throws Exception {

		String uploadPath = fileConfig.getGoodsUploadPath();

		// 기본 정보 수정
		Goods goods = Goods.builder()
				.goodsNo(goodsNo)
				.goodsName(dto.getGoodsName())
				.goodsSort(dto.getGoodsSort())
				.goodsCategory(dto.getGoodsCategory())
				.goodsPrice(dto.getGoodsPrice())
				.deliveryCost(dto.getDeliveryCost())
				.goodsSeller(dto.getGoodsSeller())
				.goodsInfo(dto.getGoodsInfo())
				.build();

		int result = mapper.updateGoods(goods);
		String category = dto.getGoodsCategory();

		File dir = new File(uploadPath);
		if (!dir.exists()) dir.mkdirs();

		// 썸네일 변경 (새 파일이 있을 때만)
		MultipartFile thumbnail = dto.getThumbnail();
		if (thumbnail != null && !thumbnail.isEmpty()) {
			String ext = thumbnail.getOriginalFilename()
					.substring(thumbnail.getOriginalFilename().lastIndexOf("."));
			String fileName = category + "_" + goodsNo + "_0" + ext;
			thumbnail.transferTo(new File(uploadPath + fileName));

			// 기존 썸네일 삭제 후 재삽입
			mapper.deleteGoodsImgByOrder(goodsNo, "0");
			GoodsImg thumbImg = GoodsImg.builder()
					.goodsNo(goodsNo)
					.goodsImgPath("/images/goods/")
					.goodsImgRe(fileName)
					.goodsImgOrder("0")
					.build();
			mapper.insertGoodsImg(thumbImg);
		}

		// 상세 이미지 추가 (기존 이미지 유지 + 새 이미지 이어서 추가)
		if (dto.getDetailImgs() != null) {
			int lastOrder = mapper.selectLastDetailImgOrder(goodsNo);

			for (MultipartFile img : dto.getDetailImgs()) {
				if (!img.isEmpty()) {
					lastOrder++;
					String ext = img.getOriginalFilename()
							.substring(img.getOriginalFilename().lastIndexOf("."));
					String fileName = category + "_" + goodsNo + "_" + lastOrder + ext;
					img.transferTo(new File(uploadPath + fileName));

					GoodsImg goodsImg = GoodsImg.builder()
							.goodsNo(goodsNo)
							.goodsImgPath("/images/goods/")
							.goodsImgRe(fileName)
							.goodsImgOrder(String.valueOf(lastOrder))
							.build();
					mapper.insertGoodsImg(goodsImg);
				}
			}
		}

		// 옵션 수정 (기존 옵션 전체 삭제 후 재삽입)
		if (dto.getOptionsJson() != null && !dto.getOptionsJson().isEmpty()) {
			mapper.deleteGoodsOptions(goodsNo);

			ObjectMapper om = new ObjectMapper();
			GoodsOption[] options = om.readValue(dto.getOptionsJson(), GoodsOption[].class);

			boolean hasRealOption = false;
			int defaultStock = 0;

			for (GoodsOption option : options) {
				defaultStock = option.getStock();
				if ((option.getGoodsSize() != null && !option.getGoodsSize().isBlank())
						|| (option.getGoodsColor() != null && !option.getGoodsColor().isBlank())) {
					hasRealOption = true;
					option.setGoodsNo(goodsNo);
					mapper.insertGoodsOption(option);
				}
			}

			if (!hasRealOption) {
				GoodsOption nullOption = GoodsOption.builder()
						.goodsNo(goodsNo)
						.goodsSize(null)
						.goodsColor(null)
						.stock(defaultStock)
						.build();
				mapper.insertGoodsOption(nullOption);
			}
		}

		return result;
	}

	// 관리자용 전체 상품 조회
	@Override
	public List<Goods> getGoodsListForAdmin() {
		List<Goods> goodsList = mapper.selectAllGoodsForAdmin();
		
		for(Goods goods : goodsList) {
			goods.setGoodsThumbnail(goods.getGoodsImgPath() + goods.getGoodsImgRe());
		}
		
		return goodsList;
	}

	// 관리자용 상품 상세 조회 (goodsInfo + 이미지 + 옵션)
	@Override
	public Map<String, Object> getGoodsDetailForAdmin(int goodsNo) {
		Goods goods = mapper.selectGoodsDetailForAdmin(goodsNo);
		List<GoodsImg> images = mapper.selectGoodsImgsForAdmin(goodsNo);
		List<GoodsOption> options = mapper.selectGoodsOptionsForAdmin(goodsNo);

		Map<String, Object> result = new java.util.HashMap<>();
		result.put("goodsInfo", goods != null ? goods.getGoodsInfo() : "");
		result.put("images", images);
		result.put("options", options);
		return result;
	}

	// 상품 소프트 삭제
	@Override
	public int deleteGoods(int goodsNo) {
		return mapper.softDeleteGoods(goodsNo);
	}

	// 삭제된 상품 복구
	@Override
	public int restoreGoods(int goodsNo) {
		return mapper.restoreGoods(goodsNo);
	}

	// 상세 이미지 단건 삭제
	@Override
	public int deleteGoodsImage(int goodsImgNo) {
		return mapper.deleteGoodsImgByNo(goodsImgNo);
	}
	
	@Override
	public List<Map<String, Object>> getAllOrders(String status) {
	    return mapper.selectAllOrders(status);
	}

	@Override
	public int updateOrderStatus(int orderNo, String status) {
	    int result = mapper.updateOrderStatus(orderNo, status);
		
		if (result > 0) {
			// 주문 정보 조회 (memberNo, orderId 필요)
			Map<String, Object> orderInfo = mapper.selectOrderInfo(orderNo);
			
			if (orderInfo != null) {
				int memberNo = ((Number) orderInfo.get("MEMBER_NO")).intValue();
				String orderId = (String) orderInfo.get("ORDER_ID");
				
				// 상태별 알림 메시지
				String notiTitle = "";
				String notiContent = "";
				
				switch (status) {
					case "PAID":
						notiTitle = "결제가 완료되었습니다.";
						notiContent = "주문번호: " + orderId;
						break;
					case "PREPARING":
						notiTitle = "상품 준비 중입니다.";
						notiContent = "주문번호: " + orderId;
						break;
					case "SHIPPING":
						notiTitle = "배송이 시작되었습니다.";
						notiContent = "주문번호: " + orderId;
						break;
					case "DELIVERED":
						notiTitle = "배송이 완료되었습니다.";
						notiContent = "주문번호: " + orderId;
						break;
					case "CANCELED":
						notiTitle = "주문이 취소되었습니다.";
						notiContent = "주문번호: " + orderId;
						break;
					default:
						return result; // 알림 없이 리턴
				}
				
				// 알림 생성
				try {
					notificationService.createNotification(
						memberNo,
						"ORDER",
						notiTitle,
						notiContent,
						"/mypage/orders"
					);
					log.info("주문 상태 변경 알림 생성 - orderNo: {}, status: {}", orderNo, status);
				} catch (Exception e) {
					log.error("주문 상태 변경 알림 생성 실패", e);
				}
			}
		}
		
		return result;
	}

	@Override
	public int updateTracking(int orderNo, String deliveryCompany, String trackingNumber) {
		
		int result = mapper.updateTracking(orderNo, deliveryCompany, trackingNumber);
		
	    if (result > 0) {
			// 자동으로 SHIPPING 상태로 변경 + 알림 생성
			mapper.updateOrderStatus(orderNo, "SHIPPING");
			
			// 주문 정보 조회
			Map<String, Object> orderInfo = mapper.selectOrderInfo(orderNo);
			
			if (orderInfo != null) {
				int memberNo = ((Number) orderInfo.get("MEMBER_NO")).intValue();
				String orderId = (String) orderInfo.get("ORDER_ID");
				
				try {
					notificationService.createNotification(
						memberNo,
						"ORDER",
						"배송이 시작되었습니다.",
						"주문번호: " + orderId + "\n택배사: " + deliveryCompany,
						"/mypage/orders"
					);
					log.info("배송 시작 알림 생성 - orderNo: {}", orderNo);
				} catch (Exception e) {
					log.error("배송 시작 알림 생성 실패", e);
				}
			}
		}
		
		return result;
	}
	
	@Override
	public List<Unveiling> getUnveilingListForAdmin() {
		
		return mapper.selectAllUnveilings();
	}
	
	@Override
	public int registUnveiling(Unveiling unveiling) {

		return mapper.insertUnveiling(unveiling);
	}
	
	
}
