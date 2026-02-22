package nknk.opus.project.board.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import nknk.opus.project.board.model.dto.Board;
import nknk.opus.project.board.model.service.BoardService;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

	private final BoardService service;

	/* 게시글 목록 조회 */
	@GetMapping("/list/{boardTypeCode}")
	public List<Board> selectBoardList(@PathVariable("boardTypeCode") int boardTypeCode,
			@RequestParam(value = "sort", defaultValue = "latest") String sort) {
		return service.selectBoardList(boardTypeCode, sort);
	}

	/* 게시글 상세 조회 */
	@GetMapping("/detail/{boardNo}")
	public Board selectBoardDetail(@PathVariable("boardNo") int boardNo) {
		// 상세 조회 시 서비스 단에서 조회수 증가 로직을 함께 처리하도록 구성
		return service.selectBoardDetail(boardNo);
	}

	/* 게시글 등록 (이미지 최대 5개 업로드 포함) */
	@PostMapping(value = "/insert", consumes = "multipart/form-data")
	public int insertBoard(@RequestPart("board") Board board,
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {
		return service.insertBoard(board, images);
	}

	/* 게시글 수정 */
	@PutMapping("/update/{boardNo}")
	public int updateBoard(@PathVariable int boardNo, @RequestBody Board board) {
		board.setBoardNo(boardNo);
		return service.updateBoard(board);
	}

	/* 게시글 삭제 */
	@DeleteMapping("/delete/{boardNo}")
	public int deleteBoard(@PathVariable("boardNo") int boardNo) {
		return service.deleteBoard(boardNo);
	}
}