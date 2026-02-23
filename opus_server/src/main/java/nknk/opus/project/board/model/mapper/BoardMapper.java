package nknk.opus.project.board.model.mapper;

import nknk.opus.project.board.model.dto.Board;
import nknk.opus.project.board.model.dto.BoardImg;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface BoardMapper {
	List<Board> selectBoardList(@Param("boardTypeCode") int boardTypeCode, @Param("sort") String sort);

	Board selectBoardDetail(@Param("boardNo") int boardNo);

	List<BoardImg> selectBoardImageList(@Param("boardNo") int boardNo);

	int updateViewCount(@Param("boardNo") int boardNo);

	int insertBoard(Board board);

	int insertImageLines(@Param("list") List<BoardImg> uploadList);

	int updateBoard(Board board);

	int deleteBoard(@Param("boardNo") int boardNo);
}