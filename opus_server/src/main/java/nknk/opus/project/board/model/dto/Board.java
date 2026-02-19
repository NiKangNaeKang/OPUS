package nknk.opus.project.board.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Board {
	private int boardNo;
	private int boardTypeCode;
	private int memberNo;
	private String boardTitle;
	private String boardContent;
	private String boardWriteDate;
	private String boardCategory;
	private String boardDelFl;
	private String boardUpdateDate;
	private int boardViewCount;
	private String writerCompany;
	private String boardTypeName;
}