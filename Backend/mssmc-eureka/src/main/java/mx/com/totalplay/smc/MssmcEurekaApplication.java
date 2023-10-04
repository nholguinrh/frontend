package mx.com.totalplay.smc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class MssmcEurekaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MssmcEurekaApplication.class, args);
	}

}
