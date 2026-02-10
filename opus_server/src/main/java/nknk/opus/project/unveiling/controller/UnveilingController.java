package nknk.opus.project.unveiling.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import nknk.opus.project.bidding.model.dto.BidStateResponse;
import nknk.opus.project.bidding.model.dto.RecentBidResponse;
import nknk.opus.project.unveiling.model.dto.Unveiling;
import nknk.opus.project.unveiling.model.service.UnveilingService;

@RestController
//@CrossOrigin
@RequestMapping("/api/unveilings")
public class UnveilingController {
	
	@Autowired
	private UnveilingService unveilingService;
	
	@GetMapping("/{unveilingNo}")
	public ResponseEntity<Unveiling> detail(@PathVariable("unveilingNo") int unveilingNo) {
		return ResponseEntity.ok(unveilingService.getDetail(unveilingNo));
	}
	
	@GetMapping("/{unveilingNo}/biddings")
	public ResponseEntity<List<RecentBidResponse>> recentBiddings(
										@PathVariable("unveilingNo") int unveilingNo,
										@RequestParam(value="limit", defaultValue="10") int limit) {
		
	    return ResponseEntity.ok(unveilingService.getRecentBiddings(unveilingNo, limit));
	}

	@GetMapping("/{unveilingNo}/bid-state")
	public ResponseEntity<BidStateResponse> bidState(@PathVariable("unveilingNo") int unveilingNo) {
	    return ResponseEntity.ok(unveilingService.getBidState(unveilingNo));
	}
	
	@PostMapping("/{unveilingNo}/finalize")
	public ResponseEntity<Map<String, Object>> finalize(@PathVariable("unveilingNo") int unveilingNo) {
		
	    return ResponseEntity.ok(unveilingService.finalizeAuction(unveilingNo));
	}

	@PostMapping("/{unveilingNo}/pay")
	public ResponseEntity<Map<String, Object>> pay(@PathVariable("unveilingNo") int unveilingNo,
        										   @RequestBody Map<String, Integer> body) {
	    
		Integer memberNo = body.get("memberNo");
	    return ResponseEntity.ok(unveilingService.mockPay(unveilingNo, memberNo == null ? 0 : memberNo));
	}
	
	
	
}






