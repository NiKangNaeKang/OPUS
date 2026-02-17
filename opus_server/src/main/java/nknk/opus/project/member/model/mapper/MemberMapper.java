package nknk.opus.project.member.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.member.model.dto.Member;

@Mapper
public interface MemberMapper {

	Member login(String memberEmail);

	int signup(Member inputMember);

	int updateTel(Member inputMember);

	int checkTel(String tel);

	String selectCurrentPw(Integer integer);

	int changePw(Map<String, Object> param);

	int countActiveTransactions(int memberNo);

	int updateWithdrawStatus(int memberNo);

}
