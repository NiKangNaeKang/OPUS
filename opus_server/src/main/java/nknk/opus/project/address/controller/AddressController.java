package nknk.opus.project.address.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nknk.opus.project.address.model.dto.Address;
import nknk.opus.project.address.model.service.AddressService;
import nknk.opus.project.common.security.CustomUserDetails;

@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("addresses")
@RestController
public class AddressController {

	@Autowired
	private AddressService service;

	// 배송지 목록 조회
	@GetMapping
	public ResponseEntity<Object> selectAddresses(@AuthenticationPrincipal CustomUserDetails userDetails) {
		try {

			int memberNo = userDetails.getMemberNo();

			List<Address> addresses = service.selectAddresses(memberNo);

			return ResponseEntity.status(HttpStatus.OK).body(addresses);

		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	// 배송지 추가
	@PostMapping
	public ResponseEntity<Address> addAddress(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody Address address) {
		
		int memberNo = userDetails.getMemberNo();
		
		Address addedAddress = service.addAddress(memberNo, address);
		
		return ResponseEntity.status(HttpStatus.CREATED).body(addedAddress);
	}
	
	// 배송지 수정
	@PutMapping("{addressNo}")
	public ResponseEntity<Address> updateAddress(@AuthenticationPrincipal CustomUserDetails userDetails, 
											@RequestBody Address address, 
											@PathVariable("addressNo") int addressNo) {
		
		int memberNo = userDetails.getMemberNo();
		
		Address updatedAddress = service.updateAddress(memberNo, address, addressNo);
		
		return ResponseEntity.status(HttpStatus.OK).body(updatedAddress);
	}

}
