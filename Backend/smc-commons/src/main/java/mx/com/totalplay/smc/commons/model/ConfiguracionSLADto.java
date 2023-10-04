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
public class ConfiguracionSLADto {

	private Long idConfiguracionSLA;

	private CatEstatusDto tbCatEstatus;

	private String tituloSLA;

	private String descripcion;

	private Integer slaUtilizado;

	private Long totalPuntasConfiguradas;

	private Long totalInterfacesConfiguradas;
	
	private Long totalEnlacesConfiguradas;

	private Integer indicaPlantilla;

	private LocalDateTime fechaCreacion;

	private UsuarioDto creadoPor;

	private LocalDateTime fechaActualizacion;

	private UsuarioDto actualizadoPor;

}
