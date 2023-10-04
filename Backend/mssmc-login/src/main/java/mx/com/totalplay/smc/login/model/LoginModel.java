package mx.com.totalplay.smc.login.model;

import lombok.Data;

@Data
public class LoginModel {

	private String usuario;
	private String contrato;
	private String contrasenia;
	private String ip;
	private String nombre;
	private String email;
}
