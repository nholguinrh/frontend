package mx.com.totalplay.smc.gateway.confg;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import mx.com.totalplay.smc.gateway.filter.JwtAuthenticationFilter;

@Configuration
public class GatewayConfig {


	@Autowired
	private JwtAuthenticationFilter filter;

	@Bean
	public RouteLocator routes(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("mssmc-oauth", r -> r.path("/mssmc-oauth/v1/**")
						.filters(f -> f.filter(filter))
						.uri("lb://mssmc-oauth"))
				.route("mssmc-catalogos", r -> r.path("/mssmc-catalogos/v1/**")
						.filters(f -> f.filter(filter))
						.uri("lb://mssmc-catalogos"))
				.route("mssmc-login", r -> r.path("/mssmc-login/v1/**")
						.filters(f -> f.filter(filter))
						.uri("lb://mssmc-login"))
				.route("mssmc-correos", r -> r.path("/mssmc-correos/v1/**")
						.filters(f -> f.filter(filter))
						.uri("lb://mssmc-correos"))
				.route("mssmc-usuarios", r -> r.path("/mssmc-usuarios/v1/**")
						.filters(f -> f.filter(filter))
						.uri("lb://mssmc-usuarios"))
				.route("mssmc-clientes", r -> r.path("/mssmc-clientes/v1/**")
						.filters(f -> f.filter(filter))
						.uri("lb://mssmc-clientes"))
				.route("mssmc-configuraciones", r -> r.path("/mssmc-configuraciones/v1/**")
						.filters(f -> f.filter(filter))
						.uri("lb://mssmc-configuraciones"))
				.route("mssmc-dashboards", r -> r.path("/mssmc-dashboards/v1/**")
						.filters(f -> f.filter(filter))
						.uri("lb://mssmc-dashboards"))
				.route("mssmc-notificaciones", r -> r.path("/mssmc-notificaciones/v1/**")
						.filters(f -> f.filter(filter))
						.uri("lb://mssmc-notificaciones"))
				.route("mssmc-tickets", r -> r.path("/mssmc-tickets/v1/**")
						.filters(f -> f.filter(filter))
						.uri("lb://mssmc-tickets"))
				.route("mssmc-orquest", r -> r.path("/mssmc-orquest/v1/**")
						.filters(f -> f.filter(filter))
						.uri("lb://mssmc-orquest"))
				
				.build();
	}
	
	
}
