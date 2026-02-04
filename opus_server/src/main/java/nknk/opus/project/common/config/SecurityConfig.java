package nknk.opus.project.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Configuration
public class SecurityConfig {

	// BCryptPasswordEncoder : 평문을 BCrypt 패턴을 통해 암호화 & 평문과 암호화된 문자열을 비교하여 같은 값인지 판단
	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
