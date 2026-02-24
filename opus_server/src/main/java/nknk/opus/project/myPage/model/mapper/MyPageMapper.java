package nknk.opus.project.myPage.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.reviews.model.dto.Reviews;

@Mapper
public interface MyPageMapper {

	List<String> getSavedList(int memberNo);

	List<Reviews> getReviewList(int memberNo);

	List<String> getLikeList(int memberNo);

}
