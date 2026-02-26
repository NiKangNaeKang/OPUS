package nknk.opus.project.onStage.controller;

import java.net.URI;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@RestController
@RequestMapping("/onStage")
public class OnStageController {

    private final RestTemplate restTemplate = new RestTemplate();

    // 전시 목록 조회
    @GetMapping("/exhibitions")
    public ResponseEntity<String> getExhibitions(
            @RequestParam String serviceKey,
            @RequestParam(defaultValue = "1") int pageNo) {

        URI uri = UriComponentsBuilder
                .fromUriString("https://api.kcisa.kr/openapi/API_CCA_145/request")
                .queryParam("serviceKey", serviceKey)
                .queryParam("numOfRows", 20)
                .queryParam("pageNo", pageNo)
                .build()
                .encode()
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0");
        headers.set("Accept", "application/xml");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response =
                restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

        return ResponseEntity.ok(response.getBody());
    }
    
    // 뮤지컬 목록 조회
    @GetMapping("/musicals")
    public ResponseEntity<String> getMusicals (@RequestParam("service") String serviceKey, @RequestParam("stdate") String startDate, @RequestParam("eddate") String endDate,
    		@RequestParam(name="cpage", defaultValue="1") int pageNo, @RequestParam(defaultValue = "100") int rows, @RequestParam(required = false, name="shprfnm") String search) {
        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString("https://www.kopis.or.kr/openApi/restful/pblprfr")
                .queryParam("service", serviceKey)
                .queryParam("stdate", startDate)
                .queryParam("eddate", endDate)
                .queryParam("cpage", pageNo)
                .queryParam("rows", rows)
                .queryParam("shcate", "GGGA")
                .queryParam("signgucode", 11)
                .queryParam("kidstate", "N");

        if (search != null && !search.isBlank()) {
            builder.queryParam("shprfnm", search);
        }

        URI uri = builder.build().encode().toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "Mozilla/5.0");
        headers.set("Accept", "application/xml");
        
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        
        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, entity, String.class);

        return ResponseEntity.ok(response.getBody());
    }
}