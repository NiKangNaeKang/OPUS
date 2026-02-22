package nknk.opus.project.board.model.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import nknk.opus.project.board.model.dto.Board;
import nknk.opus.project.board.model.dto.BoardImg;
import nknk.opus.project.board.model.mapper.BoardMapper;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

	private final BoardMapper mapper;

	@Value("${opus.board.folder-path}")
	private String folderPath;

	@Value("${opus.board.web-path}")
	private String webPath;

	@Override
	public List<Board> selectBoardList(int boardTypeCode, String sort) {
		return mapper.selectBoardList(boardTypeCode, sort);
	}

	// 조회수 증가와 상세 조회를 하나의 트랜잭션으로 처리 (예외 발생 시 롤백)
	@Transactional(rollbackFor = Exception.class)
	@Override
	public Board selectBoardDetail(int boardNo) {
		// 1. 조회수 증가
		int result = mapper.updateViewCount(boardNo);

		// 2. 상세 내용 조회 (조회수 증가 성공 시에만 조회)
		if (result > 0) {
			return mapper.selectBoardDetail(boardNo);
		}
		return null;
	}

	/* 게시글 등록 + 이미지 업로드 */
	@Transactional(rollbackFor = Exception.class)
	@Override
	public int insertBoard(Board board, List<MultipartFile> images) {

		// 1. 게시글 먼저 저장 (boardNo 생성됨)
		int result = mapper.insertBoard(board);

		if (result <= 0)
			return result;

		int boardNo = board.getBoardNo();

		// 2. 이미지 없으면 종료
		if (images == null || images.isEmpty()) {
			return result;
		}

		File dir = new File(folderPath);
		if (!dir.exists())
			dir.mkdirs();

		int order = 1;

		try {
			for (MultipartFile file : images) {

				if (file.isEmpty() || order > 5)
					continue;

				String origin = file.getOriginalFilename();

				String ext = "";
				if (origin != null && origin.lastIndexOf(".") != -1) {
					ext = origin.substring(origin.lastIndexOf("."));
				}

				String rename = UUID.randomUUID().toString().replace("-", "") + ext;

				// 실제 파일 저장
				file.transferTo(new File(dir, rename));

				// DB 저장
				BoardImg img = new BoardImg();
				img.setBoardNo(boardNo);
				img.setBoardImgPath(webPath);
				img.setBoardImgOg(origin);
				img.setBoardImgRe(rename);
				img.setBoardImgOrder(order);

				mapper.insertBoardImg(img);

				order++;
			}
		} catch (Exception e) {
			throw new RuntimeException("이미지 저장 실패", e);
		}

		return result;
	}

	@Transactional(rollbackFor = Exception.class)
	@Override
	public int updateBoard(Board board) {
		return mapper.updateBoard(board);
	}

	@Transactional(rollbackFor = Exception.class)
	@Override
	public int deleteBoard(int boardNo) {
		return mapper.deleteBoard(boardNo);
	}
}