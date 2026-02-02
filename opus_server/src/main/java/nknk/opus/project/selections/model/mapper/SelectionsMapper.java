package nknk.opus.project.selections.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.selections.model.dto.Goods;

@Mapper
public interface SelectionsMapper {

	List<Goods> selectGoodsList();

}
