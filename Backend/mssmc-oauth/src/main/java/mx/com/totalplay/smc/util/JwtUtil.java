package mx.com.totalplay.smc.util;

import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import mx.com.totalplay.smc.exception.JwtTokenMalformedException;
import mx.com.totalplay.smc.exception.JwtTokenMissingException;
import mx.com.totalplay.smc.exception.UserNotFoundException;

@Component
public class JwtUtil {

	@Value("${authorization.signingKey}")
	private String jwtSecret;

	@Value("${authorization.tokenTime}")
	private long tokenValidity;

	@Value("${authorization.usernameWeb}")
	private String userNameWeb;

	@Value("${authorization.passwordWeb}")
	private String passwordWeb;

	public Claims getClaims(final String token) {
		try {
			Claims body = Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
			return body;
		} catch (Exception e) {
			System.out.println(e.getMessage() + " => " + e);
		}
		return null;
	}

	public String generateToken(String userName, String password) {
		boolean loadUserByUsername = loadUserByUsername(userName, password);

		if (loadUserByUsername) {
			Claims claims = Jwts.claims().setSubject(userName + password);
			long nowMillis = System.currentTimeMillis();
			long expMillis = nowMillis + tokenValidity;
			Date exp = new Date(expMillis);
			return Jwts.builder().setClaims(claims).setIssuedAt(new Date(nowMillis)).setExpiration(exp)
					.signWith(SignatureAlgorithm.HS512, jwtSecret).compact();
		} else {
			throw new UserNotFoundException("El usuario no está registrado ...");
		}

	}

	public void validateToken(final String token) throws JwtTokenMalformedException, JwtTokenMissingException {
		try {
			Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
		} catch (SignatureException ex) {
			throw new JwtTokenMalformedException("Invalid JWT signature");
		} catch (MalformedJwtException ex) {
			throw new JwtTokenMalformedException("Invalid JWT token");
		} catch (ExpiredJwtException ex) {
			throw new JwtTokenMalformedException("Expired JWT token");
		} catch (UnsupportedJwtException ex) {
			throw new JwtTokenMalformedException("Unsupported JWT token");
		} catch (IllegalArgumentException ex) {
			throw new JwtTokenMissingException("JWT claims string is empty.");
		}
	}

	public boolean loadUserByUsername(String refUsuario, String passwordClient) {

		String password = isUsuario(refUsuario);

		if (password == null) {

			return false;
		}
		if (StringUtils.trimToNull(passwordClient) == null) {
			return false;
		}
		if (!password.equals(passwordClient)) {
			return false;
		}

		return true;
	}

	private String isUsuario(String username) {

		if (userNameWeb.equals(username)) {
			return passwordWeb;
		}

		return null;
	}

}
