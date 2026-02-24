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

import nknk.opus.project.admin.model.dto.GoodsRegist;
import nknk.opus.project.admin.model.mapper.AdminMapper;
import nknk.opus.project.common.config.FileConfig;
import nknk.opus.project.reviews.model.dto.Report;
import nknk.opus.project.selections.model.dto.Goods;
import nknk.opus.project.selections.model.dto.GoodsImg;
import nknk.opus.project.selections.model.dto.GoodsOption;

@Service
@Transactional(rollbackFor = Exception.class)
public class AdminServiceImpl implements AdminService {

	@Autowired
	private AdminMapper mapper;

	@Autowired
	private FileConfig fileConfig;

	@Override
	public List<Report> getReport() {
		return mapper.getReport();
	}

	@Override
	public int confirmReview(int reportNo) {
		return mapper.confirmReview(reportNo);
	}

	@Override
	public int cancleReview(int reportNo) {
		int updateReviewDelFl = mapper.updateReviewDelFl(reportNo);
		int cancleReview = mapper.cancleReview(reportNo);

		return updateReviewDelFl * cancleReview;
	}

	@Override
	public int registGoods(GoodsRegist dto) throws Exception {

	    String uploadPath = fileConfig.getGoodsUploadPath();

	    // 1️⃣ GOODS 먼저 INSERT (번호 생성용)
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

	    // 2️⃣ 썸네일 저장 (order = 0)
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

	    // 3️⃣ 상세 이미지 (1부터 시작)
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

	// 관리자용 전체 상품 조회
	@Override
	public List<Goods> getGoodsListForAdmin() {
		return mapper.selectAllGoodsForAdmin();
	}

	// 상품 소프트 삭제
	@Override
	public int deleteGoods(int goodsNo) {
		return mapper.softDeleteGoods(goodsNo);
	}
	
	@Override
	public List<Map<String, Object>> getAllOrders(String status) {
	    return mapper.selectAllOrders(status);
	}

	@Override
	public int updateOrderStatus(int orderNo, String status) {
	    return mapper.updateOrderStatus(orderNo, status);
	}

	@Override
	public int updateTracking(int orderNo, String deliveryCompany, String trackingNumber) {
	    int result = mapper.updateTracking(orderNo, deliveryCompany, trackingNumber);
	    // 송장 입력 시 자동으로 SHIPPING 상태로 변경
	    mapper.updateOrderStatus(orderNo, "SHIPPING");
	    return result;
	}
	
}
