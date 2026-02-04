package nknk.opus.project.bidding.model.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
public class BiddingServiceImpl implements BiddingService{

}
