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
	public String createToken(int memberNo, String memberEmail, int authorLevel) {
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + expirationTime);

		// 숫자로 된 권한을 "ROLE_USER" 형태의 문자열로 변환 (시큐리티 표준 방식)
		String role = switch (authorLevel) {
		case 1 -> "ROLE_MEMBER";
		case 2 -> "ROLE_COMPANY";
		case 3 -> "ROLE_ADMIN";
		default -> "ROLE_USER";
		};

		return Jwts.builder().subject(String.valueOf(memberNo)).claim("memberEmail", memberEmail).claim("role", role)
				.issuedAt(now) // 생성 시간
				.expiration(expiryDate) // 만료 시간
				.signWith(getSigningKey()) // 서명
				.compact(); // 직렬화(문자열로 변환)
	}

	// 3. 토큰 유효성 검사
	public boolean validateToken(String token) {

		try {
			Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);

			return true;
		} catch (Exception e) { // 토큰이 변조되었거나, 만료되었을 때

			return false;
		}
	}

	// 4. 토큰에서 회원 번호(Subject) 추출
	public String getMemberNo(String token) {
		return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload().getSubject();
	}

	// 5. 토큰에서 권한(Role) 추출
	public String getMemberRole(String token) {
		return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload().get("role",
				String.class);
	}

}
