package nknk.opus.project.member.model.service;

import nknk.opus.project.member.model.dto.Member;

public interface MemberService {
	
	Member login(Member inputMember);

	void sendEmail(String email);

	boolean verifyCode(String email, String code);

	int signup(Member inputMember);

	boolean checkEmail(String email);
	
}
