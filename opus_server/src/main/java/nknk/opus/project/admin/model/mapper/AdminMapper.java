package nknk.opus.project.admin.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.reviews.model.dto.Report;


@Mapper
public interface AdminMapper {

	List<Report> getReport();

	int confirmReview(int reportNo);

	int cancleReview(int reportNo);

	int updateReviewDelFl(int reportNo);

}
