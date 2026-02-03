package nknk.opus.project.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import nknk.opus.project.member.model.dto.Member;
import nknk.opus.project.member.model.mapper.MemberMapper;

@Service
public class MemberServiceImpl implements MemberService {

    @Autowired
    private MemberMapper mapper;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Override
    public Member login(Member inputMember) {
        

        Member loginMember = mapper.login(inputMember.getMemberEmail());

        if (loginMember == null) return null;

        // encoder.matches(평문비번, 암호화된비번)
        if (!encoder.matches(inputMember.getMemberPw(), loginMember.getMemberPw())) {
            // 비밀번호가 다르면 null 반환
            return null;
        }

        loginMember.setMemberPw(null);
        
        return loginMember;
    }
}