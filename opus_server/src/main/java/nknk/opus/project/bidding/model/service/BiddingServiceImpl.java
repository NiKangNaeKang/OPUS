package nknk.opus.project.bidding.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import nknk.opus.project.bidding.model.dto.BidResponse;
import nknk.opus.project.bidding.model.dto.Bidding;
import nknk.opus.project.bidding.model.mapper.BiddingMapper;
import nknk.opus.project.unveiling.model.dto.Unveiling;
import nknk.opus.project.unveiling.model.mapper.UnveilingMapper;

@Service
@Transactional(rollbackFor = Exception.class)
//@RequiredArgsConstructor
public class BiddingServiceImpl implements BiddingService{
	
	@Autowired
	private UnveilingMapper unveilingMapper;
	
	@Autowired
	private BiddingMapper biddingMapper;

	@Override
	public BidResponse placeBid(Bidding bidding) {


        // 0) 필수값 검증
        int unveilingNo = bidding.getUnveilingNo();
        
        int memberNo = bidding.getMemberNo();

        if (unveilingNo <= 0) throw new IllegalArgumentException("경매번호가 올바르지 않습니다.");
        
        if (memberNo <= 0) throw new IllegalArgumentException("회원번호가 올바르지 않습니다.");		
		
        // 1) 경매 행 잠금(동시 입찰 방지)
        Unveiling u = unveilingMapper.selectUnveilingForUpdate(unveilingNo);
        
        if (u == null) throw new IllegalArgumentException("존재하지 않는 경매입니다.");
        
        // 2) 마감 여부/상태 검증
        int finishedFl = unveilingMapper.selectIsFinished(unveilingNo);
        

        if (finishedFl == 1) {
            
        	unveilingMapper.updateStatusEnded(unveilingNo); // 경매 상태를 DB 상 'ENDED'로 전환
            
        	throw new IllegalStateException("마감된 경매입니다.");
        }

        String status = u.getUnveilingStatus();
        
        if (status == null || !"LIVE".equalsIgnoreCase(status)) { // 대소문자 구분없이 비교
            
        	throw new IllegalStateException("진행중인 경매만 응찰할 수 있습니다.");
        }

        // 3) 현재가 결정(없으면 시작가)
        int baseCurrent = (u.getCurrentPrice() > 0) ? u.getCurrentPrice() : u.getStartPrice();
        
        int maxBid = biddingMapper.selectMaxBidPrice(unveilingNo);
        
        int current = Math.max(baseCurrent, maxBid);
        
        // 4) 호가 단위 계산 + 다음 입찰가격 산출
        int nextPrice = current + calcTick(current);

        // 5) Bidding insert
        bidding.setBidPrice(nextPrice);
        
        int r1 = biddingMapper.insertBidding(bidding);
        
        if (r1 == 0) throw new IllegalStateException("응찰 저장 실패");

        // 6) Unveiling update (현재가/응찰수 증가)
        u.setCurrentPrice(nextPrice);
        
        u.setBiddingCount(u.getBiddingCount() + 1);
        
        // status 유지(LIVE)
        u.setUnveilingStatus("LIVE");

        int r2 = unveilingMapper.updateAfterBid(u);
        
        if (r2 == 0) throw new IllegalStateException("경매 반영 실패");

        // 7) 새로운 현재가 반환
        return BidResponse.builder().unveilingNo(unveilingNo)
        							.currentPrice(nextPrice)
        							.biddingCount(u.getBiddingCount())
        							.unveilingStatus(u.getUnveilingStatus())
        							.build();
	}
	
    /* 호가표: 현재가 구간 별 응찰단위
      5백만 원 미만 : 100,000
      5백만 이상 1천만 미만 : 500,000
      1천만 이상 3천만 미만 : 1,000,000
      3천만 이상 5천만 미만 : 2,000,000
      5천만 이상 : 5,000,000 */
    private int calcTick(int currentPrice) {
     
    	if (currentPrice < 5000000) return 100000;
        
    	if (currentPrice < 10000000) return 500000;
        
    	if (currentPrice < 30000000) return 1000000;
        
    	if (currentPrice < 50000000) return 2000000;
        
    	return 5000000;
    }

	
}





