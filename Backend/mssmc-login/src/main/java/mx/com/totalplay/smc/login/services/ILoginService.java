/**
 * 
 */
package mx.com.totalplay.smc.login.services;

import mx.com.totalplay.smc.commons.model.UsuarioDto;
import mx.com.totalplay.smc.entities.TbClienteUsuarios;
import mx.com.totalplay.smc.login.model.LoginModel;

/**
 * @author Luis Luna
 *
 */
public interface ILoginService {

	TbClienteUsuarios loginContrato(LoginModel model);
	
	UsuarioDto loginInvitacionUsr(LoginModel model);
	

}
