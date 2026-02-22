package nknk.opus.project.board.model.service;

import lombok.RequiredArgsConstructor;
import nknk.opus.project.board.model.dto.Board;
import nknk.opus.project.board.model.mapper.BoardMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardServiceImpl implements BoardService {

	private final BoardMapper mapper;

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

	@Transactional(rollbackFor = Exception.class)
	@Override
	public int insertBoard(Board board) {
		return mapper.insertBoard(board);
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