package nknk.opus.project.reviews.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import nknk.opus.project.reviews.model.dto.Reviews;
import nknk.opus.project.reviews.model.mapper.ReviewsMapper;

@Service
@Transactional(rollbackFor = Exception.class)
public class ReviewsServiceImpl implements ReviewsService {
	
	@Autowired
	private ReviewsMapper mapper;

	@Override
	public int addReview(Reviews inputReview) {
		return mapper.addReview(inputReview);
	}

}
