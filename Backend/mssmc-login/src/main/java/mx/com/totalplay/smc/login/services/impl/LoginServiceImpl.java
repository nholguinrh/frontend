/**
 * 
 */
package mx.com.totalplay.smc.login.services.impl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.UsuarioDto;
import mx.com.totalplay.smc.commons.utils.ConstantesApi;
import mx.com.totalplay.smc.commons.utils.EncriptacionAESApi;
import mx.com.totalplay.smc.commons.utils.HttpStatusApi;
import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClienteUsuarios;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.entities.TbUsuarioValidacion;
import mx.com.totalplay.smc.login.model.LoginModel;
import mx.com.totalplay.smc.login.services.ILoginService;
import mx.com.totalplay.smc.repositories.ICatEstatusRepository;
import mx.com.totalplay.smc.repositories.IClienteRepository;
import mx.com.totalplay.smc.repositories.IClienteUsuarioRepository;
import mx.com.totalplay.smc.repositories.IUsuarioRepository;
import mx.com.totalplay.smc.repositories.IUsuarioValidacionRepository;

/**
 * @author Luis Luna
 *
 */
@Slf4j
@Service
public class LoginServiceImpl implements ILoginService{
	
	private ModelMapper modelMapper = new ModelMapper();
	
	@Autowired
	private IClienteRepository clienteRepository;
	
	@Autowired
	private IUsuarioRepository usuarioRepository;
	
	@Autowired
	private ICatEstatusRepository estatusRepository;
	
	@Autowired
	private IClienteUsuarioRepository clienteUsuarioRepository;
	
	@Autowired
	private IUsuarioValidacionRepository usuarioValidacionRepo;
	
	@Autowired
	private EncriptacionAESApi aesApi;

	@Override
	public TbClienteUsuarios loginContrato(LoginModel model) {
		
		log.info("LoginServiceImpl -> loginContrato -> {}", model);
		TbCliente tbCliente = clienteRepository.findByContrato(model.getContrato());
		
		if (tbCliente == null) 
			throw new ApiException(HttpStatusApi._301, "El cliente no se encuentra registrado en el sistema.");
		
		TbCatEstatus tbCatEstatusOnboarding = estatusRepository.findByDescripcionAndTipoEstatus
				("Onboarding", "C");
		if (tbCliente.getTbCatEstatus().getIdCatEstatus() != tbCatEstatusOnboarding.getIdCatEstatus())
			throw new ApiException(HttpStatusApi._301, "El cliente no tiene un estatus Onboarding."
					+ " No es posible completar el proceso de Onboarding");
		
		TbUsuario usr = usuarioRepository.findByEmail(tbCliente.getEmail());
		
		if (usr == null) 
			throw new ApiException(HttpStatusApi._301, "El cliente no cuenta con un representante registrado.");
		
		String pwdEncrypt;
//		String pwdDecrypt;
		
		try {
			pwdEncrypt = aesApi.encriptar(model.getContrasenia());
//			pwdDecrypt = aesApi.desencriptar(pwdEncrypt);
		} catch (Exception e) {
			throw new ApiException(HttpStatusApi._500, "Error: " + e.getMessage());
		}

//		if (!usr.getPwd().equals(model.getContrasenia())) 
//			throw new ApiException(HttpStatusApi._301, "La contraseña es incorrecta.");
		
		if (!usr.getPwd().equals(pwdEncrypt)) 
			throw new ApiException(HttpStatusApi._301, "La contraseña es incorrecta.");
				
		
//		if (!tbCliente.getIpClienteRegistro().equals(model.getIp()))
//			throw new ApiException(HttpStatusApi._301, "La IP no coincide."
//					+ " No es posible completar el proceso de Onboarding");
		
		TbClienteUsuarios cteUsr = clienteUsuarioRepository.findByTbUsuarioAndTbCliente(usr, tbCliente);
		
		return cteUsr;
	}
	
	@Override
	public UsuarioDto loginInvitacionUsr(LoginModel model) {
		
		log.info("LoginServiceImpl -> loginInvitacionUsr -> {}", model);
		TbUsuario usuario = usuarioRepository.findByEmail(model.getEmail());
		
		if (usuario == null) 
			throw new ApiException(HttpStatusApi._301, "El usuario no se encuentra registrado en el sistema.");
		
		TbCatEstatus tbCatEstatusOnboarding = estatusRepository.findByDescripcionAndTipoEstatus
				("Pendiente", "U");
		if (usuario.getTbCatEstatus().getIdCatEstatus() != tbCatEstatusOnboarding.getIdCatEstatus())
			throw new ApiException(HttpStatusApi._301, "El usuario no tiene un estatus Onboarding."
					+ " No es posible completar el proceso de Onboarding");
		
		String pwdEncrypt;
		try {
			pwdEncrypt = aesApi.encriptar(model.getContrasenia());
		} catch (Exception e) {
			throw new ApiException(HttpStatusApi._500, "Error: " + e.getMessage());
		}		
		//Actualizamos el nombre del usuario y el password
		usuario.setNombreCompleto(model.getNombre());
//		usuario.setPwd(model.getContrasenia());
		usuario.setPwd(pwdEncrypt);
		//Usuario Valdiación
		TbUsuarioValidacion validarToken = usuarioValidacionRepo.findByTbUsuarioAndTipoValidacion(usuario,1);
		
		if(validarToken != null && (validarToken.getTbCatEstatus().getIdCatEstatus() == ConstantesApi.ESTATUS_CODIGO_VALIDADO.getCode() ) ) {
			usuario.setTbCatEstatus(estatusRepository.findByDescripcionAndTipoEstatus("Activo", "U"));
		}
		return modelMapper.map(usuarioRepository.save(usuario), UsuarioDto.class);
	}

}
