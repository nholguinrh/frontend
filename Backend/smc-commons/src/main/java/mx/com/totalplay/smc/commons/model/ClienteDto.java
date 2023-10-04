package mx.com.totalplay.smc.commons.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ClienteDto {

	private Long idCliente;

	private CatPaqueteDto tbCatPaquete;

	private CatEstatusDto tbCatEstatus;

	private String razonSocial;

	private String representante;

	private String email;

	private String telefonoCelular;

	private String telefonoFijo;

	private String contrato;

	private Integer totalPuntas;

	private String observaciones;

	private Integer indicadorFavorito;

	private String rfc;

	private LocalDateTime fechaContratacion;

	private String ipClienteRegistro;

	private Integer numeroUsuarios;

	private String idClienteTotalPlay;
	
	private String pwd;

	private UsuarioDto creadoPor;

	private LocalDateTime fechaCreacion;

	private UsuarioDto actualizadoPor;

	private LocalDateTime fechaActualizacion;

	private LocalDateTime fechaBaja;

	private UsuarioDto eliminadoPor;
	
	private Integer enlacesContratados;
	
	private Integer sitiosContratados;
	
	private Integer serviciosContratados;

}
