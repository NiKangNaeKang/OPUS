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

	private Map<String, String> authStorage = new HashMap<>();

	/* 로그인 */
	@Override
	public Member login(Member inputMember) {
		Member loginMember = mapper.login(inputMember.getMemberEmail());

		if (loginMember == null)
			return null;

		if (!encoder.matches(inputMember.getMemberPw(), loginMember.getMemberPw())) {
			return null;
		}

		loginMember.setMemberPw(null);

		return loginMember;
	}

	/* 연락처 중복 체크 */
	@Override
	public boolean checkTel(String tel) {
		return mapper.checkTel(tel) > 0;
	}

	/* 이메일 중복 체크 */
	@Override
	public boolean checkEmail(String email) {
		Member member = mapper.login(email);
		return member != null;
	}

	/* 이메일 인증번호 발송 */
	@Override
	public void sendEmail(String email) {
		if (checkEmail(email)) {
			throw new RuntimeException("사용 중인 이메일입니다.");
		}

		String code = String.format("%06d", new Random().nextInt(1000000));
		authStorage.put(email, code);

		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(email);
		message.setSubject("[OPUS] 회원가입을 위한 인증번호 안내");
		message.setText("안녕하세요, OPUS입니다. 요청하신 인증번호는 [" + code + "] 입니다.");

		mailSender.send(message);
	}

	/* 이메일 인증번호 확인 */
	@Override
	public boolean verifyCode(String email, String code) {
		String savedCode = authStorage.get(email);
		return savedCode != null && savedCode.equals(code);
	}

	/* 회원가입 서비스 */
	@Transactional(rollbackFor = Exception.class)
	@Override
	public int signup(Member inputMember) {
		String pw = inputMember.getMemberPw();
		String pwRegex = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,16}$";

		if (pw == null || !pw.matches(pwRegex)) {
			throw new RuntimeException("비밀번호는 영문, 숫자를 포함하여 8~16자여야 합니다.");
		}

		inputMember.setMemberPw(encoder.encode(pw));

		return mapper.signup(inputMember);
	}

	/* 연락처 수정 */
	@Transactional(rollbackFor = Exception.class)
	@Override
	public int updateTel(Member inputMember) {
		return mapper.updateTel(inputMember);
	}

	/* 비밀번호 변경 */
	@Transactional(rollbackFor = Exception.class)
	@Override
	public int changePw(Map<String, Object> param) {
		int memberNo = Integer.parseInt(String.valueOf(param.get("memberNo")));
		String currentPw = (String) param.get("currentPw");
		String newPw = (String) param.get("newPw");

		String pwRegex = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,16}$";
		if (newPw == null || !newPw.matches(pwRegex)) {
			throw new RuntimeException("새 비밀번호는 영문, 숫자를 포함하여 8~16자여야 합니다.");
		}

		String savedPw = mapper.selectCurrentPw(memberNo);

		if (!encoder.matches(currentPw, savedPw)) {
			return 0;
		}

		param.put("newPw", encoder.encode(newPw));
		param.put("memberNo", memberNo);

		return mapper.changePw(param);
	}

	/* 회원 탈퇴 (경매/주문 건수 체크) */
	@Override
	public int getActiveTransactionCount(int memberNo) {
		return mapper.countActiveTransactions(memberNo);
	}

	@Override
	@Transactional // 탈퇴는 중요한 작업이므로 트랜잭션 처리
	public boolean withdrawMember(int memberNo) {
		return mapper.updateWithdrawStatus(memberNo) > 0;
	}
}