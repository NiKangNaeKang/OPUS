package nknk.opus.project.bidding.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import nknk.opus.project.bidding.model.dto.Bidding;
import nknk.opus.project.bidding.model.dto.RecentBidResponse;

@Mapper
public interface BiddingMapper {
	
	int insertBidding(Bidding bidding);
	
	List<RecentBidResponse> selectRecentBiddings(@Param("unveilingNo") int unveilingNo,
												 @Param("limit") int limit);
	
	int selectMaxBidPrice(int unveilingNo);
	
	Bidding selectTopBid(int unveilingNo);

}
