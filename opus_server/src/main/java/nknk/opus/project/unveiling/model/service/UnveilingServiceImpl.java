package nknk.opus.project.unveiling.model.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import nknk.opus.project.bidding.model.dto.BidStateResponse;
import nknk.opus.project.bidding.model.dto.Bidding;
import nknk.opus.project.bidding.model.dto.RecentBidResponse;
import nknk.opus.project.bidding.model.mapper.BiddingMapper;
import nknk.opus.project.unveiling.model.dto.Unveiling;
import nknk.opus.project.unveiling.model.mapper.UnveilingMapper;

@Service
@Transactional(rollbackFor = Exception.class)
public class UnveilingServiceImpl implements UnveilingService{
	
	@Autowired
	private UnveilingMapper unveilingMapper;

	@Autowired
	private BiddingMapper biddingMapper;
	
	@Override
	public List<Unveiling> getList() {
		
		return unveilingMapper.selectUnveilingList();
	}
	
	@Override
	public Unveiling getDetail(int unveilingNo) {

		Unveiling u = unveilingMapper.selectUnveilingDetail(unveilingNo);
		
		if(u == null) throw new IllegalArgumentException("존재하지 않는 경매입니다.");
		
		return u;
	}
	
	@Override
	public List<RecentBidResponse> getRecentBiddings(int unveilingNo, int limit) {

        // 경매 존재 검증 (이미 패턴이 getDetail에 있음)
        Unveiling u = unveilingMapper.selectUnveilingDetail(unveilingNo);
        
        if (u == null) throw new IllegalArgumentException("존재하지 않는 경매입니다.");

        // limit 방어 (너무 큰 값 막기)
        if (limit <= 0) limit = 10;
        if (limit > 50) limit = 50;

        List<RecentBidResponse> list = biddingMapper.selectRecentBiddings(unveilingNo, limit);

        // 익명 라벨 부여 (최근순)
        for (int i = 0; i < list.size(); i++) {
            
        	list.get(i).setBidderLabel("익명 " + (i + 1));
        }

        return list;
	}
	
	@Override
	public BidStateResponse getBidState(int unveilingNo) {

	    Unveiling u = unveilingMapper.selectUnveilingDetail(unveilingNo);
	    
	    if (u == null) throw new IllegalArgumentException("존재하지 않는 경매입니다.");

	    int finishedFlag = unveilingMapper.selectIsFinished(unveilingNo);
	    
	    boolean finishedFl = (finishedFlag == 1);

	    String status = u.getUnveilingStatus();
	    
	    boolean live = (status != null && "LIVE".equalsIgnoreCase(status));

	    boolean bidAllowedFl = live && !finishedFl;

	    int startPrice = u.getStartPrice();
	    
	    int currentPrice = (u.getCurrentPrice() > 0) ? u.getCurrentPrice() : startPrice;
	    
	    int tick = calcTick(currentPrice);

	    int nextBidPrice = bidAllowedFl ? (currentPrice + tick) : 0;

	    String reason = null;
	    if (!bidAllowedFl) {
	        if (finishedFl) reason = "마감된 경매입니다.";
	        else reason = "진행중인 경매만 응찰할 수 있습니다.";
	    }
	    
	    int finalizedFl = u.getFinalizedFl();
	    
	    int winnerMemberNo = u.getMemberNo();
	    
	    String paymentStatus = (u.getPaymentStatus() == null) ? "NONE" : u.getPaymentStatus();

	    return BidStateResponse.builder()
	            .unveilingNo(unveilingNo)
	            .startPrice(startPrice)
	            .currentPrice(currentPrice)
	            .biddingCount(u.getBiddingCount())
	            .unveilingStatus(u.getUnveilingStatus())
	            .finishedFl(finishedFl)
	            .bidAllowedFl(bidAllowedFl)
	            .reason(reason)
	            .tick(tick)
	            .nextBidPrice(nextBidPrice)
	            .finalizedFl(finalizedFl)
	            .winnerMemberNo(winnerMemberNo)
	            .paymentStatus(paymentStatus)
	            .build();
	}
	
	/* BiddingServiceImpl과 동일 호가 정책 */
	private int calcTick(int currentPrice) {
		
	    if (currentPrice < 5000000) return 100000;
	    
	    if (currentPrice < 10000000) return 500000;
	    
	    if (currentPrice < 30000000) return 1000000;
	    
	    if (currentPrice < 50000000) return 2000000;
	    
	    return 5000000;
	}
	
