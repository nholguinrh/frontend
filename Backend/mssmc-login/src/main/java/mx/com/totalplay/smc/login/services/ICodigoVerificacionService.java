package mx.com.totalplay.smc.login.services;

import mx.com.totalplay.smc.commons.model.ResponseEntityModel;
import mx.com.totalplay.smc.commons.model.UsuarioDto;
import mx.com.totalplay.smc.login.model.ValidarCodigoModel;

public interface ICodigoVerificacionService {

	void generayEnviaCodigo(String bearer, Integer idUsuario) throws Exception;

	ResponseEntityModel<UsuarioDto> validarCodigo(ValidarCodigoModel request);

	ResponseEntityModel<String> validarCodigoRecuperarPwd(ValidarCodigoModel request);

	void generayEnviaCodigoRecuperarPwd(String bearer, Integer idUsuario);

}
