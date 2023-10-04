package mx.com.totalplay.smc.commons.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class AsignacionSLAClientesDto {
	
	private Long idAsignacionSLAClientes;

	private ConfiguracionSLADto tbConfiguracionSLA;
	
	private ClienteDto tbCliente;
	
	private LocalDateTime fechaCreacion;
	
	private UsuarioDto creadoPor;
	
	private LocalDateTime fechaActualizacion;
	
	private UsuarioDto actualizadoPor;

}
