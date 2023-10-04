package mx.com.totalplay.smc.commons.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CatPerfilDto {

	private Integer idCatPerfil;

	private String descripcion;

	private String informacion;

	private CatEstatusDto tbCatEstatus;

	private String imagen;
	
	private String tipo;
	
	private UsuarioDto creadoPor;

	private LocalDate fechaCreacion;

	private UsuarioDto actualizadoPor;

	private LocalDate fechaActualizacion;

	private LocalDate fechaBaja;

	private UsuarioDto eliminadoPor;

}
