package nknk.opus.project.unveiling.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import nknk.opus.project.unveiling.model.dto.Unveiling;
import nknk.opus.project.unveiling.model.service.UnveilingService;

@RestController
//@CrossOrigin
@RequestMapping("/api/unveilings")
public class UnveilingController {
	
	@Autowired
	private UnveilingService unveilingService;
	
	public ResponseEntity<Unveiling> detail(@PathVariable int unveilingNo) {
		return ResponseEntity.ok(unveilingService.getDetail(unveilingNo));
	}

}
