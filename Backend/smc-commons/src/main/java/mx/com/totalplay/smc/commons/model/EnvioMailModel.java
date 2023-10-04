package mx.com.totalplay.smc.commons.model;

import lombok.Data;

@Data
public class EnvioMailModel {
	
	private ClienteDto cliente;
	private EmailType tipo;

}
