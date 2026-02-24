package nknk.opus.project.admin.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import nknk.opus.project.admin.model.mapper.AdminMapper;
import nknk.opus.project.reviews.model.dto.Report;
import nknk.opus.project.reviews.model.dto.Reviews;

@Service
@Transactional(rollbackFor = Exception.class)
public class AdminServiceImpl implements AdminService {

	@Autowired
	private AdminMapper mapper;

	@Override
	public List<Report> getReport() {
		return mapper.getReport();
	}

	@Override
	public int confirmReview(int reportNo) {
		int hideReview = mapper.hideReview(reportNo);
		int confirmResult = mapper.confirmReview(reportNo);
		
		return hideReview * confirmResult;
	}

	@Override
	public int rejectReview(int reportNo) {
		int rejectReview = mapper.rejectReview(reportNo);
		
		return rejectReview;
	}

	@Override
	public List<Reviews> getRestore() {
		return mapper.getRestore();
	}

	@Override
	public int restoreReview(int reviewNo) {
		return mapper.restoreReview(reviewNo);
	}
}
