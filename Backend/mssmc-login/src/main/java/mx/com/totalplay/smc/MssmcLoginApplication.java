package mx.com.totalplay.smc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;

@EnableEncryptableProperties
@EnableDiscoveryClient
@EnableFeignClients
@SpringBootApplication
public class MssmcLoginApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(MssmcLoginApplication.class, args);
	}

	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(MssmcLoginApplication.class);
	}

}
