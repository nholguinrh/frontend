package mx.com.totalplay.smc.gateway.filter;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import io.jsonwebtoken.Claims;
import mx.com.totalplay.smc.gateway.exception.JwtTokenMalformedException;
import mx.com.totalplay.smc.gateway.exception.JwtTokenMissingException;
import mx.com.totalplay.smc.gateway.util.JwtUtil;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GatewayFilter {

	@Autowired
	private JwtUtil jwtUtil;
	
	@Override
	public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
		ServerHttpRequest request = (ServerHttpRequest) exchange.getRequest();

		//TODO Se excluyen de la authotizacion
		final List<String> apiEndpoints = new ArrayList<>();
		apiEndpoints.add("/auth/token");
		apiEndpoints.add("/login");
		apiEndpoints.add("/loginContrato");
		apiEndpoints.add("/generar-codigo-cte");
		apiEndpoints.add("/generar-codigo-usr");
		apiEndpoints.add("/generar-codigo-pwd");
		apiEndpoints.add("/validar-codigo-cte");
		apiEndpoints.add("/validar-codigo-usr");
		apiEndpoints.add("/validar-codigo-pwd");
		apiEndpoints.add("/actualizar-contrasenia");
		apiEndpoints.add("/login-invitacion-usr");
		apiEndpoints.add("/enviar-correo");
		apiEndpoints.add("/enviar-correo-Async");
		
		Predicate<ServerHttpRequest> isApiSecured = r -> apiEndpoints.stream()
				.noneMatch(uri -> r.getURI().getPath().contains(uri));
		
		if (isApiSecured.test(request)) {
			if (!request.getHeaders().containsKey("Authorization")) {
				ServerHttpResponse response = exchange.getResponse();
				response.setStatusCode(HttpStatus.UNAUTHORIZED);

				return response.setComplete();
			}

			final String token = request.getHeaders().getOrEmpty("Authorization").get(0);

			try {
				jwtUtil.validateToken(token);
			} catch (JwtTokenMalformedException | JwtTokenMissingException e) {
				System.out.println("Token expirado");
				ServerHttpResponse response = exchange.getResponse();
				response.setStatusCode(HttpStatus.UNAUTHORIZED);

				return response.setComplete();
			}

			Claims claims = jwtUtil.getClaims(token);
			exchange.getRequest().mutate().header("id", String.valueOf(claims.get("id"))).build();
		}
 
		return chain.filter(exchange);
	}

}
