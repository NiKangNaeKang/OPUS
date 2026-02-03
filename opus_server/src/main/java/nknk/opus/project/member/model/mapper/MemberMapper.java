package nknk.opus.project.member.model.mapper;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.member.model.dto.Member;

@Mapper
public interface MemberMapper {

	Member login(String memberEmail);



}
