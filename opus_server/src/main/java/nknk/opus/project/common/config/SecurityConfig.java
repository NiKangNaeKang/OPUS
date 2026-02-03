package nknk.opus.project.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

	// Spring Security 열어놓기용 (개발 중일 때)
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(cors -> {
		}).authorizeHttpRequests(auth -> auth.anyRequest().permitAll()).formLogin(form -> form.disable())
				.httpBasic(basic -> basic.disable());

		return http.build();
	}

}
