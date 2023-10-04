/**
 * 
 */
package mx.com.totalplay.smc.commons.services.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.ActualizarContraseniaModel;
import mx.com.totalplay.smc.commons.model.CatEstatusDto;
import mx.com.totalplay.smc.commons.model.CatPerfilDto;
import mx.com.totalplay.smc.commons.model.CompletarRegistroModel;
import mx.com.totalplay.smc.commons.model.ResponseEntityModel;
import mx.com.totalplay.smc.commons.model.UsuarioDto;
import mx.com.totalplay.smc.commons.services.IUsuarioService;
import mx.com.totalplay.smc.commons.utils.ConstantesApi;
import mx.com.totalplay.smc.commons.utils.EncriptacionAESApi;
import mx.com.totalplay.smc.commons.utils.HttpStatusApi;
import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbCatPerfil;
import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClienteUsuarios;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.entities.TbUsuarioValidacion;
import mx.com.totalplay.smc.repositories.ICatEstatusRepository;
import mx.com.totalplay.smc.repositories.ICatPerfilRepository;
import mx.com.totalplay.smc.repositories.IClienteRepository;
import mx.com.totalplay.smc.repositories.IClienteUsuarioRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IUsuarioRepository;
import mx.com.totalplay.smc.repositories.IUsuarioValidacionRepository;

/**
 * @author jacob
 *
 */

@Service
public class UsuarioServiceImpl extends GenericServiceImpl<TbUsuario, Integer> implements IUsuarioService {

	private static final int ACTIVO = 1;
	private static final String Inactivo = "Inactivo";
	private static final String Usuario = "U";
	
	private ModelMapper modelMapper = new ModelMapper();

	@Autowired
	private IUsuarioRepository repo;

	@Autowired
	private ICatEstatusRepository estatusRepository;
	
	@Autowired
	private IClienteUsuarioRepository clienteUsuarioRepo;

	@Autowired
	private ICatPerfilRepository perfilRepository;
	
	@Autowired
	private IClienteRepository iClienteRepository;
	
	@Autowired
	private EncriptacionAESApi aesApi;
	
	@Autowired
	private IUsuarioValidacionRepository usuarioValidacionRepo;
	
	@Override
	protected IGenericRepository<TbUsuario, Integer> getRepo() {
		return repo;
	}

	@Override
	public TbUsuario registrarUsuario(Integer idUsuarioOpera, TbUsuario request, String tipo) throws ApiException {

		TbUsuario creadoPor = listarPorId(idUsuarioOpera);
				
		Integer invitado = repo.contarUsuarios(ConstantesApi.ESTATUS_U_ACTIVO.getCode(),tipo) + 
						   repo.contarUsuarios(ConstantesApi.ESTATUS_U_ONBOARDING.getCode(),tipo) +
						   repo.contarUsuarios(ConstantesApi.ESTATUS_U_PENDIENTE.getCode(),tipo) +
						   repo.contarUsuarios(ConstantesApi.ESTATUS_U_INACTIVO.getCode(),tipo)	+
				           1;		
		TbUsuario tbUsuario = obtenerUsuario(request.getEmail());
		
		if (creadoPor == null) 
			throw new ApiException(HttpStatusApi._201, "El Usuario que desea realizar esta operación no existe.");
		
		if (tbUsuario != null) 
			throw new ApiException(HttpStatusApi._201, "El usuario ya está registrado en el sistema."+" Estatus: "+tbUsuario.getTbCatEstatus().getIdCatEstatus()+" "+tbUsuario.getTbCatEstatus().getDescripcion() + " IdUsuario: "+tbUsuario.getIdUsuario());
		
		if (request.getNombreCompleto() == null)
			request.setNombreCompleto("Invitado " + invitado);

		try {
			//TODO: validar cifrar
			String pwd = "";
			if (request.getPwd() == null)
				pwd = aesApi.encriptar("Invitado" + invitado);
			else
				request.setPwd(aesApi.encriptar(request.getPwd()));
				
			request.setPwd(pwd);

			request.setTbCatEstatus(TbCatEstatus.builder().idCatEstatus(ConstantesApi.ESTATUS_U_PENDIENTE.getCode()).build());
			request.setFechaCreacion(LocalDateTime.now());

			return registrar(request);
		}catch (Exception e) {
			throw new ApiException(HttpStatusApi._500, e.getMessage());
		}
		
	}
	
	
	@Override
	public TbUsuario registrarUsuarioDeCliente(Integer idUsuarioOpera, TbClienteUsuarios request, String tipo) throws ApiException {

		TbUsuario creadoPor = listarPorId(idUsuarioOpera);
		Integer invitado = repo.countUsuariosCliente(request.getTbCliente().getIdCliente()) + 1;
		TbUsuario tbUsuario = obtenerUsuario(request.getTbUsuario().getEmail());
		
		if (creadoPor == null) 
			throw new ApiException(HttpStatusApi._201, "El Usuario que desea realizar esta operación no existe.");
		
		if (tbUsuario != null) 
			throw new ApiException(HttpStatusApi._201, "El usuario ya está registrado en el sistema."+" Estatus: "+tbUsuario.getTbCatEstatus().getIdCatEstatus()+" "+tbUsuario.getTbCatEstatus().getDescripcion() + " IdUsuario: "+tbUsuario.getIdUsuario());
		
		request.getTbUsuario().setNombreCompleto("Invitado " + invitado);

		try {
			//TODO: validar cifrar
			String pwd = "";
			pwd = aesApi.encriptar("Invitado" + invitado);
			request.getTbUsuario().setPwd(pwd);

			request.getTbUsuario().setTbCatEstatus(TbCatEstatus.builder().idCatEstatus(ConstantesApi.ESTATUS_U_PENDIENTE.getCode()).build());
			request.setFechaCreacion(LocalDateTime.now());

			return registrar(request.getTbUsuario());
		}catch (Exception e) {
			throw new ApiException(HttpStatusApi._500, e.getMessage());
		}
		
	}
	

