package nknk.opus.project.board.model.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nknk.opus.project.board.model.dto.Board;
import nknk.opus.project.board.model.dto.BoardImg;
import nknk.opus.project.board.model.mapper.BoardMapper;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
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

	@Override
	public Board selectBoardDetail(int boardNo) {
		// 1) 조회수 증가
		int result = mapper.updateViewCount(boardNo);

		// 2) 상세 조회
		if (result > 0) {
			return mapper.selectBoardDetail(boardNo);
		}
		return null;
	}

	/* 게시글 등록 + 이미지 업로드 */
	@Override
	public int insertBoard(Board board, List<MultipartFile> images) {

		// 1) 게시글 insert
		int result = mapper.insertBoard(board);
		if (result <= 0)
			return 0;

		int boardNo = board.getBoardNo();

		// 2) 이미지 없으면 게시글만 성공
		if (images == null || images.isEmpty())
			return 1;

		// 3) 폴더 준비
		File dir = new File(folderPath);
		if (!dir.exists())
			dir.mkdirs();

		// 4) 업로드 목록 + 저장된 파일 추적(예외시 삭제)
		List<BoardImg> uploadList = new ArrayList<>();
		List<String> savedFiles = new ArrayList<>();

		// 팀플 수준 체크
		List<String> allowedExts = Arrays.asList(".jpg", ".jpeg", ".png", ".gif", ".webp");
		long maxSize = 10 * 1024 * 1024; // 10MB

		try {
			for (MultipartFile file : images) {
				if (file == null || file.isEmpty())
					continue;

				// 용량 체크
				if (file.getSize() > maxSize) {
					throw new RuntimeException("10MB 이하의 이미지만 업로드 가능합니다.");
				}

				// 확장자 체크
				String originalName = file.getOriginalFilename();
				String ext = "";
				if (originalName != null && originalName.lastIndexOf(".") != -1) {
					ext = originalName.substring(originalName.lastIndexOf(".")).toLowerCase();
				}

				if (!allowedExts.contains(ext)) {
					throw new RuntimeException("이미지 파일(.jpg, .png, .gif, .webp)만 업로드 가능합니다.");
				}

				// rename 생성
				String rename = UUID.randomUUID().toString().replace("-", "") + ext;

				// order는 실제 업로드된 순서 기준(빈 파일 있어도 안 꼬임)
				int order = uploadList.size();

				BoardImg img = BoardImg.builder().boardNo(boardNo).boardImgPath(webPath).boardImgOg(originalName)
						.boardImgRe(rename).boardImgOrder(order).build();

				// 물리 저장
				file.transferTo(new File(dir, rename));
				savedFiles.add(rename);

				uploadList.add(img);
			}

			// 5) DB insert
			if (!uploadList.isEmpty()) {
				int imgResult = mapper.insertImageLines(uploadList);
				if (imgResult != uploadList.size()) {
					throw new RuntimeException("이미지 DB 저장 실패");
				}
			}

			return 1;

		} catch (Exception e) {
			// 예외 시 저장된 파일 삭제 (DB는 트랜잭션 롤백)
			for (String rename : savedFiles) {
				try {
					File f = new File(dir, rename);
					if (f.exists())
						f.delete();
				} catch (Exception ignore) {
				}
			}

			log.error("게시글 등록 실패: {}", e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
	}

	@Override
	public int updateBoard(Board board) {
		return mapper.updateBoard(board);
	}

	@Override
	public int deleteBoard(int boardNo) {
		return mapper.deleteBoard(boardNo);
	}
}