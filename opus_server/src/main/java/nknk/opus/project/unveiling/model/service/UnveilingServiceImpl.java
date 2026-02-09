package nknk.opus.project.unveiling.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import nknk.opus.project.unveiling.model.dto.Unveiling;
import nknk.opus.project.unveiling.model.mapper.UnveilingMapper;

@Service
@Transactional(rollbackFor = Exception.class)
public class UnveilingServiceImpl implements UnveilingService{
	
	@Autowired
	private UnveilingMapper unveilingMapper;

	@Override
	public Unveiling getDetail(int unveilingNo) {

		Unveiling u = unveilingMapper.selectUnveilingDetail(unveilingNo);
		
		if(u == null) throw new IllegalArgumentException("존재하지 않는 경매입니다.");
		
		return u;
	}
}