	@Override
	public TbUsuario registrarUsuarioActualiza(Integer idUsuarioOpera, TbUsuario request) throws ApiException {

		try {
			TbUsuario user = listarPorId(idUsuarioOpera);
	        //TODO: validar cifrar?
			request.setNombreCompleto(user.getNombreCompleto());
//			request.setPwd(user.getPwd());
			request.setPwd(aesApi.encriptar(user.getPwd()));
			request.setTbCatEstatus(TbCatEstatus.builder().idCatEstatus(ConstantesApi.ESTATUS_U_PENDIENTE.getCode()).build());
			request.setFechaCreacion(LocalDateTime.now());

			return modificar(request);
		} catch (Exception e) {
			throw new ApiException(HttpStatusApi._500, e.getMessage());
		}
	}

	@Override
	public TbUsuario actualizarUsuario(Integer idUsuarioOpera, TbUsuario request) throws ApiException {

		TbUsuario modificadoPor = listarPorId(idUsuarioOpera);
		if (modificadoPor == null) {
			throw new ApiException(HttpStatusApi._201, "El Usuario que desea realizar esta operación no existe.");
		}

		TbUsuario tbUsuario = listarPorId(request.getIdUsuario());
		if (tbUsuario == null) {
			throw new ApiException(HttpStatusApi._201, "No se encontró el Usuario para id: " + request.getIdUsuario());
		}

		tbUsuario.setEmailPromotor(request.getEmailPromotor());
		tbUsuario.setNombreCompleto(request.getNombreCompleto());

		if (request.getTbCatEstatus() != null && request.getTbCatEstatus().getIdCatEstatus() != 0) {
			tbUsuario.setTbCatEstatus(
					TbCatEstatus.builder().idCatEstatus(request.getTbCatEstatus().getIdCatEstatus()).build());
		} else {
			throw new ApiException(HttpStatusApi._201, "El estatus es una propiedad requerida.");
		}

		if (request.getTbCatPerfil()!= null && request.getTbCatPerfil().getIdCatPerfil() != 0) {
			tbUsuario.setTbCatPerfil(TbCatPerfil.builder().idCatPerfil(request.getTbCatPerfil().getIdCatPerfil()).build());
		} else {
			throw new ApiException(HttpStatusApi._201, "El rol es una propiedad requerida.");
		}

		return modificar(tbUsuario);

	}

	@Override
	public ResponseEntityModel<String> actualizarContrasenia(ActualizarContraseniaModel request) {

		TbUsuario usr = this.listarPorId(request.getIdUsuario());
		if (usr == null)
			return new ResponseEntityModel<String>(null, HttpStatusApi._301,
					"No se encontró usuario con el id " + request.getIdUsuario());
		
		try {
			//Usuario Valdiación
			TbUsuarioValidacion validarToken = usuarioValidacionRepo.findByTbUsuarioAndTipoValidacion(usr,1);
			
			if(validarToken != null && (validarToken.getTbCatEstatus().getIdCatEstatus() == ConstantesApi.ESTATUS_CODIGO_VALIDADO.getCode() ) ) {
				usr.setTbCatEstatus(estatusRepository.findByDescripcionAndTipoEstatus("Activo", "U"));
			}			
			usr.setPwd(aesApi.encriptar(request.getContrasenia()));
			repo.save(usr);
		} catch (Exception e) {
			throw new ApiException(HttpStatusApi._500, "Error: " + e.getMessage());
		}
		
		List<TbCliente> clientes = iClienteRepository.findByEmailOrContrato(usr.getEmail(), null);
		
		if(clientes.size()>0) {
			TbCliente cliente = clientes.get(0);
			cliente.setTbCatEstatus(estatusRepository.findByDescripcionAndTipoEstatus("Activo", "C"));
			iClienteRepository.save(cliente);	
		}

		return new ResponseEntityModel<String>(null, HttpStatusApi._200, "La contraseña se actualizó correctamente.");
	}

