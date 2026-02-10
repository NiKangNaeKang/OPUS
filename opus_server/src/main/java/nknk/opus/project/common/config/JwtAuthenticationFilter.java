package nknk.opus.project.common.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import nknk.opus.project.common.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		// 헤더에서 토큰 꺼내기 (Authorization: Bearer <token>)
		String authHeader = request.getHeader("Authorization");

		// Bearer 토큰형식인지 확인
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);

			// 토큰(validateToken) 유효검사
			if (jwtUtil.validateToken(token)) {
				String memberNo = jwtUtil.getMemberNo(token);
				String role = jwtUtil.getMemberRole(token);

				// 시큐리티 인증 객체 생성 및 등록(비밀번호는 null로 처리)
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(memberNo,
						null, Collections.singletonList(new SimpleGrantedAuthority(role)));
				// 서버 내부 메모리에 인증 정보 저장
				SecurityContextHolder.getContext().setAuthentication(authentication);

			} else {
				// 토큰이 존재하지만 유효하지 않은 경우 (만료, 변조 등)
				// 프론트엔드에서 401 에러를 감지하여 자동 로그아웃 처리를 할 수 있게 함
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.setContentType("application/json;charset=UTF-8");
				response.getWriter().write("{\"message\":\"로그인이 만료되었습니다. 다시 로그인해주세요.\"}");
				return;
			}
		}

		// 5. 토큰이 없거나 유효한 경우 다음 필터 진행
		filterChain.doFilter(request, response);
	}
}