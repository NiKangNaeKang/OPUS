package nknk.opus.project.common.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nknk.opus.project.common.handler.OAuth2SuccessHandler;
import nknk.opus.project.member.model.service.CustomOAuth2UserService;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomOAuth2UserService customOAuth2UserService;
	private final OAuth2SuccessHandler oauth2SuccessHandler;

	// 환경변수에서 CORS Origins 읽기
	@Value("${cors.allowed.origins}")
	private String allowedOrigins;

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				// REST API 설정: CSRF, FormLogin, HttpBasic 비활성화
				.csrf(csrf -> csrf.disable()).formLogin(form -> form.disable()).httpBasic(basic -> basic.disable())

				// CORS 설정 적용
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))

				// 인증 예외 처리 (401 에러 반환)
				.exceptionHandling(exception -> exception.authenticationEntryPoint(
						(request, response, authException) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED)))

				// URL 권한 관리
				.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/auth/**", "/common/**", "/selections/**", "/images/**", "/unveiling/**",
								"/api/board/**")
						.permitAll().requestMatchers("/login/oauth2/**", "/oauth2/**").permitAll().anyRequest()
						.authenticated())

				// OAuth2 로그인 설정
				.oauth2Login(oauth -> oauth.userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
						.successHandler(oauth2SuccessHandler))

				// JWT 필터 추가
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();

		List<String> origins = parseOrigins(allowedOrigins);

		// 로그 출력 (배포 시 확인용)
		log.info("=== CORS 설정 ===");
		log.info("Allowed Origins: {}", origins);

		config.setAllowedOrigins(origins);
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

	/**
	 * 쉼표로 구분된 문자열을 List로 변환 
	 * 예: "http://localhost:5173,https://domain.com" → [http://localhost:5173, https://domain.com]
	 */
	private List<String> parseOrigins(String originsStr) {
		if (originsStr == null || originsStr.trim().isEmpty()) {
			log.warn("CORS origins가 설정되지 않았습니다. 기본값 사용: http://localhost:5173");
			return List.of("http://localhost:5173");
		}

		return Arrays.stream(originsStr.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
	}

}