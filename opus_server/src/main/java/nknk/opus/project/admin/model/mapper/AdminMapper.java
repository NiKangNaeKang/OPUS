package nknk.opus.project.admin.model.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import nknk.opus.project.reviews.model.dto.Report;
import nknk.opus.project.selections.model.dto.Goods;
import nknk.opus.project.selections.model.dto.GoodsImg;
import nknk.opus.project.selections.model.dto.GoodsOption;
import nknk.opus.project.reviews.model.dto.Reviews;


@Mapper
public interface AdminMapper {

	List<Report> getReport();

	int hideReview(int reportNo);

	int confirmReview(int reportNo);

	int rejectReview(int reportNo);

	List<Reviews> getRestore();

	int restoreReview(int reviewNo);

	int insertGoods(Goods goods);

	void insertGoodsImg(GoodsImg goodsImg);

	void insertGoodsOption(GoodsOption option);

	int updateGoods(Goods goods);

  int deleteGoodsImgByOrder(@Param("goodsNo") int goodsNo, @Param("order") String order);

  int selectLastDetailImgOrder(int goodsNo);
	
  int deleteGoodsOptions(int goodsNo);

	List<Goods> selectAllGoodsForAdmin();

	int softDeleteGoods(int goodsNo);

	List<Map<String, Object>> selectAllOrders(@Param("status") String status);

	int updateOrderStatus(@Param("orderNo") int orderNo, 
			@Param("status") String status);

	int updateTracking(@Param("orderNo") int orderNo, 
			@Param("deliveryCompany") String deliveryCompany, 
			@Param("trackingNumber") String trackingNumber);

}
