package nknk.opus.project.member.model.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import nknk.opus.project.member.model.dto.Member;
import nknk.opus.project.member.model.mapper.MemberMapper;

@Service
public class MemberServiceImpl implements MemberService {

	@Autowired
	private MemberMapper mapper;

	@Autowired
	private BCryptPasswordEncoder encoder;

	@Autowired
	private JavaMailSender mailSender;

	// 인증번호를 임시로 저장할 맵 (이메일 : 인증번호)
	private Map<String, String> authStorage = new HashMap<>();

	/**
	 * 로그인 서비스
	 * 
	 * @param inputMember (이메일, 비밀번호)
	 * @return 로그인된 회원 정보 (비밀번호 제외)
	 */
	@Override
	public Member login(Member inputMember) {

		// 1. 전달받은 이메일로 DB에서 회원 정보 조회
		Member loginMember = mapper.login(inputMember.getMemberEmail());

		// 2. 일치하는 회원이 없는 경우
		if (loginMember == null)
			return null;

		// 3. 비밀번호 대조 (평문 PW와 암호화된 PW 비교)
		// inputMember.getMemberPw() : 사용자가 입력한 비번
		// loginMember.getMemberPw() : DB에 저장된 암호화된 비번
		if (!encoder.matches(inputMember.getMemberPw(), loginMember.getMemberPw())) {
			return null;
		}

		// 4. 로그인 성공 시 보안을 위해 결과 객체에서 비밀번호 제거
		loginMember.setMemberPw(null);

		return loginMember;
	}

	/* 이메일 중복 체크 */
	@Override
	public boolean checkEmail(String email) {
		// 비밀번호 비교 없이 이메일 존재 여부만 확인
		Member member = mapper.login(email);
		return member != null;
	}

	/* 회원가입 인증 이메일 발송 */
	@Override
	public void sendEmail(String email) {

		// 1. 이미 가입된 이메일인지 확인
		if (checkEmail(email)) {
			throw new RuntimeException("사용 중인 이메일입니다.");
		}

		// 2. 6자리 랜덤 인증번호 생성
		String code = String.format("%06d", new Random().nextInt(1000000));
		authStorage.put(email, code);

		// 3. 메일 발송 설정
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(email);
		message.setSubject("[OPUS] 회원가입을 위한 인증번호 안내");
		message.setText("안녕하세요, OPUS입니다. 요청하신 인증번호는 [" + code + "] 입니다.");

		mailSender.send(message);
	}

	/* 이메일 인증번호 검증 */
	@Override
	public boolean verifyCode(String email, String code) {
		String savedCode = authStorage.get(email);
		return savedCode != null && savedCode.equals(code);
	}

	/**
	 * 회원가입 서비스
	 * 
	 * @param inputMember (이메일, 평문 비밀번호, 전화번호 등)
	 * @return 성공 시 1, 실패 시 0
	 */
	@Transactional(rollbackFor = Exception.class)
	@Override
	public int signup(Member inputMember) {

		// 1. 비밀번호 유효성 검사 (영문, 숫자 포함 8~16자)
		String pw = inputMember.getMemberPw();
		String pwRegex = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,16}$";

		if (pw == null || !pw.matches(pwRegex)) {
			throw new RuntimeException("비밀번호는 영문, 숫자를 포함하여 8~16자여야 합니다.");
		}

		// 2. 비밀번호 암호화 후 DTO에 다시 세팅
		inputMember.setMemberPw(encoder.encode(pw));

		// 3. DB 삽입 및 결과 반환
		return mapper.signup(inputMember);
	}
}