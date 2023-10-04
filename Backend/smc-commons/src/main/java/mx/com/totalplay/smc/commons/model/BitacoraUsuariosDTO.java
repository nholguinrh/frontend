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
public class BitacoraUsuariosDTO {
	
	private Long idBitacoraUsuario;

	private ClienteDto cliente;

	private String funcionalidad;

	private String tipoOperacion;

	private String datos;

	private LocalDateTime fechaCreacion;

	private UsuarioDto creadoPor;

	private UsuarioDto operadoPor;

}
