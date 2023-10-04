package mx.com.totalplay.smc.commons.model;

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
public class UsuarioAdmFavDto {

	private Integer idFav;

	private ClienteDto tbCliente;
	
	private UsuarioDto tbUsuario;

}
