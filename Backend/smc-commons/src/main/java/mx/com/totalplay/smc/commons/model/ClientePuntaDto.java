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
public class ClientePuntaDto {

	private Long idClientePunta;

	private ClienteDto tbCliente;

	private CatEstatusDto tbCatEstatus;

	private ConfiguracionSLADto tbConfiguracionSLA;

	private String enlace;

	private String ipns;

	private String sitio;

	private String alias;

	private Integer posicion;

	private Integer nodoCentral;

	private String tipoPunta;

//	private Boolean activarPunta;

	private LocalDateTime fechaCreacion;

	private UsuarioDto creadoPor;

	private LocalDateTime fechaActualizacion;

	private UsuarioDto actualizadoPor;

	private LocalDateTime fechaBaja;

	private UsuarioDto eliminadoPor;
	
	private Double latitud;
	
	private Double longitud;
	
	private String estado;
	
	private Integer numeroInterfaces;
	
	private Integer interfacesActivas;

}
