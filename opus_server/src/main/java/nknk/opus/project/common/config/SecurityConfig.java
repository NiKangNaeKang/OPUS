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

	@Value("${cors.allowed.origins}")
	private String allowedOrigins;

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).formLogin(form -> form.disable()).httpBasic(basic -> basic.disable())
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))

				// 인증 실패 시 401 + JSON 고정 (sendError 쓰면 data.message가 비거나 HTML일 수 있음)
				.exceptionHandling(
						exception -> exception.authenticationEntryPoint((request, response, authException) -> {
							response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
							response.setContentType("application/json;charset=UTF-8");
							response.getWriter().write("{\"message\":\"세션이 만료되었습니다. 다시 로그인해주세요.\"}");
						}))

            // 경로별 권한 설정
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/auth/**", "/common/**").permitAll()
                .requestMatchers("/selections/**", "/images/**").permitAll()
                .requestMatchers("/unveiling/**", "/api/board/**").permitAll()
                .requestMatchers("/login/oauth2/**", "/oauth2/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/unveilings/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/bids/**").permitAll()
                .requestMatchers("/chatbot/**").permitAll()
                .requestMatchers("/admin/**").authenticated()
                .anyRequest().authenticated()
            )
				.oauth2Login(oauth -> oauth.userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
						.successHandler(oauth2SuccessHandler))

				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration config = new CorsConfiguration();

		List<String> origins = parseOrigins(allowedOrigins);

		log.info("=== CORS 설정 ===");
		log.info("Allowed Origins: {}", origins);

		config.setAllowedOrigins(origins);
		config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		config.setAllowedHeaders(List.of("*"));
		config.setAllowCredentials(true);

		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", config);
		return source;
	}

	private List<String> parseOrigins(String originsStr) {
		if (originsStr == null || originsStr.trim().isEmpty()) {
			log.warn("CORS origins가 설정되지 않았습니다. 기본값 사용: http://localhost:5173");
			return List.of("http://localhost:5173");
		}

		return Arrays.stream(originsStr.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
	}
}