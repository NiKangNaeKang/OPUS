package nknk.opus.project.common.util;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	
	@Value("${jwt.secret}")
	private String secretKey;

	@Value("${jwt.expiration}")
	private long expirationTime;

	// 1. SecretKey 생성
	private SecretKey getSigningKey() {
		byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
		return Keys.hmacShaKeyFor(keyBytes);
	}

	// 2. 토큰 생성 (로그인 성공 시 호출)
	public String createToken(int memberNo, String memberEmail) {
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + expirationTime);

		return Jwts.builder()
                .subject(String.valueOf(memberNo)) // 회원번호 저장
                .claim("memberEmail", memberEmail) // 이메일 저장
                .issuedAt(now)                     // 생성 시간
                .expiration(expiryDate)            // 만료 시간
                .signWith(getSigningKey())         // 서명
                .compact();                        // 직렬화(문자열로 변환)
	}
}
