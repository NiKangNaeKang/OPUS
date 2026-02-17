package nknk.opus.project.common.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private JwtAuthenticationFilter jwtAuthenticationFilter;

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean // HTTP 보안 설정 (필터 체인)
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				// 1. REST API 설정을 위해 기본 기능 비활성화
				// (데이터(JSON)만 주고받는 REST API 방식으로 세션 기반의 보안이나 기본 로그인 창 끔)
				.csrf(csrf -> csrf.disable()).formLogin(form -> form.disable()).httpBasic(basic -> basic.disable())

				// CORS 활성화
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))

				.exceptionHandling(
						exception -> exception.authenticationEntryPoint((request, response, authException) -> {
							// 인증되지 않은 사용자가 접근 시 401 에러를 명시적으로 전달
							response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "UnAuthorized");
						}))

				// 2. 경로별 권한 설정
				.authorizeHttpRequests(auth -> auth
						// preflight 요청 허용
						.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						// 로그인, 회원가입, 공통 경로는 토큰 없이 허용(인증 전 수행)
						.requestMatchers("/auth/**", "/common/**").permitAll()
						// 비로그인 회원도 조회는 가능하도록
						.requestMatchers("/selections/**", "/images/**", "/unveiling/**").permitAll()
						// 그 외 모든 요청은 인증(토큰)이 필요함
						.anyRequest().authenticated())

				// 3. JWT 필터를 시큐리티 필터 체인에 등록
				// UsernamePasswordAuthenticationFilter 단계 전 jwtAuthenticationFilter를 먼저 거치게 함
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	// CORS 설정 Bean
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {

		CorsConfiguration config = new CorsConfiguration();

		config.setAllowedOrigins(List.of("http://localhost:5173"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

		source.registerCorsConfiguration("/**", config);
		return source;
	}

}