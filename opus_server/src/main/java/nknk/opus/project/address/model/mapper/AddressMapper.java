package nknk.opus.project.address.model.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import nknk.opus.project.address.model.dto.Address;

@Mapper
public interface AddressMapper {

	List<Address> selectAddresses(int memberNo);
	
	

}
