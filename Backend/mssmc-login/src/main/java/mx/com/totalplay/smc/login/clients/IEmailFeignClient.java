package mx.com.totalplay.smc.login.clients;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import feign.Headers;
import mx.com.totalplay.smc.commons.model.EmailModel;
import mx.com.totalplay.smc.login.config.CustomFeignConfiguration;

@FeignClient(value = "mssmc-correos", url = "${correo.url}", configuration = CustomFeignConfiguration.class)
public interface IEmailFeignClient {

	String AUTH_TOKEN = "Authorization";

	@PostMapping("/enviar-correo")
	@Headers("Content-Type: application/json")
	public void enviarCorreo(
			@RequestHeader(AUTH_TOKEN) String bearerToken, 
			@RequestBody EmailModel model);
}
