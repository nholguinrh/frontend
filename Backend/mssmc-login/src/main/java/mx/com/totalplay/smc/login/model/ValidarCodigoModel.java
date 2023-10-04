/**
 * 
 */
package mx.com.totalplay.smc.login.model;

import lombok.Getter;
import lombok.Setter;

/**
 * @author Luis Luna
 *
 */

@Getter
@Setter
public class ValidarCodigoModel {
	
	private Long id;
	private String email;
	private String codigo;
	private Integer idUsuario;

}
