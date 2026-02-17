package nknk.opus.project.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Member {
	private int memberNo;
	private String memberEmail;
	private String memberPw;
	private String memberTel;
	private String enrollDate;
	private String memberDelFl;
	private int authorLevel;
	private String withdrawalDate;
}
