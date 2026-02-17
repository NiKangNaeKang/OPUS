package nknk.opus.project.member.model.dto;

import nknk.opus.project.member.model.dto.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
	private int authorLevel; // 기존 권한 레벨 (숫자)
	private String withdrawalDate;

	private Role memberRole; // Role.USER, Role.COMPANY 등으로 관리
	private String memberName; // 구글에서 받아올 이름 저장용

}
