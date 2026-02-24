package nknk.opus.project.board.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
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
import nknk.opus.project.member.model.dto.Role;

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

	/* 게시글 상세 조회 + 조회수 증가 */
	@GetMapping("/detail/{boardNo}")
	public Board selectBoardDetail(@PathVariable("boardNo") int boardNo) {
		return service.selectBoardDetail(boardNo);
	}

	/* 게시글 등록 (텍스트 + 이미지 업로드) */
	@PostMapping(value = "/insert", consumes = "multipart/form-data")
	public int insertBoard(@RequestPart("board") Board board,
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {
		return service.insertBoard(board, images);
	}

	/* 게시글 텍스트 수정 */
	@PutMapping("/update/{boardNo}")
	public int updateBoard(@PathVariable("boardNo") int boardNo, @RequestBody Board board) {
		board.setBoardNo(boardNo);
		return service.updateBoard(board);
	}

	/* 게시글 전체 수정 (텍스트 + 이미지 교체) */
	@PutMapping(value = "/update-with-images/{boardNo}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public int updateBoardWithImages(@PathVariable("boardNo") int boardNo, @RequestPart("board") Board board,
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {
		board.setBoardNo(boardNo);
		return service.updateBoardWithImages(board, images);
	}

	/* 게시글 이미지 부분 수정 (기존삭제 + 신규추가) */
	@PutMapping(value = "/update-images/{boardNo}", consumes = "multipart/form-data")
	public int updateBoardImagesPartial(@PathVariable("boardNo") int boardNo, @RequestPart("board") Board board,
			@RequestPart(value = "deleteImgNos", required = false) String deleteImgNosJson,
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {
		board.setBoardNo(boardNo);
		return service.updateBoardImagesPartial(board, deleteImgNosJson, images);
	}

	/* 게시글 삭제 (논리 삭제) */
	@DeleteMapping("/delete/{boardNo}")
	public int deleteBoard(@PathVariable("boardNo") int boardNo) {
		return service.deleteBoard(boardNo);
	}

	/* 작성 게시글 조회 (기업회원만) */
	@GetMapping("/my")
	public List<Board> selectMyBoards(Authentication authentication) {

	    if (authentication == null) {
	        throw new RuntimeException("로그인이 필요합니다.");
	    }

	    // JWT 필터에서 넣어준 memberNo 꺼내기
	    String memberNoStr = (String) authentication.getPrincipal();
	    int memberNo = Integer.parseInt(memberNoStr);

	    // 권한(role) 꺼내기
	    String role = authentication.getAuthorities()
	            .iterator().next()
	            .getAuthority();

	    if (!role.equals(Role.COMPANY.getKey())) {
	        throw new RuntimeException("기업 회원만 접근 가능합니다.");
	    }

	    return service.selectMyBoards(memberNo);
	}
}