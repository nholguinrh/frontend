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
public class ClienteUsuarioDto {

	private Long idClienteUsuarios;
	private UsuarioDto usuario;
	private ClienteDto cliente;
	private DashboardDto dashboardDto;
	private UsuarioDto creadoPor;
	private LocalDateTime fechaCreacion;
	private UsuarioDto actualizadoPor;
	private LocalDateTime fechaActualizacion;
	private LocalDateTime fechaExpPwd;
	private UsuarioDto eliminadoPor;
	private LocalDateTime fechaBaja;
}
