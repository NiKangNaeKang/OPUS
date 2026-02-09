package nknk.opus.project.member.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import nknk.opus.project.member.model.dto.Member;
import nknk.opus.project.member.model.service.MemberService;
import nknk.opus.project.common.util.JwtUtil; // JwtUtil 임포트 추가
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173")
public class MemberController {

    @Autowired
    private MemberService service;

    @Autowired
    private JwtUtil jwtUtil;

    /* 로그인 API */
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody Member inputMember, 
                                   @RequestParam(value = "saveId", required = false) String saveId, 
                                   HttpServletResponse resp) {
        try {
            // 1. 서비스 호출을 통해 로그인 정보 조회
            // (Service 로직에서 비번 검증이 완료된 Member 객체가 반환되어야 함)
            Member loginMember = service.login(inputMember);

            if (loginMember == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 일치하지 않습니다");
            }

            // 2. 실제 JWT 토큰 생성
            String token = jwtUtil.createToken(loginMember.getMemberNo(), loginMember.getMemberEmail());

            // 3. 프론트엔드 응답용 데이터 구성
            Map<String, Object> result = new HashMap<>();
            result.put("token", token); // 생성된 진짜 토큰 주입
            
            Map<String, Object> user = new HashMap<>();
            user.put("id", loginMember.getMemberNo());
            user.put("email", loginMember.getMemberEmail());
            
            // 역할(Role) 설정 (AuthorLevel에 따른 분기)
            String role = switch (loginMember.getAuthorLevel()) {
                case 1 -> "MEMBER";
                case 2 -> "COMPANY";
                case 3 -> "ADMIN";
                default -> "USER";
            };
            user.put("role", role);
            result.put("user", user);

            // 4. 아이디 저장 쿠키 로직
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

    /* 이메일 중복 체크 API */
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /* 인증번호 확인 */
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
            if (result > 0) return ResponseEntity.ok("가입 성공");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("가입 실패");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /* 로그아웃 */
    @GetMapping("logout")
    public ResponseEntity<?> logout() {
        // JWT 방식에서 로그아웃은 보통 클라이언트가 토큰을 삭제하는 식으로 구현합니다.
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
}