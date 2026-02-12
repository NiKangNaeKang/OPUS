package nknk.opus.project.member.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import nknk.opus.project.common.util.JwtUtil;
import nknk.opus.project.member.model.dto.Member;
import nknk.opus.project.member.model.service.MemberService;

@RestController
@RequestMapping("/auth")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
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
			log.info("login request email={}, pwPresent={}",
				    inputMember.getMemberEmail(),
				    inputMember.getMemberPw() != null);

			
			Member loginMember = service.login(inputMember); // DB에서 회원 정보 조회 및 비밀번호 검증 (Service에서 처리)

			if (loginMember == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호 일치하지 않음");
			}

			// JWT 토큰 생성
			String token = jwtUtil.createToken(loginMember.getMemberNo(), loginMember.getMemberEmail(),
					loginMember.getAuthorLevel());

			// 프론트엔드 응답용 데이터 구성
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

			// 아이디 저장 쿠키 로직
			Cookie cookie = new Cookie("saveId", loginMember.getMemberEmail());
			cookie.setPath("/");
			if (saveId != null) {
				cookie.setMaxAge(60 * 60 * 24 * 30); // 30일 유지
			} else {
				cookie.setMaxAge(0); // 즉시 삭제
			}
			resp.addCookie(cookie);

			log.info("로그인 성공: {}", loginMember.getMemberEmail());
			return ResponseEntity.ok(result);

		} catch (Exception e) {
			log.error("로그인 중 서버 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
		}
	}

	/* 연락처 중복 체크 */
	@PostMapping("check-tel")
	public ResponseEntity<Boolean> checkTel(@RequestBody Map<String, String> map) {
		String tel = map.get("memberTel");
		boolean isDuplicate = service.checkTel(tel);
		return ResponseEntity.ok(isDuplicate);
	}

	/* 이메일 중복 체크 */
	@PostMapping("check-email")
	public ResponseEntity<Boolean> checkEmail(@RequestBody Map<String, String> map) {
		String email = map.get("email");
		// 비밀번호 검사가 없는 checkEmail 메서드 호출로 에러 방지
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
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); // 단순 문자열
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
			if (result > 0)
				return ResponseEntity.ok("가입 성공");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("가입 실패");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()); // 단순 문자열
		}
	}

	/* 로그아웃 */
	@GetMapping("logout")
	public ResponseEntity<?> logout() {
		return ResponseEntity.ok("로그아웃됨");
	}

	/* 연락처 수정 */
	@PostMapping("updateTel")
	public ResponseEntity<String> updateTel(@RequestBody Member inputMember) {
	    try {
	        int result = service.updateTel(inputMember);
	        if (result > 0) return ResponseEntity.ok("연락처 수정 성공");
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("연락처 수정 실패");
	    } catch (Exception e) {
	        // 서비스에서 던진 "이미 사용 중인 연락처입니다" 메시지를 프론트로 전달
	        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
	    }
	}

	/* 비밀번호 변경 */
	@PostMapping("changePw")
	public ResponseEntity<?> changePw(@RequestBody Map<String, Object> param) {
	    try {
	        int result = service.changePw(param);

	        if (result > 0) {
	            return ResponseEntity.ok("비밀번호 변경 완료");
	        } else {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("현재 비밀번호 일치하지 않음");
	        }
	    } catch (RuntimeException e) {
	        // 서비스 단의 정규식 검사 등 예외 메시지 처리
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
	    } catch (Exception e) {
	        log.error("비밀번호 변경 중 서버 오류", e);
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
	    }
	}
}