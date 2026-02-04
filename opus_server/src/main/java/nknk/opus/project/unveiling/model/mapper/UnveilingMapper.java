package nknk.opus.project.unveiling.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.unveiling.model.dto.Unveiling;

@Mapper
public interface UnveilingMapper {

	Unveiling selectUnveilingForUpdate(int unveilingNo); // 입찰 직전 현재 경매 상태 정보 조회(+ 행 잠금)
																							// 동시 입찰 방지
	
	int updateAfterBid(Unveiling unveiling); // 입찰 직후 현재가, 횟수, 상태 최신화
}