	@Override
	public Map<String, Object> finalizeAuction(int unveilingNo) {
	    
		Unveiling u = unveilingMapper.selectUnveilingForUpdate(unveilingNo);
		
	    if (u == null) throw new IllegalArgumentException("존재하지 않는 경매입니다.");
	    
	    int finishedFl = unveilingMapper.selectIsFinished(unveilingNo);
	    
	    if(finishedFl == 1
	    		&& (u.getUnveilingStatus() == null
	    		|| !"ENDED".equalsIgnoreCase(u.getUnveilingStatus()))) {
	    	
	    	unveilingMapper.updateStatusEnded(unveilingNo);
	    	
	    	u.setUnveilingStatus("ENDED");
	    }

	    if (u.getUnveilingStatus() == null || !"ENDED".equalsIgnoreCase(u.getUnveilingStatus())) {
	        
	    	throw new IllegalStateException("종료된 경매만 낙찰 확정할 수 있습니다.");
	    }

	    if (u.getFinalizedFl() == 1) { // 멱등
	        
	    	String paymentStatus = (u.getPaymentStatus() == null) ? "NONE" : u.getPaymentStatus();
	    	
	    	return Map.of(
	            "unveilingNo", unveilingNo,
	            "finalizedFl", true,
	            "winnerMemberNo", u.getMemberNo(),   // ✅ UNVEILING.MEMBER_NO = 낙찰자
	            "finalPrice", u.getFinalPrice(),
	            "paymentStatus", paymentStatus
	        );
	    }

	    Bidding top = biddingMapper.selectTopBid(unveilingNo);
	    
	    if (top == null) throw new IllegalStateException("입찰이 없어 낙찰자를 확정할 수 없습니다.");

	    // ✅ 낙찰자 = UNVEILING.MEMBER_NO
	    u.setMemberNo(top.getMemberNo());
	    u.setFinalPrice(top.getBidPrice());

	    int r = unveilingMapper.finalizeAuctionUsingMemberNo(u);
	    if (r == 0) throw new IllegalStateException("낙찰 확정 처리에 실패했습니다.");

	    return Map.of(
	        "unveilingNo", unveilingNo,
	        "finalizedFl", true,
	        "winnerMemberNo", top.getMemberNo(),
	        "finalPrice", top.getBidPrice(),
	        "paymentStatus", "PENDING"
	    );
	}
	
	@Override
	public Map<String, Object> mockPay(int unveilingNo, int memberNo) {
	    
        if (unveilingNo <= 0) {
            return Map.of("statusCode", 400, "message", "경매번호가 올바르지 않습니다.", "unveilingNo", unveilingNo);
        }
        if (memberNo <= 0) {
            return Map.of("statusCode", 400, "message", "회원번호가 올바르지 않습니다.", "unveilingNo", unveilingNo);
        }

        // ✅ 락으로 정합성 확보
        Unveiling u = unveilingMapper.selectUnveilingForUpdate(unveilingNo);
        if (u == null) {
            return Map.of("statusCode", 404, "message", "존재하지 않는 경매입니다.", "unveilingNo", unveilingNo);
        }

        // 낙찰 확정 전이면 결제 불가
        if (u.getFinalizedFl() != 1) {
            return Map.of("statusCode", 409, "message", "낙찰 확정 후 결제할 수 있습니다.", "unveilingNo", unveilingNo);
        }

        // 낙찰자만 결제 가능
        if (u.getMemberNo() <= 0 || u.getMemberNo() != memberNo) {
            return Map.of("statusCode", 409, "message", "낙찰자만 결제할 수 있습니다.", "unveilingNo", unveilingNo);
        }

        String paymentStatus = (u.getPaymentStatus() == null) ? "NONE" : u.getPaymentStatus();

        // 이미 만료면 만료 응답(업데이트 불필요)
        if ("EXPIRED".equalsIgnoreCase(paymentStatus)) {
            return Map.of("statusCode", 409, "message", "결제 기한이 만료되었습니다.", "unveilingNo", unveilingNo, "paymentStatus", "EXPIRED");
        }

        // ✅ PENDING인데 기한 초과면: DB를 EXPIRED로 업데이트하고 "정상 반환" (커밋됨)
        int expiredFl = unveilingMapper.selectIsPaymentExpired(unveilingNo);
        if (expiredFl == 1) {
            unveilingMapper.markPaymentExpired(unveilingNo);

            return Map.of(
                    "statusCode", 409,
                    "message", "결제 기한이 만료되었습니다.",
                    "unveilingNo", unveilingNo,
                    "paymentStatus", "EXPIRED"
            );
        }

        // 결제 가능한 상태는 PENDING만
        if (!"PENDING".equalsIgnoreCase(paymentStatus)) {
            return Map.of("statusCode", 409, "message", "결제 가능한 상태가 아닙니다.", "unveilingNo", unveilingNo, "paymentStatus", paymentStatus);
        }

        // ✅ 결제 완료 처리
        int r = unveilingMapper.markPaid(unveilingNo);
        if (r == 0) {
            return Map.of("statusCode", 500, "message", "결제 처리에 실패했습니다.", "unveilingNo", unveilingNo);
        }

        return Map.of(
                "statusCode", 200,
                "message", "결제가 완료되었습니다.",
                "unveilingNo", unveilingNo,
                "paymentStatus", "PAID"
        );
    }
	
	
}





