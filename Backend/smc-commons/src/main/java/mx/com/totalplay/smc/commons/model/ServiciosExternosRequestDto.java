package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ServiciosExternosRequestDto {
	
	private String fechaInicio;
	private String fechaFin;
	private String idEmpresa;
	private String idServicio;
	private String idDispositivo;
	private String tipoDispositivo;
	private String folioTicket;
	private String folioTicketExterno;
	private String metrica;
	private String ipNs;
	private String funcionalidad;
	private String tiempo;
	private boolean full;
	private boolean historico;
	private int numRegistros;
	private String token;

}
