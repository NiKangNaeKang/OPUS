package nknk.opus.project.member.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import nknk.opus.project.member.model.dto.Member;
import nknk.opus.project.member.model.service.MemberService;
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


    /**로그인 api
     * @param inputMember
     * @param saveId
     * @param resp
     * @return
     */
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody Member inputMember, 
                                 @RequestParam(value = "saveId", required = false) String saveId, 
                                 HttpServletResponse resp) {
        try {
            Member loginMember = service.login(inputMember);

            if (loginMember == null) {
                log.info("로그인 실패: 이메일 또는 비밀번호 불일치");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                     .body("아이디 또는 비밀번호가 일치하지 않습니다");
            }

            loginMember.setMemberPw(null);

            Map<String, Object> result = new HashMap<>();
            
            // 가짜 토큰, 수정필요
            result.put("token", "fake-jwt-token-for-now"); 
            
            Map<String, Object> user = new HashMap<>();
            user.put("id", loginMember.getMemberNo());
            user.put("email", loginMember.getMemberEmail());
            
            String role;
            switch (loginMember.getAuthorLevel()) {
                case 1:  role = "MEMBER"; break;
                case 2:  role = "COMPANY"; break;
                case 3:  role = "ADMIN"; break;
                default: role = "USER";
            }
            user.put("role", role);
            
            result.put("user", user);

            // 쿠키로 이메일 저장
            Cookie cookie = new Cookie("saveId", loginMember.getMemberEmail());
            cookie.setPath("/");
            if (saveId != null) {
                cookie.setMaxAge(60 * 60 * 24 * 30); // 30일 유지
            } else {
                cookie.setMaxAge(0); // 쿠키 삭제
            }
            resp.addCookie(cookie);

            log.info("로그인 성공: {}", loginMember.getMemberEmail());
            
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("로그인 중 서버 예외 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }


    /**로그아웃 api
     * @return
     */
    @GetMapping("logout")
    public ResponseEntity<?> logout() {
        log.info("로그아웃 요청 수신");
        return ResponseEntity.ok("로그아웃 되었습니다.");
    }
    
    
    
    
}