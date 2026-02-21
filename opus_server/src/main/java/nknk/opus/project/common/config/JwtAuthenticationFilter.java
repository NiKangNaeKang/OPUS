package nknk.opus.project.common.config;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import nknk.opus.project.common.util.JwtUtil;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		// 1. Authorization 헤더 확인
		String authHeader = request.getHeader("Authorization");
		String token = null;

		// 2. Bearer 토큰 추출
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			token = authHeader.substring(7);

			// 3. 토큰 검증
			if (jwtUtil.validateToken(token)) {
				// 4. 정보 추출 및 권한 설정
				String memberNo = jwtUtil.getMemberNo(token);
				String role = jwtUtil.getMemberRole(token);

				// 5. 시큐리티 인증 객체 생성 및 컨텍스트 저장
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(memberNo,
						null, Collections.singletonList(new SimpleGrantedAuthority(role)));
				SecurityContextHolder.getContext().setAuthentication(authentication);

			} else {
				// 6. 유효하지 않은 토큰 처리 (401 에러)
				response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				response.setContentType("application/json;charset=UTF-8");
				response.getWriter().write("{\"message\":\"로그인이 만료되었습니다. 다시 로그인해주세요.\"}");
				return;
			}
		}

		// 7. 다음 필터로 진행
		filterChain.doFilter(request, response);
	}
}