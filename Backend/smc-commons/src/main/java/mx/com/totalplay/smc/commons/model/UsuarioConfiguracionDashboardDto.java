package mx.com.totalplay.smc.commons.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.com.totalplay.smc.entities.TbDashboard;
import mx.com.totalplay.smc.entities.TbUsuario;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioConfiguracionDashboardDto {
	
	private Long idClienteUsuario;

	private TbUsuario tbUsuario;

	private TbDashboard tbDashboard;

	private String aspecto;

	private LocalDateTime fechaActualizacion;

}
