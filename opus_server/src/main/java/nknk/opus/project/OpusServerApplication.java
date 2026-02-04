package nknk.opus.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class OpusServerApplication {

	public static void main(String[] args) {
		
		System.out.println("보안관 제미니의 선물: " + new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder().encode("pass01!"));
		
		
		SpringApplication.run(OpusServerApplication.class, args);
		
		
	}
	
	

}
