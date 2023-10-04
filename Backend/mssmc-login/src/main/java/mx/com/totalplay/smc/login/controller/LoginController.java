package mx.com.totalplay.smc.login.controller;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import feign.FeignException.Unauthorized;
import lombok.extern.slf4j.Slf4j;
import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.ActualizarContraseniaModel;
import mx.com.totalplay.smc.commons.model.ResponseEntityModel;
import mx.com.totalplay.smc.commons.model.UsuarioDto;
import mx.com.totalplay.smc.commons.services.IClienteUsuarioService;
import mx.com.totalplay.smc.commons.services.IParametrosService;
import mx.com.totalplay.smc.commons.services.IUsuarioService;
import mx.com.totalplay.smc.commons.utils.ConstantesApi;
import mx.com.totalplay.smc.commons.utils.HttpStatusApi;
import mx.com.totalplay.smc.entities.TbClienteUsuarios;
import mx.com.totalplay.smc.entities.TbParametros;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.login.model.LoginModel;
import mx.com.totalplay.smc.login.model.ValidarCodigoModel;
import mx.com.totalplay.smc.login.services.ICodigoVerificacionService;
import mx.com.totalplay.smc.login.services.ILoginService;

@Slf4j
@RestController
@RequestMapping("/")
public class LoginController {

	@Autowired
	private ICodigoVerificacionService iCodVerSrv;

	@Autowired
	private IUsuarioService usuarioService;
	
	@Autowired
	private IClienteUsuarioService iClienteUsuarioSrv;
	
	@Autowired
	private ILoginService loginService;

