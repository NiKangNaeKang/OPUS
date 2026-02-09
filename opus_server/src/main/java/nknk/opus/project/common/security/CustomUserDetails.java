package nknk.opus.project.common.security;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import nknk.opus.project.member.model.dto.Member;

public class CustomUserDetails implements UserDetails {

	private int memberNo;
	private String username;
	private String password;
	private Collection<? extends GrantedAuthority> authorities;

	// 생성자
	public CustomUserDetails(Member member) {
		this.memberNo = member.getMemberNo();
		this.username = member.getMemberEmail();
		this.password = member.getMemberPw();
		
		List<SimpleGrantedAuthority> auths = new ArrayList<>();
		
		switch (member.getAuthorLevel()) {
        case 1 :
        	auths.add(new SimpleGrantedAuthority("ROLE_USER")); // 일반회원
        	break; 
        case 2 :
        	auths.add(new SimpleGrantedAuthority("ROLE_ADMIN")); // 관리자
        	break;
        case 3 :
        	auths.add(new SimpleGrantedAuthority("ROLE_COMPANY")); // 회사계정
        	break;
        default :
        	auths.add(new SimpleGrantedAuthority("ROLE_USER")); // 기본값
    }

    this.authorities = auths;
    
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }

	@Override
	public String getPassword() { return password; }

	@Override
	public String getUsername() { return username; }
	
	@Override
	public boolean isAccountNonExpired() { return true; }

	@Override
	public boolean isAccountNonLocked() { return true; }

	@Override
	public boolean isCredentialsNonExpired() { return true; }

	@Override
	public boolean isEnabled() { return true; }
	
	public int getMemberNo() { return memberNo; }

}
