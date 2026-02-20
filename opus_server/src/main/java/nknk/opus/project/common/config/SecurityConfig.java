package nknk.opus.project.common.config;

import java.util.List;
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
import nknk.opus.project.common.handler.OAuth2SuccessHandler;
import nknk.opus.project.member.model.service.CustomOAuth2UserService;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final CustomOAuth2UserService customOAuth2UserService;
	private final OAuth2SuccessHandler oauth2SuccessHandler;

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

.exceptionHandling(
    exception -> exception.authenticationEntryPoint((request, response, authException) -> {
        // 인증되지 않은 사용자가 접근 시 401 에러를 명시적으로 전달
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
    })
)

// 2. 경로별 권한 설정
.authorizeHttpRequests(auth -> auth
    // preflight 허용
    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

    // 인증 없이 허용
    .requestMatchers("/auth/**", "/common/**").permitAll()
    .requestMatchers("/selections/**", "/images/**").permitAll()

    // ✅ 공개 조회: 비로그인 허용
    .requestMatchers(HttpMethod.GET, "/api/unveilings/**").permitAll()

						// (선택) 최근 입찰 조회 GET API가 있다면
						.requestMatchers(HttpMethod.GET, "/api/bids/**").permitAll()

						// ✅ 그 외(POST/PUT/DELETE): 입찰, 낙찰확정, 결제 등은 인증 필요
						.anyRequest().authenticated())
				// URL 권한 관리
				.authorizeHttpRequests(auth -> auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
						.requestMatchers("/auth/**", "/common/**", "/selections/**", "/images/**", "/unveiling/**", "/api/board/**")
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
		config.setAllowedOrigins(List.of("http://localhost:5173"));
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}
}
