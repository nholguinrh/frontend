package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestVozDto {
	
	private String fechaInicio;
	private String fechaFin;
	private String idEmpresa;
	private String idDispositivo;
	private String metrica;
	private String agrupadoPor;

}
