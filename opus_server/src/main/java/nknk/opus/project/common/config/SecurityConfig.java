package nknk.opus.project.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity // 스프링 시큐리티 설정을 활성화
public class SecurityConfig {

    // BCryptPasswordEncoder : 비밀번호 암호화 및 비교 객체 빈 등록
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // HTTP 보안 설정 (필터 체인)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. CSRF 방어 비활성화 (REST API는 세션을 쓰지 않으므로 보통 끔)
            .csrf(csrf -> csrf.disable())
            
            // 2. 기본 폼 로그인 비활성화 (React에서 커스텀 UI를 쓸 예정)
            .formLogin(form -> form.disable())
            
            // 3. HTTP 기본 인증 비활성화
            .httpBasic(basic -> basic.disable())
            
            // 4. 경로별 권한 설정
            .authorizeHttpRequests(auth -> auth
                // 회원가입, 로그인 등 모든 사용자가 접근 가능한 경로
                .requestMatchers("/member/login", "/member/signup", "/common/**").permitAll()
                // 그 외 모든 요청은 우선 허용 (개발 단계 편의상)
                // 로그인 완성시 authenticated()로 바꿔서 토큰 없이는 접근 못 하게 막을 예정
                .anyRequest().permitAll() 
            );

        return http.build();
    }
}