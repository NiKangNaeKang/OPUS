package nknk.opus.project.address.model.service;

import java.util.List;

import nknk.opus.project.address.model.dto.Address;

public interface AddressService {

	List<Address> selectAddresses(int memberNo);

}
