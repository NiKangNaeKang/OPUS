package nknk.opus.project.admin.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import nknk.opus.project.admin.model.mapper.AdminMapper;
import nknk.opus.project.reviews.model.dto.Report;

@Service
@Transactional(rollbackFor = Exception.class)
public class AdminServiceImpl implements AdminService {

	@Autowired
	private AdminMapper mapper;

	@Override
	public List<Report> getReport() {
		return mapper.getReport();
	}
}
