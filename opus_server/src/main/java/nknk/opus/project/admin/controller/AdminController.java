package nknk.opus.project.admin.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import nknk.opus.project.admin.model.service.AdminService;
import nknk.opus.project.reviews.model.dto.Report;

@RestController
@RequestMapping("/admin")
public class AdminController {

	@Autowired
	private AdminService service;
	
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
			
			return ResponseEntity.status(HttpStatus.OK).body("후기를 삭제하였습니다.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	@PostMapping("/cancleReview")
	public ResponseEntity<String> cancleReview(@RequestParam("reportNo") int reportNo) {
		try {
			System.out.println("취소 요청 reportNo: " + reportNo);
			int result = service.cancleReview(reportNo);
			System.out.println("삭제 결과 result: " + result);
			
			if(result == 0) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("신고된 후기를 목록에서의 삭제에 실패하였습니다.");
			}
			
			return ResponseEntity.status(HttpStatus.OK).body("신고된 후기를 목록에서 삭제하였습니다. (신고 취소)");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
}
