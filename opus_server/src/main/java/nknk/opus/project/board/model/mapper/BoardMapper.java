package nknk.opus.project.board.model.mapper;

import nknk.opus.project.board.model.dto.Board;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface BoardMapper {
    List<Board> selectBoardList(@Param("boardTypeCode") int boardTypeCode, @Param("sort") String sort);
    
    Board selectBoardDetail(int boardNo);
    
    int updateViewCount(int boardNo);
    
    int insertBoard(Board board);
    
    int updateBoard(Board board);
    
    int deleteBoard(int boardNo);
}