	@Autowired
	private IParametrosService iParametrosService;
	
	
	@PostMapping("login")
	public ResponseEntity<?> doLogin(@RequestBody LoginModel model) {
		log.debug("doLogin: {} ", model);

		if (model == null || StringUtils.trimToNull(model.getUsuario()) == null
				|| StringUtils.trimToNull(model.getContrasenia()) == null) {
			return ResponseEntity.ok(
					new ResponseEntityModel<String>(null, HttpStatusApi._500, "Todos los parámetros son requeridos."));
		}
		try {
			UsuarioDto dto = usuarioService.obtenerUsuario(model.getUsuario(), model.getContrasenia());
			return ResponseEntity.ok(new ResponseEntityModel<UsuarioDto>(dto, HttpStatusApi._200, "Login OK"));

		} catch (ApiException e) {
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, e.getCode(), e.getMessage()));
		}
	}

	@PostMapping("loginContrato")
	public ResponseEntity<?> doLoginClientes(@RequestBody LoginModel model) {
		log.debug("doLoginOnboarding: {} ", model);
		if (model == null || StringUtils.trimToNull(model.getContrato()) == null
				|| StringUtils.trimToNull(model.getContrasenia()) == null) {
//				|| StringUtils.trimToNull(model.getIp()) == null) {
			return ResponseEntity.ok(
					new ResponseEntityModel<String>
					(null, HttpStatusApi._500, "Todos los parámetros son requeridos."));
		}
		try {

//			TbCliente tbCliente = clienteService.obtenerCliente
//					(model.getContrato(), model.getContrasenia(), model.getIp());
//			if(tbCliente == null) {
//				return ResponseEntity.ok(new ResponseEntityModel<Void>
//				(null, HttpStatusApi._301, "El cliente no encuentra registrado en el sistema"));
//			}
			
//			return ResponseEntity.ok(new ResponseEntityModel<TbCliente>
//				(tbCliente, HttpStatusApi._200, "Login Onboarding OK"));
			return ResponseEntity.ok(new ResponseEntityModel<TbClienteUsuarios>
			(loginService.loginContrato(model), HttpStatusApi._200, "Login Onboarding OK"));

		} catch (ApiException e) {
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, e.getCode(), e.getMessage()));
		}
	}

	@PostMapping("generar-codigo-cte")
	public ResponseEntity<?> generarCodigoCliente(@RequestHeader HttpHeaders headers,
			@RequestParam("idCliente") Long idCliente) {
		log.debug("Generar Código Cte: {} ", idCliente);
		
		String token = headers.getFirst(HttpHeaders.AUTHORIZATION);

		try {
			List<TbUsuario> usuarios = iClienteUsuarioSrv.listarPorIdCliente(idCliente);
			if( usuarios.size() == 1) {
				TbUsuario tbUsuario = usuarios.get(0);
				iCodVerSrv.generayEnviaCodigo(token, tbUsuario.getIdUsuario());
			} else  if(usuarios.isEmpty()) {
				return ResponseEntity
						.ok(new ResponseEntityModel<Void>(null, HttpStatusApi._301, "No existe usuario para el cliente: " + idCliente));
			}else if( usuarios.size() > 1) {
				return ResponseEntity
						.ok(new ResponseEntityModel<Void>(null, HttpStatusApi._301, "El cliente ya cuenta con usuarios registrados."));
			}
		return ResponseEntity
				.ok(new ResponseEntityModel<String>("Éxito", HttpStatusApi._200, "Código Generado y enviado"));
		
		} catch (Exception e) {
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, HttpStatusApi._500, e.getMessage()));
		}
	}
	
	@PostMapping("generar-codigo-usr")
	public ResponseEntity<?> generarCodigoUsuario(@RequestHeader HttpHeaders headers,
			@RequestParam("email") String email) {
		log.debug("Generar Código Usr: {} ", email);
		String token = headers.getFirst(HttpHeaders.AUTHORIZATION);

		try {
			TbUsuario tbUsuario = usuarioService.obtenerUsuario(email);
			if(tbUsuario == null) {
				return ResponseEntity.ok(new ResponseEntityModel<String>(null, HttpStatusApi._301,
						"El correo electrónico no está registrado."));
			}		
			iCodVerSrv.generayEnviaCodigo(token, tbUsuario.getIdUsuario());
			
			return ResponseEntity
						.ok(new ResponseEntityModel<String>(null, HttpStatusApi._200,
								"Se envió correctamente el código de verificación"));
		}catch (Unauthorized e) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, HttpStatusApi._500, e.getMessage()));
		}
	}
		
	
	@PostMapping("generar-codigo-pwd")
	public ResponseEntity<?> generarCodigoRecuperarPwd(@RequestHeader HttpHeaders headers,
			@RequestParam("email") String email) {
		log.debug("Generar Código Usr: {} ", email);
		String token = headers.getFirst(HttpHeaders.AUTHORIZATION);

		try {
			TbUsuario tbUsuario = usuarioService.obtenerUsuario(email);
			if(tbUsuario == null) {
				return ResponseEntity.ok(new ResponseEntityModel<String>(null, HttpStatusApi._301,
						"El correo electrónico no está registrado."));
			}		
			if(tbUsuario.getTbCatEstatus().getIdCatEstatus() != ConstantesApi.ESTATUS_U_ACTIVO.getCode()) {
				return ResponseEntity
						.ok(new ResponseEntityModel<String>(null, HttpStatusApi._301,
								"El usuario no es apto para recuperación de contraseña. Estatus: "
										+ tbUsuario.getTbCatEstatus().getDescripcion()));
			}
			
			iCodVerSrv.generayEnviaCodigoRecuperarPwd(token, tbUsuario.getIdUsuario());
			
			return ResponseEntity
					.ok(new ResponseEntityModel<String>(null, HttpStatusApi._200,
							"Se envió correctamente el código de verificación para recuperación de contraseña"));
			
		}catch (Unauthorized e) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, HttpStatusApi._500, e.getMessage()));
		}
	}

	@PostMapping("validar-codigo-cte")
	public ResponseEntity<?> validarCodigoCliente(@RequestBody ValidarCodigoModel request) {
		log.debug("validarCodigo: {} ", request.getCodigo());

		
		if (StringUtils.trimToNull(request.getCodigo()) == null)
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, HttpStatusApi._201,
					"El código de verificación es requerido"));

		if (request.getId() == null || request.getId() <= 0)
			return ResponseEntity
					.ok(new ResponseEntityModel<String>(null, HttpStatusApi._201, "El idCliente es requerido"));
		
		List<TbUsuario> usuarios = iClienteUsuarioSrv.listarPorIdCliente(request.getId());
		if( usuarios.size() == 1) {
			TbUsuario tbUsuario = usuarios.get(0);
			request.setId(new Long(tbUsuario.getIdUsuario()));
			
		} else  if(usuarios.isEmpty()) {
			return ResponseEntity
					.ok(new ResponseEntityModel<Void>(null, HttpStatusApi._301, "No existe usuario para el cliente: " + request.getId()));
		}else if( usuarios.size() > 1) {
			return ResponseEntity
					.ok(new ResponseEntityModel<Void>(null, HttpStatusApi._301, "El cliente ya cuenta con usuarios registrados."));
		}
		
		try {
			return ResponseEntity.ok(iCodVerSrv.validarCodigo(request));
		} catch (Unauthorized e) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}catch (ApiException e) {
			log.error("Error al validar código de Usuario", e);
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, e.getCode(), e.getMessage()));

		}
	}
	
	@PostMapping("validar-codigo-usr")
	public ResponseEntity<?> validarCodigoUsuario(@RequestBody ValidarCodigoModel request) {
		log.debug("validarCodigo: {} ", request.getCodigo());

		if (StringUtils.trimToNull(request.getCodigo()) == null)
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, HttpStatusApi._201,
					"El código de verificación es requerido"));

		if (StringUtils.trimToNull(request.getEmail()) == null) {			
			return ResponseEntity
					.ok(new ResponseEntityModel<String>(null, HttpStatusApi._201, "El email es requerido"));
		}
		TbUsuario tbUsuario = usuarioService.obtenerUsuario(request.getEmail());
		if(tbUsuario == null) {
			return ResponseEntity
					.ok(new ResponseEntityModel<String>(null, HttpStatusApi._301, "El correo electrónico no está registrado."));
		}
		try {
			request.setIdUsuario(tbUsuario.getIdUsuario());
			
			ResponseEntityModel<UsuarioDto> validarCodigo = iCodVerSrv.validarCodigo(request);
			
			return ResponseEntity.ok(validarCodigo);
			
		} catch (Unauthorized e) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}catch (ApiException e) {
			log.error("Error al validar código de Usuario", e);
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, e.getCode(), e.getMessage()));

		}
		
	}
	
	@PostMapping("validar-codigo-pwd")
	public ResponseEntity<?> validarCodigoRecuperarPwd(@RequestBody ValidarCodigoModel request) {
		log.debug("validarCodigo: {} ", request.getCodigo());

		if (StringUtils.trimToNull(request.getCodigo()) == null)
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, HttpStatusApi._201,
					"El código de verificación es requerido"));

		if (StringUtils.trimToNull(request.getEmail()) == null) {			
			return ResponseEntity
					.ok(new ResponseEntityModel<String>(null, HttpStatusApi._201, "El idUsuario es requerido"));
		}
		TbUsuario tbUsuario = usuarioService.obtenerUsuario(request.getEmail());
		if(tbUsuario == null) {
			return ResponseEntity
					.ok(new ResponseEntityModel<String>(null, HttpStatusApi._301, "El correo electrónico no está registrado."));
		}
		try {
			request.setIdUsuario(tbUsuario.getIdUsuario());
			iCodVerSrv.validarCodigoRecuperarPwd(request);
			return ResponseEntity.ok(new ResponseEntityModel<UsuarioDto>(UsuarioDto.builder().idUsuario(tbUsuario.getIdUsuario()).build(), 
					HttpStatusApi._200,
					"El código de verificación es correcto."));
		} catch (Unauthorized e) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}catch (ApiException e) {
			log.error("Error al validar código de Usuario", e);
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, e.getCode(), e.getMessage()));

		}
	}

	@PostMapping("actualizar-contrasenia")
	public ResponseEntity<?> actualizarContrasenia(@RequestBody ActualizarContraseniaModel request) {
		log.debug("Actualizar Contrasenia usuario: {} ", request.getIdUsuario());

		if (StringUtils.trimToNull(request.getContrasenia()) == null)
			return ResponseEntity
					.ok(new ResponseEntityModel<String>(null, HttpStatusApi._201, "La contraseña es requerida."));

		if (request.getIdUsuario() == null || request.getIdUsuario() <= 0)
			return ResponseEntity
					.ok(new ResponseEntityModel<String>(null, HttpStatusApi._201, "El idUsuario es requerido."));

		usuarioService.actualizarContrasenia(request);
		

		return ResponseEntity.ok(new ResponseEntityModel<String>(null, HttpStatusApi._200, "La contraseña se actualizó correctamente."));
	
	}
	
	@PostMapping("login-invitacion-usr")
	public ResponseEntity<?> loginInvitacionUsr(@RequestBody LoginModel model) {
		log.debug("doLoginOnboarding: {} ", model);
		if (model == null || StringUtils.trimToNull(model.getContrato()) == null
				|| StringUtils.trimToNull(model.getContrasenia()) == null) {
			return ResponseEntity.ok(
					new ResponseEntityModel<String>
					(null, HttpStatusApi._500, "Todos los parámetros son requeridos."));
		}
		try {

			return ResponseEntity.ok(new ResponseEntityModel<UsuarioDto>
			(loginService.loginInvitacionUsr(model), HttpStatusApi._200, "Login Onboarding OK"));

		} catch (ApiException e) {
			return ResponseEntity.ok(new ResponseEntityModel<String>(null, e.getCode(), e.getMessage()));
		}
	}
	
	@GetMapping("version-sistema")
	public ResponseEntity<?> obtenerVersionDelSistema(){
		TbParametros parameter = iParametrosService.buscarPorId("SYSTEM_VERSION");
		if(parameter != null) {
			return ResponseEntity.ok(new ResponseEntityModel<String>(parameter.getValor(), HttpStatusApi._200, "Get System version OK"));
		}else {			
			return ResponseEntity.ok(new ResponseEntityModel<String>("0.0", HttpStatusApi._201, "Get System version FAIL"));
		}
	}

}