	@Override
	public UsuarioDto obtenerUsuario(String usr, String passwd) throws ApiException {

		TbUsuario tbUsuario = repo.findByEmail(usr);

		if (tbUsuario == null) {
			throw new ApiException(HttpStatusApi._301, "El usuario no se encuentra registrado en el sistema.");
		}
		
		String pwdEncrypt;
//		String pwdDecrypt;
		try {
			pwdEncrypt = aesApi.encriptar(passwd);
//			pwdDecrypt = aesApi.desencriptar(pwdEncrypt);
		} catch (Exception e) {
			throw new ApiException(HttpStatusApi._500, "Error: " + e.getMessage());
		}

//		if (!tbUsuario.getPwd().equals(passwd)) {
//			throw new ApiException(HttpStatusApi._301, "La contraseña no coincide. Favor de intentar de nuevo.");
//		}
		
		if (!tbUsuario.getPwd().equals(pwdEncrypt)) {
			throw new ApiException(HttpStatusApi._301, "La contraseña no coincide. Favor de intentar de nuevo.");
		}

		if (tbUsuario.getTbCatEstatus().getIdCatEstatus() != ACTIVO) {
			throw new ApiException(HttpStatusApi._301, "El usuario no se encuentra ACTIVO.");
		}
		
		if("cliente".equals(tbUsuario.getTbCatPerfil().getTipo())) {
			TbClienteUsuarios cteUsr = clienteUsuarioRepo.findByTbUsuario(tbUsuario);
			
			return UsuarioDto.builder()
			.email(tbUsuario.getEmail())
			.idClienteTotalplay(cteUsr.getTbCliente().getIdClienteTotalPlay())
			.idCliente(cteUsr.getTbCliente().getIdCliente())
			.idUsuario(tbUsuario.getIdUsuario())
			.nombreCompleto(tbUsuario.getNombreCompleto())
			.tbCatPerfil(modelMapper.map(tbUsuario.getTbCatPerfil(), CatPerfilDto.class))
			.tbCatEstatus(modelMapper.map(tbUsuario.getTbCatEstatus(), CatEstatusDto.class))
			.build();
		}else return modelMapper.map(tbUsuario, UsuarioDto.class);
	}

	@Override
	public TbUsuario obtenerUsuario(String usr) throws ApiException {
		return repo.findByEmail(usr);
	}
	
	@Override
	public List<TbUsuario> obtenerUsuarioPorCliente(Long idCliente) {
		List<TbUsuario> usuarios = 
		clienteUsuarioRepo.listarUsuariosPorCliente(idCliente);
		
		if(usuarios.isEmpty()) throw new ApiException
		(HttpStatusApi._301, "No hay usuarios registrados para este cliente");
		
		return usuarios;
	}

	@Override
	public Page<TbUsuario> obtenerUsuariosAdmin(Pageable pageable) {
		TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus(Inactivo, Usuario);
		List<TbCatPerfil> perfil= perfilRepository.findByTipo("admin");
//		Page<TbUsuario> result = repo.findByTbCatPerfilIn(perfil, pageable);
		Page<TbUsuario> result = repo.findByTbCatPerfilInAndTbCatEstatusNot(perfil, estatus, pageable);
		return result;
	}

	@Override
	public TbUsuario completarRegistro(CompletarRegistroModel request) {
		
		TbUsuario tbUsuario = repo.findByCodigoVerificacion(request.getCodigo());
		if (tbUsuario == null) {
			throw new ApiException(HttpStatusApi._201, 
					"No se encontró un usuario con el código consultado.");
		}
		TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus("Pendiente", "U");
		if (tbUsuario.getTbCatEstatus() != estatus) {
			throw new ApiException(HttpStatusApi._301, 
					"El usuario no es apto para completar el registro.");
		}
		try {
			tbUsuario.setNombreCompleto(request.getNombre());
			//TODO: validar cifrar
//			tbUsuario.setPwd(request.getContrasenia());
			tbUsuario.setPwd(aesApi.encriptar(request.getContrasenia()));
			return modificar(tbUsuario);
		} catch (Exception e) {
			throw new ApiException(HttpStatusApi._500, 
					"Error: " + e.getMessage());
		}
		
	}

	@Override
	public Page<TbUsuario> obtenerUsuariosAdminPorFiltroNombresOEmail(String filtro, Pageable pageable) {
		Page<TbUsuario> listaUsuarios = 
				repo.listarUsuariosAdminPorFiltroNombresOEmail(filtro, pageable);
		
		return listaUsuarios;
	}
	
	@Override
	public List<TbUsuario> obtenerUsuariosActivosEjecutivoOperador() {
		return repo.findByTbCatEstatusAndTbCatPerfilIn(estatusRepository.findByDescripcionAndTipoEstatus("Activo", "U"), perfilRepository.findByTipo("cliente"));
	}
	
	@Override
	public List<TbUsuario> obtenerUsuariosActivosBackofficeAdministrador() {
		return repo.findByTbCatEstatusAndTbCatPerfilIn(estatusRepository.findByDescripcionAndTipoEstatus("Activo", "U"), 
				perfilRepository.findByTipoNot("cliente"));
	}

	@Override
	public TbUsuario eliminarLogico(TbUsuario tbUsuario) {
		TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus(Inactivo, Usuario);
		tbUsuario.setTbCatEstatus(estatus);
		
		return repo.save(tbUsuario);
	}

}