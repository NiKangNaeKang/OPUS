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

}
