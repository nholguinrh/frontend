package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailModel {

	private String[] receptor;

	private FileModel[] attachment;

	private String codigo;

	private boolean reenvio;

	private EmailType tipo;

	private String extension;

	private String nombreCompleto;
	
	private String numeroContrato;
	
	private String password;
	
	private String razonSocial;
	
	private String email;
	
	private String IdUsuario;
	
	private String idCatPerfiles;
	
	private String idEmpresa;

}
