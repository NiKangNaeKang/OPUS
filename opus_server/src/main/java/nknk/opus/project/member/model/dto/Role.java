package nknk.opus.project.member.model.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
    // 스프링 시큐리티에서는 권한 이름 앞에 반드시 "ROLE_"이 붙어야 인식합니다.
    USER("ROLE_USER", "일반사용자"),
    COMPANY("ROLE_COMPANY", "기업사용자"),
    ADMIN("ROLE_ADMIN", "관리자");

    private final String key;
    private final String title;
}