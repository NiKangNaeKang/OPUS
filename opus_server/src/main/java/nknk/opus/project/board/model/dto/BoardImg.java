package nknk.opus.project.board.model.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BoardImg {

    private int boardImgNo;
    private int boardNo;
    private String boardImgPath;   // /images/board/
    private String boardImgOg;     // 원본명
    private String boardImgRe;     // 변경명
    private int boardImgOrder;     // 1~5

    // DB 컬럼 X (조합용)
    private String boardImgFullpath;
}