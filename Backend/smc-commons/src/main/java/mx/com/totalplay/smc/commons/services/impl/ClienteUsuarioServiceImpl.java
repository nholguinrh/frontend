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
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.ClienteUsuarioDto;
import mx.com.totalplay.smc.commons.model.DashboardDto;
import mx.com.totalplay.smc.commons.model.FiltrarClientesCadenaModel;
import mx.com.totalplay.smc.commons.model.UsuarioDto;
import mx.com.totalplay.smc.commons.services.IClienteUsuarioService;
import mx.com.totalplay.smc.commons.services.IUsuarioService;
import mx.com.totalplay.smc.commons.utils.HttpStatusApi;
import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbCatPerfil;
import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClienteUsuarios;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.repositories.ICatEstatusRepository;
import mx.com.totalplay.smc.repositories.ICatPerfilRepository;
import mx.com.totalplay.smc.repositories.IClienteRepository;
import mx.com.totalplay.smc.repositories.IClienteUsuarioRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IUsuarioRepository;
import mx.com.totalplay.smc.repositories.IUsuarioValidacionRepository;

@Slf4j
@Service
public class ClienteUsuarioServiceImpl extends GenericServiceImpl<TbClienteUsuarios, Long>
		implements IClienteUsuarioService {
	
	private ModelMapper modelMapper = new ModelMapper(); 
 
	@Autowired
	private IClienteUsuarioRepository repo;

	@Autowired
	private IUsuarioService usuarioSrv;
	
	@Autowired
	private IClienteRepository clienteRepository;
	
	@Autowired
	private ICatPerfilRepository iCatPerfilRepository;
	
	@Autowired
	private IUsuarioRepository repoUsurRepository;
	
	@Autowired
	private ICatEstatusRepository estatusRepository;
	
	@Autowired
	private IUsuarioValidacionRepository iUsuarioValidaRepository;
	
	@Override
	protected IGenericRepository<TbClienteUsuarios, Long> getRepo() {
		return repo;
	}
	
	@Override
	public List<TbUsuario> listarPorIdCliente(Long idCliente) {
		TbCliente cte = clienteRepository.findById(idCliente).get();
		
		if(cte == null)
			throw new ApiException(HttpStatusApi._301, "No existe cliente con el id : " + idCliente);
		
		return repo.findByTbCliente(cte);
	}

	@Override
	public Page<TbUsuario> paginarPorIdCliente(Long idCliente, Pageable pageable) {
		TbCliente cte = clienteRepository.findById(idCliente).get();
		
		if(cte == null)
			throw new ApiException(HttpStatusApi._301, "No existe cliente con el id : " + idCliente);
		return repo.listarUsuariosPorClienteActivo(idCliente, pageable);
	}
	
	@Override
	public Page<TbUsuario> paginarPorCadena(Long idCliente,FiltrarClientesCadenaModel request, Pageable pageable) {
		TbCliente cte = clienteRepository.findById(idCliente).get();
		
		if(cte == null)
			throw new ApiException(HttpStatusApi._301, "No existe cliente con el id : " + idCliente);
		return repo.listarUsuariosPorCadena(idCliente, request.getBusqueda(), pageable);
	}

	@Transactional
	@Override
	public TbClienteUsuarios registrarUsuario(Integer idUsuarioOpera, TbClienteUsuarios request) throws ApiException {
		log.info("Registrando relacion usuario de cliente");

		TbUsuario creadoPor = usuarioSrv.listarPorId(idUsuarioOpera);

		if (creadoPor == null) {
			throw new ApiException(HttpStatusApi._301, "El Usuario que desea realizar esta operación no existe.");
		}
		
		TbUsuario tbUsuario = usuarioSrv.obtenerUsuario(request.getTbUsuario().getEmail());
        
		TbCliente tbCliente = clienteRepository.findByIdCliente(request.getTbCliente().getIdCliente());
		
		if (tbUsuario == null) {
			log.debug("Nuevo usuario");
			tbUsuario = usuarioSrv.registrarUsuarioDeCliente(idUsuarioOpera, request, "cliente");
		} else {
			log.debug("Existe usuario");
			throw new ApiException(HttpStatusApi._201, "El usuario ya está registrado en el sistema. Estatus: "+tbUsuario.getTbCatEstatus().getIdCatEstatus()+" "+tbUsuario.getTbCatEstatus().getDescripcion() + " IdUsuario: "+tbUsuario.getIdUsuario());
		}
		
		request.setCreadoPor(creadoPor);
		request.setFechaCreacion(LocalDateTime.now());
		request.setTbUsuario(tbUsuario);
		request.setFechaExpPwd(LocalDateTime.now());
		request.setTbCliente(tbCliente);

		return registrar(request);
	}
	
	@Override
	public TbUsuario registrarUsuarioActualiza(Integer idUsuarioOpera, TbClienteUsuarios request)
			throws ApiException {
		try {
			TbUsuario tbUsuario = usuarioSrv.obtenerUsuario(request.getTbUsuario().getEmail());
			TbCatEstatus tbCatEstatus = estatusRepository.findByDescripcionAndTipoEstatus("Pendiente", "U");
			
			Integer invitado = repoUsurRepository.countUsuariosCliente(request.getTbCliente().getIdCliente())+ 1;
			
			tbUsuario.setNombreCompleto("Invitado " + invitado);
			tbUsuario.setTbCatEstatus(tbCatEstatus);
			
			return usuarioSrv.actualizarUsuario(idUsuarioOpera, tbUsuario);
			
		} catch (Exception e) {
			throw new ApiException(HttpStatusApi._500, e.getMessage());
		}
	}
	

	@Override
	public void eliminarUsuario(Integer idUsuario) throws ApiException {
		log.info("Eliminando usuario de cliente");
		repo.eliminarUsuario(idUsuario);
	}
	
	@Override
	public void borradoLogico(Integer idUsuario) throws ApiException {
		log.info("Eliminando usuario de cliente");
		repo.borradoLogico(idUsuario);
		log.info("Eliminar registo de token");
		iUsuarioValidaRepository.eliminarRegistro(idUsuario);
	}

	@Override
	public ClienteUsuarioDto consultarDetalle(Integer idUsuario) throws ApiException {
		TbUsuario usr = usuarioSrv.listarPorId(idUsuario);
		if (usr == null)
			throw new ApiException(HttpStatusApi._301, "No existe el idUsuario " + idUsuario);
		
		TbClienteUsuarios cteUsr = repo.findByTbUsuario(usr);
		if (cteUsr == null)
			throw new ApiException(HttpStatusApi._301, "El suario no est� asociado a ning�n cliente.");
		
		return ClienteUsuarioDto.builder()
				.idClienteUsuarios(cteUsr.getIdClienteUsuario())
				.usuario(modelMapper.map(usr, UsuarioDto.class))
				.dashboardDto(cteUsr.getTbDashboard() == null ? null : modelMapper.map(cteUsr.getTbDashboard(), DashboardDto.class))
				.build();  
	}
	
	@Override
	public TbUsuario cambiarPerfil(Integer idUsuario, Integer idCatPerfil) throws ApiException {
		TbUsuario usr = usuarioSrv.listarPorId(idUsuario);
		if (usr == null)
			throw new ApiException(HttpStatusApi._301, "No existe el idUsuario " + idUsuario);
		
		TbCatPerfil perfil = iCatPerfilRepository.findById(idCatPerfil).orElse(null);
		if (perfil == null)
			throw new ApiException(HttpStatusApi._301, "No existe el perfil " + idCatPerfil);
		
		usr.setTbCatPerfil(perfil);
		return usuarioSrv.registrar(usr);
	}
	
	@Override
	public TbClienteUsuarios findByTbUsuario(TbUsuario tbUsuario) {
		return repo.findByTbUsuario(tbUsuario);
	}

	@Override
	public boolean validaSeguirInvitandoPorCliente(Long idCliente) throws ApiException {

		return false;
	}

	@Override
	public List<TbUsuario> listarUsuariosNoInActivosPorClient(Long idCliente) {
		return repo.listarUsuariosNoInActivosPorCliente(idCliente);
	}

}
