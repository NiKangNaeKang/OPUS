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

		String authHeader = request.getHeader("Authorization");

		// Authorization 헤더 없으면 그냥 통과 (비로그인 상태)
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		String token = authHeader.substring(7).trim();

		// 프론트에서 오는 쓰레기 토큰 방어
		if (token.isBlank() || token.equalsIgnoreCase("undefined") || token.equalsIgnoreCase("null")
				|| token.equalsIgnoreCase("NaN")) {

			// 로그인 안 한 요청으로 간주
			filterChain.doFilter(request, response);
			return;
		}

		try {
			// 정상 토큰 검증
			if (jwtUtil.validateToken(token)) {

				String memberNo = jwtUtil.getMemberNo(token);
				String role = jwtUtil.getMemberRole(token);

				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(memberNo,
						null, Collections.singletonList(new SimpleGrantedAuthority(role)));

				SecurityContextHolder.getContext().setAuthentication(authentication);
			}

		} catch (Exception e) {
			// 토큰 파싱 실패도 비로그인으로 처리
			SecurityContextHolder.clearContext();
		}

		// 무조건 다음 필터 진행
		filterChain.doFilter(request, response);
	}
}