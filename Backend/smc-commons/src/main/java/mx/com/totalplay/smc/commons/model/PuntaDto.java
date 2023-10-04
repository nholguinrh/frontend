package mx.com.totalplay.smc.commons.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PuntaDto {
	
	private String enlace;
	private String estatus;
	private String estatusDescripcion;
	private String idDispositivo;
	private String ipNs;
	private String sitio;
	private String tipo;
	private String host;
	private String nombre;
	private String conecta_con;
	private List<InterfaceDto> servicios;
	

}
