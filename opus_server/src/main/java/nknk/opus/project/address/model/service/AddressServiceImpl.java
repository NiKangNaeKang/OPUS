package nknk.opus.project.address.model.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import nknk.opus.project.address.model.dto.Address;
import nknk.opus.project.address.model.mapper.AddressMapper;

@Transactional(rollbackFor = Exception.class)
@Service
public class AddressServiceImpl implements AddressService{
	
	@Autowired
	private AddressMapper mapper;

	@Override
	public List<Address> selectAddresses(int memberNo) {
		return mapper.selectAddresses(memberNo);
	}

	@Override
	public Address addAddress(int memberNo, Address address) {
		
		address.setMemberNo(memberNo);
		
		int result = mapper.addAddress(address);
		
		if(result != 1) {
			throw new RuntimeException();
		}
		
		return address;
	}

	@Override
	public Address updateAddress(int memberNo, Address address, int addressNo) {
		
		address.setAddressNo(addressNo);
		address.setMemberNo(memberNo);
		
		int result = mapper.updateAddress(address);
		
		if(result != 1) {
			throw new RuntimeException();
		}
		
		return address;
	}

}
