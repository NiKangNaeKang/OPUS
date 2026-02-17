package nknk.opus.project.member.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import nknk.opus.project.member.model.dto.Member;
import nknk.opus.project.member.model.service.MemberService;
import nknk.opus.project.common.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MemberController {

	@Autowired
	private MemberService service;

	@Autowired
	private JwtUtil jwtUtil;

	/* 로그인 */
	@PostMapping("login")
	public ResponseEntity<?> login(@RequestBody Member inputMember,
			@RequestParam(value = "saveId", required = false) String saveId, HttpServletResponse resp) {
		try {
			Member loginMember = service.login(inputMember);

			if (loginMember == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다.");
			}

			String token = jwtUtil.createToken(loginMember.getMemberNo(), loginMember.getMemberEmail(),
					loginMember.getAuthorLevel());

			Map<String, Object> result = new HashMap<>();
			result.put("token", token);

			Map<String, Object> memberInfo = new HashMap<>();
			memberInfo.put("memberNo", loginMember.getMemberNo());
			memberInfo.put("memberEmail", loginMember.getMemberEmail());
			memberInfo.put("memberTel", loginMember.getMemberTel());
			memberInfo.put("authorLevel", loginMember.getAuthorLevel());

			String role = switch (loginMember.getAuthorLevel()) {
			case 1 -> "MEMBER";
			case 2 -> "COMPANY";
			case 3 -> "ADMIN";
			default -> "USER";
			};

			memberInfo.put("role", role);
			result.put("member", memberInfo);

			/* 이메일 저장 쿠키 */
			Cookie cookie = new Cookie("saveId", loginMember.getMemberEmail());
			cookie.setPath("/");
			cookie.setHttpOnly(false);

			if (saveId != null && saveId.equals("true")) {
				cookie.setMaxAge(60 * 60 * 24 * 30);
			} else {
				cookie.setMaxAge(0);
			}
			resp.addCookie(cookie);

			log.info("로그인 성공: {}", loginMember.getMemberEmail());
			return ResponseEntity.ok(result);

		} catch (Exception e) {
			log.error("로그인 중 서버 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
		}
	}

	/* 연락처 중복 체크 */
	@PostMapping("check-tel")
	public ResponseEntity<?> checkTel(@RequestBody Map<String, String> map) {
		String tel = map.get("memberTel");
		boolean isDuplicate = service.checkTel(tel);

		if (isDuplicate) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 등록된 연락처입니다.");
		}

		return ResponseEntity.ok(false);
	}

	/* 이메일 중복 체크 */
	@PostMapping("check-email")
	public ResponseEntity<Boolean> checkEmail(@RequestBody Map<String, String> map) {
		String email = map.get("email");
		boolean isDuplicate = service.checkEmail(email);
		return ResponseEntity.ok(isDuplicate);
	}

	/* 이메일 인증번호 발송 */
	@PostMapping("email-send")
	public ResponseEntity<String> sendEmail(@RequestBody Map<String, String> map) {
		String email = map.get("email");
		try {
			service.sendEmail(email);
			return ResponseEntity.ok("인증번호가 발송되었습니다.");
		} catch (Exception e) {
			log.error("이메일 발송 중 오류 발생: {}", email, e);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	/* 이메일 인증번호 확인 */
	@PostMapping("email-verify")
	public ResponseEntity<Boolean> verifyCode(@RequestBody Map<String, String> map) {
		String email = map.get("email");
		String code = map.get("code");
		boolean isMatched = service.verifyCode(email, code);
		return ResponseEntity.ok(isMatched);
	}

	/* 회원가입 */
	@PostMapping("signup")
	public ResponseEntity<?> signup(@RequestBody Member inputMember) {
		try {
			int result = service.signup(inputMember);
			if (result > 0) {
				log.info("회원가입 성공: {}", inputMember.getMemberEmail());
				return ResponseEntity.ok("회원가입에 성공했습니다.");
			}
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원가입에 실패했습니다.");
		} catch (Exception e) {
			log.error("회원가입 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		}
	}

	/* 로그아웃 */
	@GetMapping("logout")
	public ResponseEntity<?> logout() {
		log.info("로그아웃 완료");
		return ResponseEntity.ok("로그아웃 되었습니다.");
	}

	/* 연락처 수정 */
	@PostMapping("updateTel")
	public ResponseEntity<String> updateTel(@RequestBody Member inputMember) {
		try {
			int result = service.updateTel(inputMember);
			if (result > 0) {
				log.info("연락처 수정 성공: {}", inputMember.getMemberEmail());
				return ResponseEntity.ok("연락처가 변경되었습니다.");
			}
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("연락처 변경에 실패했습니다.");
		} catch (Exception e) {
			log.error("연락처 수정 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
		}
	}

	/* 비밀번호 변경 */
	@PostMapping("changePw")
	public ResponseEntity<?> changePw(@RequestBody Map<String, Object> param) {
		try {
			int result = service.changePw(param);

			if (result > 0) {
				log.info("비밀번호 변경 성공: {}", param.get("memberEmail"));
				return ResponseEntity.ok("비밀번호가 변경되었습니다.");
			} else {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("현재 비밀번호가 일치하지 않습니다.");
			}
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
		} catch (Exception e) {
			log.error("비밀번호 변경 중 서버 오류", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다");
		}
	}

	/* 회원 탈퇴 (경매/주문 건수 체크) */
	@GetMapping("/withdraw-check/{memberNo}")
	public ResponseEntity<?> checkWithdrawStatus(@PathVariable int memberNo) {
		int activeCount = service.getActiveTransactionCount(memberNo);
		Map<String, Object> response = new HashMap<>();
		response.put("activeCount", activeCount);
		return ResponseEntity.ok(response);
	}

	// 실제 회원 탈퇴 처리 (논리 삭제)
	@PostMapping("/withdraw")
	public ResponseEntity<?> withdrawMember(@RequestBody Map<String, Integer> request) {
		int memberNo = request.get("memberNo");

		// 다시 한번 서버단에서 검증 (보안상 중요)
		if (service.getActiveTransactionCount(memberNo) > 0) {
			return ResponseEntity.badRequest().body("진행 중인 거래가 있어 탈퇴할 수 없습니다. 관리자에게 문의해주세요.");
		}

		boolean result = service.withdrawMember(memberNo);
		if (result) {
			return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
		} else {
			return ResponseEntity.status(500).body("탈퇴 처리 중 오류가 발생했습니다.");
		}
	}
}