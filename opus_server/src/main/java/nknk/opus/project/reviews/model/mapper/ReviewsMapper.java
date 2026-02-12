package nknk.opus.project.reviews.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.reviews.model.dto.Reviews;

@Mapper
public interface ReviewsMapper {
	int addReview(Reviews inputReview);
}
