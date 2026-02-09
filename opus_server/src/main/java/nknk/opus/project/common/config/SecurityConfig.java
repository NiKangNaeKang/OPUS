package nknk.opus.project.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	// BCryptPasswordEncoder : 평문을 BCrypt 패턴을 통해 암호화 & 평문과 암호화된 문자열을 비교하여 같은 값인지 판단
	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

	
    /**
     * 개발 단계용 Security 설정
     * - React(프론트) + REST(API) 호출을 막지 않도록 /api/** permitAll
     * - CSRF는 일단 disable (POST/PUT/DELETE 403 방지)
     * - formLogin/basic 인증 비활성화
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth
                // API는 우선 전부 허용 (로그인 붙일 때 여기만 조이면 됨)
                .requestMatchers("/api/**").permitAll()

                // 정적 리소스(필요 시)
                .requestMatchers("/", "/css/**", "/js/**", "/images/**", "/favicon.ico").permitAll()

                // 그 외도 일단 허용 (원하면 authenticated로 바꿀 수 있음)
                .anyRequest().permitAll()
            )

            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .cors(Customizer.withDefaults());

        return http.build();
    }
}
