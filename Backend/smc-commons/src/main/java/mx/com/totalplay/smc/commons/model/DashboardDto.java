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
public class DashboardDto {

	private Integer idDashboard;
	private String descripcion;
	private String informacion;
	private CatEstatusDto estatus;
	private UsuarioDto creadoPor;
	private LocalDateTime fechaCreacion;
	private UsuarioDto actualizadoPor;
	private LocalDateTime fechaActualizacion;
	private LocalDateTime fechaBaja;
	private UsuarioDto eliminadoPor;
	private String icono;
}
