package nknk.opus.project.member.model.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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

    @Autowired
    private JavaMailSender mailSender;

    private Map<String, String> authStorage = new HashMap<>();

    @Override
    public Member login(Member inputMember) {
        Member loginMember = mapper.login(inputMember.getMemberEmail());
        if (loginMember == null) return null;
        
        // BCrypt는 rawPassword가 null이면 에러가 남
        if (!encoder.matches(inputMember.getMemberPw(), loginMember.getMemberPw())) {
            return null;
        }
        
        loginMember.setMemberPw(null);
        return loginMember;
    }

    @Override
    public boolean checkEmail(String email) {
        // 비밀번호 비교 없이 이메일 존재 여부만 확인
        Member member = mapper.login(email);
        return member != null;
    }

    @Override
    public void sendEmail(String email) {

        if (checkEmail(email)) {
            throw new RuntimeException("사용 중인 이메일입니다.");
        }

        String code = String.format("%06d", new Random().nextInt(1000000));
        authStorage.put(email, code);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("[OPUS] 회원가입 인증번호 안내");
        message.setText("안녕하세요. 요청하신 인증번호는 [" + code + "] 입니다.");
        
        mailSender.send(message);
    }

    @Override
    public boolean verifyCode(String email, String code) {
        String savedCode = authStorage.get(email);
        return savedCode != null && savedCode.equals(code);
    }

    @Override
    public int signup(Member inputMember) {
        String pw = inputMember.getMemberPw();
        String pwRegex = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,16}$";
        
        if (pw == null || !pw.matches(pwRegex)) {
            throw new RuntimeException("비밀번호 형식이 올바르지 않습니다.");
        }

        inputMember.setMemberPw(encoder.encode(pw));
        return mapper.signup(inputMember);
    }
}