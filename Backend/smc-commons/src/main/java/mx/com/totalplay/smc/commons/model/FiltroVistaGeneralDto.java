package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FiltroVistaGeneralDto {
	
	private String idEmpresa;
	private String fechaInicio;
	private String fechaFin;
	private String tipoDispositivo;
	private String precision;
	private boolean isFull;
}
