package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InterfaceDto {
	
	private String _interface;
	private int estatus;
	private String idDispositivo;
	private String tipoServicio;
	private String ipNs;
	private String conecta_con;
	

}
