package nknk.opus.project.selections.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import nknk.opus.project.selections.model.dto.Goods;
import nknk.opus.project.selections.model.mapper.SelectionsMapper;

@Transactional(rollbackFor = Exception.class)
@Service
public class SelectionsServiceImpl implements SelectionsService{
	
	@Autowired
	public SelectionsMapper mapper;

	@Override
	public List<Goods> selectGoodsList() {
		
		List<Goods> goodsList = mapper.selectGoodsList();
		
		for(Goods goods : goodsList) {
			String goodsThumbnail = goods.getGoodsImgPath() + goods.getGoodsImgRe();
			goods.setGoodsThumbnail(goodsThumbnail);
		}
		
		return goodsList;
	}

}
