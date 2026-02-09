package nknk.opus.project.bidding.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.bidding.model.dto.Bidding;

@Mapper
public interface BiddingMapper {
	
	int insertBidding(Bidding bidding);

}
