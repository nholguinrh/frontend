package mx.com.totalplay.smc.login.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CustomFeignConfiguration {

	@Value("${certificado.path}")
	private String path;
	
	@Value("${certificado.passwd}")
	private String clave;
	
	static {
		// for localhost testing only
		javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier(new javax.net.ssl.HostnameVerifier() {

			public boolean verify(String hostname, javax.net.ssl.SSLSession sslSession) {
				if (hostname.equals("localhost")) {
					return true;
				}
				return false;
			}
		});
	}

	@Bean
    public void Config() {  
		System.setProperty( "javax.net.ssl.trustStore", path );
		System.setProperty( "javax.net.ssl.trustStorePassword", clave );
    }

}
