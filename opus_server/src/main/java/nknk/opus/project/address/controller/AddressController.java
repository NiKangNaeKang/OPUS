package nknk.opus.project.address.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nknk.opus.project.address.model.dto.Address;
import nknk.opus.project.address.model.service.AddressService;
import nknk.opus.project.common.security.CustomUserDetails;

@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("address")
@RestController
public class AddressController {

	@Autowired
	private AddressService service;
	
	
	
	@GetMapping("addresses")
	public ResponseEntity<Object> selectAddresses(@AuthenticationPrincipal CustomUserDetails userDetails) {
		try {
			
			int memberNo = userDetails.getMemberNo();
			
			List<Address> addresses = service.selectAddresses(memberNo);
			
			return ResponseEntity.status(HttpStatus.OK).body(addresses);
			
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
}
