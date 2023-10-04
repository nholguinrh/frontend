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
public class PuntaInterfazDto {

	private Long idPuntaInterfaz;

	private ClientePuntaDto tbClientePunta;

	private CatEstatusDto tbCatEstatus;

	private ConfiguracionSLADto tbConfiguracionSLA;

	private String interfaz;

	private String alias;

	private Boolean activarInterfaz;

	private String tipoServicios;

	private UsuarioDto creadoPor;

	private LocalDateTime fechaCreacion;

	private UsuarioDto actualizadoPor;

	private LocalDateTime fechaActualizacion;

	private LocalDateTime fechaBaja;

	private UsuarioDto eliminadoPor;
}
