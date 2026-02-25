package nknk.opus.project.admin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import nknk.opus.project.admin.model.service.AdminService;
import nknk.opus.project.common.exception.ApiExceptionHandler;
import nknk.opus.project.reviews.model.dto.Report;
import nknk.opus.project.reviews.model.dto.Reviews;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ApiExceptionHandler apiExceptionHandler;

	@Autowired
	private AdminService service;

    AdminController(ApiExceptionHandler apiExceptionHandler) {
        this.apiExceptionHandler = apiExceptionHandler;
    }
	
	@GetMapping("/report")
	public ResponseEntity<List<Report>> getReport() {
		try {
			List<Report> result = service.getReport();
			
			return ResponseEntity.status(HttpStatus.OK).body(result);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	@PostMapping("/confirmReview")
	public ResponseEntity<String> confirmReview(@RequestParam("reportNo") int reportNo) {
		try {
			int result = service.confirmReview(reportNo);
			
			if(result == 0) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("후기 삭제에 실패하였습니다.");
			}
			
			return ResponseEntity.status(HttpStatus.OK).body("신고된 후기가 삭제되었습니다. (신고 승인)");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	@PostMapping("/rejectReview")
	public ResponseEntity<String> rejectReview(@RequestParam("reportNo") int reportNo) {
		try {
			int result = service.rejectReview(reportNo);
			
			if(result == 0) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("신고된 후기를 목록에서의 삭제에 실패하였습니다.");
			}
			
			return ResponseEntity.status(HttpStatus.OK).body("신고된 후기를 목록에서 삭제하였습니다. (신고 거절)");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	@GetMapping("/restore")
	public ResponseEntity<List<Reviews>> getRestore() {
		try {
			List<Reviews> result = service.getRestore();
			
			return ResponseEntity.status(HttpStatus.OK).body(result);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	@PostMapping("/restoreReview")
	public ResponseEntity<String> restoreReview(@RequestParam("reviewNo") int reviewNo) {
		try {
			int result = service.restoreReview(reviewNo);
			
			if(result == 0) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("삭제된 후기 복구에 실패하였습니다.");
			}
			
			return ResponseEntity.status(HttpStatus.OK).body("삭제된 후기를 복구하였습니다");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
}
