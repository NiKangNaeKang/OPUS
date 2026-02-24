package nknk.opus.project.admin.model.service;

import java.util.List;

import nknk.opus.project.reviews.model.dto.Report;
import nknk.opus.project.reviews.model.dto.Reviews;


public interface AdminService {

	List<Report> getReport();

	int confirmReview(int reportNo);

	int rejectReview(int reportNo);

	List<Reviews> getRestore();

	int restoreReview(int reviewNo);
	
}
