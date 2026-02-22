package nknk.opus.project.board.model.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import nknk.opus.project.board.model.dto.Board;

public interface BoardService {

	List<Board> selectBoardList(int boardTypeCode, String sort);

	Board selectBoardDetail(int boardNo);

	/* 게시글 등록 (이미지 업로드 포함) */
	int insertBoard(Board board, List<MultipartFile> images);

	int updateBoard(Board board);

	int deleteBoard(int boardNo);

}
