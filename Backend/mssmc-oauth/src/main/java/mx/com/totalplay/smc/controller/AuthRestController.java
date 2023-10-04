package mx.com.totalplay.smc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mx.com.totalplay.smc.model.UsuarioApp;
import mx.com.totalplay.smc.util.JwtUtil;

@RestController
@RequestMapping("/auth/")
public class AuthRestController {

	@Autowired
	private JwtUtil jwtUtil;

	@PostMapping("token")
	public ResponseEntity<String> login(@RequestBody UsuarioApp usrApp) {
		String token = jwtUtil.generateToken(usrApp.getUser(), usrApp.getPassword());

		return new ResponseEntity<String>(token, HttpStatus.OK);
	}
}
