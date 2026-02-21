package nknk.opus.project.unveiling.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.unveiling.model.dto.Unveiling;

@Mapper
public interface UnveilingMapper {

	Unveiling selectUnveilingForUpdate(int unveilingNo); // 입찰 직전 현재 경매 상태 정보 조회(+ 행 잠금)
																							// 동시 입찰 방지
	
	int updateAfterBid(Unveiling unveiling); // 입찰 직후 현재가, 횟수, 상태 최신화
	
	Unveiling selectUnveilingDetail(int unveilingNo); // 화면 조회 용도
	
	int selectIsFinished(int unveilingNo); // 경매 마감 여부 조회 용도
	
	int updateStatusEnded(int unveilingNo); // 경매 상태 변경(종료) 용도
	
	int finalizeAuctionUsingMemberNo(Unveiling u);
	
	int markPaid(int unveilingNo);
	
	int selectIsPaymentExpired(int unveilingNo);
	
	int markPaymentExpired(int unveilingNo);

	List<Unveiling> selectUnveilingList();
}
