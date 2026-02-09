package nknk.opus.project.bidding.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nknk.opus.project.bidding.model.dto.BidResponse;
import nknk.opus.project.bidding.model.dto.Bidding;
import nknk.opus.project.bidding.model.service.BiddingService;

@RestController
@RequestMapping("/api/bids")
public class BiddingController {

	@Autowired
	private BiddingService biddingService;
	
    @PostMapping
    public ResponseEntity<BidResponse> placeBid(@RequestBody Bidding bidding) {
    	
        bidding.setBidNo(0);
        bidding.setBidPrice(0);
        bidding.setBidDate(null);

        BidResponse res = biddingService.placeBid(bidding);
       
        return ResponseEntity.ok(res);
    }	

    
    
}







