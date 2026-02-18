package nknk.opus.project.board.model.service;

import java.util.List;

import nknk.opus.project.board.model.dto.Board;

public interface BoardService {

	List<Board> selectBoardList(int boardTypeCode, String sort);

	Board selectBoardDetail(int boardNo);

	int insertBoard(Board board);

	int updateBoard(Board board);

	int deleteBoard(int boardNo);

}
