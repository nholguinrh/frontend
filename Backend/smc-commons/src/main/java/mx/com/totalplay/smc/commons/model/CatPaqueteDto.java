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
public class CatPaqueteDto {

	private Integer idCatPaquete;

	private String descripcion;

	private String informacion;

	private Integer cantidadUsuarios;

	private LocalDateTime fechaCreacion;
	
	private UsuarioDto creadoPor;

	private LocalDateTime fechaActualizacion;
	
	private UsuarioDto actualizadoPor;

	private LocalDateTime fechaBaja;

	private UsuarioDto eliminadoPor;

}
