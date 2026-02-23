package nknk.opus.project.admin.model.service;

import java.util.List;

import nknk.opus.project.reviews.model.dto.Report;


public interface AdminService {

	List<Report> getReport();

	int confirmReview(int reportNo);

	int cancleReview(int reportNo);
	
}
