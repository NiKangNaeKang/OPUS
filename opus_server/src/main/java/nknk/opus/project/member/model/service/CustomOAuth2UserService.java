package nknk.opus.project.member.model.service;

import nknk.opus.project.member.model.dto.GoogleUserInfo;
import nknk.opus.project.member.model.dto.OAuth2UserInfo;
import nknk.opus.project.member.model.dto.Member; // Member로 변경
import nknk.opus.project.member.model.dto.Role;
import nknk.opus.project.member.model.mapper.MemberMapper; 
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService { 

    private final MemberMapper mapper;
    
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. 구글 정보 가져오기
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // 2. 구글 데이터 추출
        OAuth2UserInfo userInfo = new GoogleUserInfo(oAuth2User.getAttributes());
        String email = userInfo.getEmail();
        String name = userInfo.getName();

        // 3. DB 작업 (Member 사용)
        Member member = mapper.findByEmail(email); 
        
        if (member == null) {
            // 회원이 없으면 신규 가입 (Member 객체 생성)
            member = Member.builder()
                    .memberEmail(email)
                    .memberName(name)
                    .memberRole(Role.USER) // 기본 권한 USER
                    .authorLevel(1)        // 기존 방식 레벨 1
                    .memberDelFl("N")      // 기본값 세팅
                    .build();
            mapper.insertMember(member); 
        }

        // 4. 세션 저장
        return new DefaultOAuth2User(
                Collections.singleton(new SimpleGrantedAuthority(member.getMemberRole().getKey())), 
                oAuth2User.getAttributes(),
                "email" 
        );
    }
}