package nknk.opus.project.reviews.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nknk.opus.project.reviews.model.dto.Reviews;
import nknk.opus.project.reviews.model.service.ReviewsService;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/reviews")
public class ReviewsController {

	@Autowired
	private ReviewsService service;
	
	@PostMapping("/addReview")
	public ResponseEntity<String> addReview(Authentication authentication, @RequestBody Reviews inputReview) {

		try {
			int memberNo = Integer.parseInt(authentication.getName());
	        inputReview.setMemberNo(memberNo);
			int result = service.addReview(inputReview);
			
			if(result == 0) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("후기 등록에 실패하였습니다.");
			};
			
			return ResponseEntity.status(HttpStatus.OK).body("후기가 등록되었습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
}
