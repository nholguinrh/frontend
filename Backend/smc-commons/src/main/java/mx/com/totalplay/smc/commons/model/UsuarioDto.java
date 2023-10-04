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
public class UsuarioDto {

	private Integer idUsuario;

	private String nombreCompleto;

	private String email;

	private String pwd;

	private CatEstatusDto tbCatEstatus;
	
	private CatPerfilDto tbCatPerfil;

	private LocalDateTime fechaCreacion;

	private int reenvioPwd;

	private String emailPromotor;
	
	private String codigoVerificacion;
	
	private Long idCliente;
	
	private String idClienteTotalplay;

}
