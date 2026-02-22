package nknk.opus.project.board.controller;

import lombok.RequiredArgsConstructor;
import nknk.opus.project.board.model.dto.Board;
import nknk.opus.project.board.model.service.BoardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

	/* 게시글 등록 */
	@PostMapping("/insert")
	public int insertBoard(@RequestBody Board board) {
		return service.insertBoard(board);
	}

	/* 게시글 수정 */
	@PutMapping("/update/{boardNo}")
	public int updateBoard(@RequestBody Board board) {
		return service.updateBoard(board);
	}

	/* 게시글 삭제 */
	@DeleteMapping("/delete/{boardNo}")
	public int deleteBoard(@PathVariable("boardNo") int boardNo) {
		return service.deleteBoard(boardNo);
	}
}