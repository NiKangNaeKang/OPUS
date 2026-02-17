package nknk.opus.project.member.model.service;

import java.util.Map;

import nknk.opus.project.member.model.dto.Member;

public interface MemberService {

	Member login(Member inputMember);

	void sendEmail(String email);

	boolean verifyCode(String email, String code);

	int signup(Member inputMember);

	boolean checkEmail(String email);

	int updateTel(Member inputMember);

	boolean checkTel(String tel);

	int changePw(Map<String, Object> param);

	int getActiveTransactionCount(int memberNo);

	boolean withdrawMember(int memberNo);

}
