package nknk.opus.project.member.model.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import nknk.opus.project.member.model.dto.Member;

@Mapper
public interface MemberMapper {

  Member login(@Param("memberEmail") String memberEmail);

  int signup(Member inputMember);

  int updateTel(Member inputMember);

  int checkTel(@Param("tel") String tel);

  String selectCurrentPw(@Param("memberNo") int memberNo);

  int changePw(Map<String, Object> param);

  int getActiveTransactionCount(@Param("memberNo") int memberNo);

  int withdrawMember(@Param("memberNo") int memberNo);

  Member findByEmail(@Param("memberEmail") String email);

  void insertMember(Member member);

  Member checkEmailExists(@Param("email") String email);
}