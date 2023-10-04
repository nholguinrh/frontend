 package mx.com.totalplay.smc.commons.services.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.hibernate.cfg.NotYetImplementedException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.ActualizaCteFavModel;
import mx.com.totalplay.smc.commons.model.CatServicioDto;
import mx.com.totalplay.smc.commons.model.ClienteConfiguracionDto;
import mx.com.totalplay.smc.commons.model.ClienteDto;
import mx.com.totalplay.smc.commons.model.FiltrarClientesModel;
import mx.com.totalplay.smc.commons.model.GuardarClienteModel;
import mx.com.totalplay.smc.commons.model.ResponseEntityModel;
import mx.com.totalplay.smc.commons.model.ResumenContratoModel;
import mx.com.totalplay.smc.commons.model.UsuarioAdmFavDto;
import mx.com.totalplay.smc.commons.services.IClienteConfiguracionService;
import mx.com.totalplay.smc.commons.services.IClienteService;
import mx.com.totalplay.smc.commons.services.IClienteSrvService;
import mx.com.totalplay.smc.commons.services.IClienteUsuarioService;
import mx.com.totalplay.smc.commons.services.IUsuarioService;
import mx.com.totalplay.smc.commons.services.IVClienteService;
import mx.com.totalplay.smc.commons.utils.ConstantesApi;
import mx.com.totalplay.smc.commons.utils.HttpStatusApi;
import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbCatPaquete;
import mx.com.totalplay.smc.entities.TbCatPerfil;
import mx.com.totalplay.smc.entities.TbCatServicio;
import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClienteConfiguracion;
import mx.com.totalplay.smc.entities.TbClienteServicio;
import mx.com.totalplay.smc.entities.TbClienteUsuarios;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.entities.TbUsuarioAdmFav;
import mx.com.totalplay.smc.entities.TbVClientesTotalEquipo;
import mx.com.totalplay.smc.repositories.ICatEstatusRepository;
import mx.com.totalplay.smc.repositories.ICatPaquetesRepository;
import mx.com.totalplay.smc.repositories.IClientePuntaRepository;
import mx.com.totalplay.smc.repositories.IClienteRepository;
import mx.com.totalplay.smc.repositories.IDashboardRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IPuntaInterfazRepository;
import mx.com.totalplay.smc.repositories.IUsuarioAdmFavsRepository;
import mx.com.totalplay.smc.repositories.IVClientesTotalEquipoRepository;

@Slf4j
@Service
public class ClienteServiceImpl extends GenericServiceImpl<TbCliente, Long> implements IClienteService {

	private static final String Onboarding = "Onboarding";
	private static final String Activo = "Activo";
	private static final String Cliente = "C";
	private ModelMapper modelMapper = new ModelMapper();
	
	@Autowired
	private IClienteRepository repo;
	
	@Autowired
	private ICatEstatusRepository estatusRepository;
	
	@Autowired
	private IClienteUsuarioService cteUsrService;
	
	@Autowired
	private IUsuarioAdmFavsRepository usuarioAdmFavsRepository;
	
	@Autowired
	private IUsuarioService usuarioService;
	
	@Autowired
	private IDashboardRepository dashboardRepository;
	
	@Autowired
	private IClienteConfiguracionService cteConfiguracionService;
	
	@Autowired
	private IClienteSrvService clienteServiciosSrv;
	
	@Autowired
	private IClientePuntaRepository clientePuntaRepository;
	
	@Autowired
	private IPuntaInterfazRepository puntaInterfazRepository;
		
	@Autowired
    private ICatPaquetesRepository servicePaquete;
	
	@Autowired
	private IVClienteService ivClientesService;
	
	@Autowired
	private IVClientesTotalEquipoRepository iVClientesTotalEquipoRepository;

	
	@Override
	protected IGenericRepository<TbCliente, Long> getRepo() {
		return repo;
	}
	
	@Override
	public TbCliente obtenerCliente(String contrato, String pwd, String ip) throws ApiException {
		log.info("ClienteServiceImpl->ObtenerClienteXcontrato->{}", contrato);
		TbCliente tbCliente = repo.findByContrato(contrato);
		
		if (tbCliente == null) 
			throw new ApiException(HttpStatusApi._301, "El usuario no se encuentra registrado en el sistema.");

		if (!tbCliente.getPwd().equals(pwd)) 
			throw new ApiException(HttpStatusApi._301, "La contraseña no coincide. Favor de intentar de nuevo.");
		
		TbCatEstatus tbCatEstatusOnboarding = estatusRepository.findByDescripcionAndTipoEstatus
				(Onboarding, Cliente);
		if (tbCliente.getTbCatEstatus().getIdCatEstatus() != tbCatEstatusOnboarding.getIdCatEstatus())
			throw new ApiException(HttpStatusApi._301, "El usuario no tiene un estatus Onboarding."
					+ " No es posible completar el proceso de Onboarding");
		
		if (!tbCliente.getIpClienteRegistro().equals(ip))
			throw new ApiException(HttpStatusApi._301, "La IP no coincide."
					+ " No es posible completar el proceso de Onboarding");
		
		return tbCliente;
	}
	

	@Transactional
	@Override
	public GuardarClienteModel registrarClienteCrearUsuario(int idUsuarioOpera, GuardarClienteModel dto) {
		log.debug("Se registra cliente");
		GuardarClienteModel response = new GuardarClienteModel();
		TbCliente cliente = modelMapper.map(dto.getCliente(), TbCliente.class);
		TbUsuario usrCrea = usuarioService.listarPorId(idUsuarioOpera);
		
		if(usrCrea == null)
			throw new ApiException(HttpStatusApi._301, 
					"No existe usuario con el id " + idUsuarioOpera);
		cliente.setCreadoPor(usrCrea);
		cliente.setFechaCreacion(LocalDateTime.now());
		cliente.setIndicadorFavorito(dto.getCliente().getIndicadorFavorito());
		
		//Validamos que no exista el usuario
		TbUsuario tbUsuario = usuarioService.obtenerUsuario(cliente.getEmail());
		if(tbUsuario!=null)
			throw new ApiException(HttpStatusApi._301, "Este email ya se encuentra registrado en el sistema");
		
		try {			
			TbCliente tbCliente = registrar(cliente);
			
			/*
			 * Proceso de inserción en Tablas para SERVICIOS EXTERNOS
			 */
			try{
				ivClientesService.guardarCliente(tbCliente.getIdCliente() ,dto.getCliente().getIdClienteTotalPlay());
			}catch (Exception e) {
				log.info("ERROR AL INSERTAR EN V-CLIENTES");
			}
			try {
				iVClientesTotalEquipoRepository.save(TbVClientesTotalEquipo.builder()
						.idEmpresa(dto.getCliente().getIdClienteTotalPlay())
						.fechaTotalEquipos(LocalDateTime.of(LocalDate.now(), LocalTime.of(0, 0, 0, 0)))
						.idTipoDispositivo(1L)
						.numeroTotalEquipos(0)
						.estatusDia(1)
						.build());
			} catch (Exception e) {
				log.info("ERROR AL INSERVAR IV-Clientes-TotalEquipo");
			}
			
			log.debug("Se registra usuario y su relación con cliente.");
			TbClienteUsuarios tb = cteUsrService.registrarUsuario(idUsuarioOpera, TbClienteUsuarios.builder()
					.tbCliente(tbCliente)
					.tbUsuario(TbUsuario.builder()
							.nombreCompleto(tbCliente.getRepresentante() != null ? tbCliente.getRepresentante() : "")
							.tbCatPerfil(TbCatPerfil.builder().idCatPerfil(ConstantesApi.PERFIL_EJECUTIVO.getCode()).build())
							.codigoVerificacion(UUID.randomUUID().toString())
							.email(tbCliente.getEmail())
							.pwd(tbCliente.getPwd())
							.build())
					.tbDashboard(dashboardRepository.findByDescripcion(ConstantesApi.DASHBOARD_MONITOREO_ENLACES.getDescripcion()))
					.build());
			response.setCliente(modelMapper.map(tb.getTbCliente(), ClienteDto.class));
			if(dto.getConfiguracion()!=null) {
				//Se registra la entidad ClientesConfiguracion
				TbClienteConfiguracion configuracion = modelMapper.map(dto.getConfiguracion(), TbClienteConfiguracion.class);
				TbClienteConfiguracion clienteConfiguracion = TbClienteConfiguracion.builder()
				.tbCliente(tbCliente)
				.fechaCreacion(LocalDateTime.now())
				.creadoPor(usrCrea)
				.tiempoHistorico(0)
				.bandejaHistorico("")
				.tipoTicketsS("")
				.tbCatTipoTicket(configuracion.getTbCatTipoTicket())
				.tbCatSector(configuracion.getTbCatSector())
				.tbCatOrigenNombre(configuracion.getTbCatOrigenNombre())
				.tbCatBandejaSD(configuracion.getTbCatBandejaSD())
				.tbCatHistoricoPerformance(configuracion.getTbCatHistoricoPerformance())
				.build();
				//TODO - cambiar por id
				response.setConfiguracion(modelMapper.map(cteConfiguracionService.registrarClienteConfiguracion(clienteConfiguracion), ClienteConfiguracionDto.class));
			}
			//Se agregan los servicios
			dto.getServicios().forEach(newService ->
			clienteServiciosSrv.save(
						TbClienteServicio.builder().tbCatServicio(modelMapper.map(newService, TbCatServicio.class)).tbCliente(tbCliente).build())
			);
			response.setServicios(dto.getServicios());
			return response;
		} catch (Exception e) {
			throw new ApiException(HttpStatusApi._500, 
					"Error: " + e);
		}
	}

	@Override
	public ResponseEntityModel<Boolean> editarFav(ActualizaCteFavModel request) throws ApiException {
		Optional<TbCliente> entityCte = this.repo.findById(request.getIdCliente());
		Boolean ok = false;
		if(!entityCte.isPresent())
			throw new ApiException(HttpStatusApi._301, 
					"No existe cliente con el id " + request.getIdCliente());
		
		TbCliente cte = entityCte.get();
		TbUsuario usr = this.usuarioService.listarPorId(request.getIdUsuario());
		
		if(usr == null)
			throw new ApiException(HttpStatusApi._301,
					"No existe usuario con el id " + request.getIdUsuario());

		String msg;
		int code;
		if(request.getFavorito()){
			if(usuarioAdmFavsRepository.
					findByTbUsuarioAndTbCliente(usr, cte) == null) {
				TbUsuarioAdmFav usrAdmnFav = new TbUsuarioAdmFav();
				usrAdmnFav.setTbCliente(cte);
				usrAdmnFav.setTbUsuario(usr);
				usuarioAdmFavsRepository.save(usrAdmnFav);
				ok = true;
				msg = "Cliente agregado a favoritos con �xito.";
				code = HttpStatusApi._200;
			}else {
				msg = "El usuario " + usr.getNombreCompleto()
				+ " ya ten�a al cliente " + cte.getRazonSocial()
				+ " en sus favoritos.";
				code = HttpStatusApi._301;
			}
		}else {
			TbUsuarioAdmFav usrAdmnFav = usuarioAdmFavsRepository.
					findByTbUsuarioAndTbCliente(usr, cte);
			if(usrAdmnFav != null) {
				usuarioAdmFavsRepository.delete(usrAdmnFav);
				ok = false;
				msg = "Cliente eliminado de favoritos con �xito.";
				code = HttpStatusApi._200;
			}else {
				msg = "El usuario " + usr.getNombreCompleto()
						+ " no ten�a al cliente " + cte.getRazonSocial()
						+ " en sus favoritos.";
				code = HttpStatusApi._301;
			}
		}
		return new ResponseEntityModel<Boolean>(ok, code, msg);
	}

	@Override
	public ResumenContratoModel consultaResumen(String contrato) throws ApiException {
		TbCliente cte = repo.findByContrato(contrato);
		
		if(cte == null)
			throw new ApiException(HttpStatusApi._301, "El contrato " + contrato 
					+ " no se encuentra registrado en el sistema.");
		
		ResumenContratoModel resumen = new ResumenContratoModel();
		resumen.setNoContrato(contrato);
		LocalDate ld = null;
		if(cte.getFechaContratacion()==null)
			ld = LocalDate.now().plusYears(1);
		else cte.getFechaContratacion().plusYears(1).toLocalDate();
		resumen.setRenovacion(ld);
		resumen.setPaquete(cte.getTbCatPaquete());
		
		return resumen;
	}

	@Override
	public Page<TbUsuarioAdmFav> listarFavoritos(Pageable pageable, Integer idUsuario) {
		TbUsuario usr = usuarioService.listarPorId(idUsuario);
		
		if (usr == null) 
			throw new ApiException(HttpStatusApi._301, 
					"El usuario no se encuentra registrado en el sistema.");

		Page<TbUsuarioAdmFav> result = usuarioAdmFavsRepository.findByTbUsuario(usr, pageable);
		result.getContent().forEach(uaf ->  uaf.setTbUsuario(null));
		return result;
	}
	
	@Override
	public Page<TbCliente> obtenerClientes(Pageable pageable) {

//		TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus(Activo, Cliente);
		return repo.findAll(pageable);
	}

	@Override
	public Page<TbCliente> ordenarPorAntiguedad(String tipo, Pageable pageable) {Pageable paginator;
	switch (tipo) {
		case "favoritos":
			paginator = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC,"indicadorFavorito"));
			return getRepo().findAll(paginator);
		case "recientes":
			paginator = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("idCliente").descending());
			return getRepo().findAll(paginator);
		case "antiguos":
			paginator = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by("idCliente").ascending());
			return getRepo().findAll(paginator);
		default:
			throw new NotYetImplementedException("Busqueda por '" + tipo + "' no implementada.");
	}}

	@Override
	public Page<TbCliente> filtrarxCadenaLike(Pageable pageable, String cadena) {
		return repo.findByRazonSocialLike("%".concat(cadena).concat("%"), pageable);
	}

	@Override
	public GuardarClienteModel actualizarCliente(Integer idUsuarioOpera, GuardarClienteModel dto) {
		GuardarClienteModel response = new GuardarClienteModel();
		TbUsuario modificadoPor = usuarioService.listarPorId(idUsuarioOpera);
		if (modificadoPor == null) {
			throw new ApiException(HttpStatusApi._201, "El usuario que desea realizar esta operación no existe.");
		}

		TbCliente tbCliente = listarPorId(dto.getCliente().getIdCliente());
		TbCatPaquete tbCatPaquete = servicePaquete.findByIdCatPaquete(dto.getCliente().getTbCatPaquete().getIdCatPaquete());
		
		if (tbCliente == null) {
			throw new ApiException(HttpStatusApi._201, "No se encontró el Cliente para id: " + dto.getCliente().getIdCliente());
		}
		tbCliente.setContrato(dto.getCliente().getContrato());
		tbCliente.setActualizadoPor(modificadoPor);
		tbCliente.setEmail(dto.getCliente().getEmail());
		tbCliente.setFechaActualizacion(LocalDateTime.now());
		tbCliente.setIdClienteTotalPlay(dto.getCliente().getIdClienteTotalPlay());
		tbCliente.setIpClienteRegistro(dto.getCliente().getIpClienteRegistro());
		tbCliente.setObservaciones(dto.getCliente().getObservaciones());
		tbCliente.setRazonSocial(dto.getCliente().getRazonSocial());
		tbCliente.setRepresentante(dto.getCliente().getRepresentante());
		tbCliente.setRfc(dto.getCliente().getRfc());
		tbCliente.setTelefonoCelular(dto.getCliente().getTelefonoCelular());
		tbCliente.setTelefonoFijo(dto.getCliente().getTelefonoFijo());
		tbCliente.setTotalPuntas(dto.getCliente().getTotalPuntas());
		tbCliente.setEnlacesContratados(dto.getCliente().getEnlacesContratados());
		tbCliente.setSitiosContratados(dto.getCliente().getSitiosContratados());
		tbCliente.setServiciosContratados(dto.getCliente().getServiciosContratados());
		tbCliente.setIndicadorFavorito(dto.getCliente().getIndicadorFavorito());
		tbCliente.setTbCatPaquete(tbCatPaquete);
		
		TbCliente cliente = modificar(tbCliente);
		//Verificamos si es favorito para el actual usuario operador
		//cliente.setIndicadorFavorito( existeFav(cliente.getIdCliente(), idUsuarioOpera) ? 1 : 0 );
		TbUsuarioAdmFav usrAdmnFav = usuarioAdmFavsRepository.findByTbUsuarioAndTbCliente(modificadoPor, tbCliente);
		if(tbCliente.getIndicadorFavorito()==1 && usrAdmnFav == null) {
			usuarioAdmFavsRepository.save(TbUsuarioAdmFav.builder().tbCliente(tbCliente).tbUsuario(modificadoPor).build());
		}else if(tbCliente.getIndicadorFavorito()==0 && usrAdmnFav != null){
			usuarioAdmFavsRepository.delete(usrAdmnFav);
		}
		
		response.setCliente(modelMapper.map(cliente, ClienteDto.class));
		if(dto.getConfiguracion()!=null) {
			//Se actualiza clienteConfiguracion
			TbClienteConfiguracion requestConfig = modelMapper.map(dto.getConfiguracion(), TbClienteConfiguracion.class);
			TbClienteConfiguracion tbClienteConfiguracion = cteConfiguracionService.listarPorId(requestConfig.getIdClienteConfiguracion());
			if(tbClienteConfiguracion!=null) {
				tbClienteConfiguracion.setFechaActualizacion(LocalDateTime.now());
				tbClienteConfiguracion.setActualizadoPor(modificadoPor);
				tbClienteConfiguracion.setTbCatTipoTicket(requestConfig.getTbCatTipoTicket());
				tbClienteConfiguracion.setTbCatSector(requestConfig.getTbCatSector());
				tbClienteConfiguracion.setTbCatOrigenNombre(requestConfig.getTbCatOrigenNombre());
				tbClienteConfiguracion.setTbCatBandejaSD(requestConfig.getTbCatBandejaSD());
				tbClienteConfiguracion.setTbCatHistoricoPerformance(requestConfig.getTbCatHistoricoPerformance());
				TbClienteConfiguracion configuracion = cteConfiguracionService.actualizarClienteConfiguracion(tbClienteConfiguracion);
				response.setConfiguracion(modelMapper.map(configuracion, ClienteConfiguracionDto.class));
			}
		}
		List<TbClienteServicio> servicios = clienteServiciosSrv.findByTbCliente(tbCliente);
		//Actualizamos-Eliminamos el/los servicios 
		for(TbClienteServicio service : servicios) {
			boolean delete = true;
			for(CatServicioDto newService : dto.getServicios()) {
				if(service.getTbCatServicio().getIdCatServicios() == newService.getIdCatServicios()) delete = false;
			}
			if(delete) clienteServiciosSrv.delete(service);
		}
		//Actualizamos-Agregamos el/los servicios
		for(CatServicioDto newService : dto.getServicios()) {
			boolean add = true;
			for(TbClienteServicio service : servicios) {
				if(service.getTbCatServicio().getIdCatServicios() == newService.getIdCatServicios()) add = false;
			}
			if(add) clienteServiciosSrv.save(
					TbClienteServicio.builder().tbCatServicio(modelMapper.map(newService, TbCatServicio.class)).tbCliente(tbCliente).build());
		}
		
		//Actualizar el nombre del Usuario = Representante Cliente
		TbUsuario usuario = usuarioService.listarPorId(dto.getUsuario().getIdUsuario());
		usuario.setNombreCompleto(tbCliente.getRepresentante());
		usuario.setEmail(tbCliente.getEmail());
		usuarioService.modificar(usuario);
		
		response.setServicios(dto.getServicios());
		return response;
	}

	@Override
	public Page<TbUsuarioAdmFav> listarFavorito(Pageable pageable, Integer idUsuario, Long idCliente) {
		TbUsuario usr = usuarioService.listarPorId(idUsuario);
		if (usr == null) 
			throw new ApiException(HttpStatusApi._301, "El usuario no se encuentra registrado en el sistema.");
		
		TbCliente cte = listarPorId(idCliente);
		if (cte == null)
			throw new ApiException(HttpStatusApi._301, "El cliente no se encuentra registrado en el sistema.");
		
		Page<TbUsuarioAdmFav> result = usuarioAdmFavsRepository.findByTbUsuario(usr, pageable);
		result.getContent().forEach(uaf ->  uaf.setTbUsuario(null));
		return result;
	}
	
	@Override
	public Boolean existeFav(long idCliente, int idUsuario) throws ApiException {
		Optional<TbCliente> entityCte = this.repo.findById(idCliente);
		Boolean ok = false;
		if(!entityCte.isPresent())
			throw new ApiException(HttpStatusApi._301, 
					"No existe cliente con el id " + idCliente);
		
		TbCliente cte = entityCte.get();
		TbUsuario usr = this.usuarioService.listarPorId(idUsuario);
		
		if(usr == null)
			throw new ApiException(HttpStatusApi._301,
					"No existe usuario con el id " + idUsuario);
		
		if(usuarioAdmFavsRepository.
				findByTbUsuarioAndTbCliente(usr, cte) != null)
			ok = true;
		return ok;
	}
	
	@Override
	public boolean eliminarCliente(Integer idUsuarioOpera, Long idCliente) {
		TbUsuario modificadoPor = usuarioService.listarPorId(idUsuarioOpera);
		if (modificadoPor == null) {
			throw new ApiException(HttpStatusApi._201, "El usuario que desea realizar esta operación no existe.");
		}

		TbCliente tbCliente = listarPorId(idCliente);
		if (tbCliente == null) {
			throw new ApiException(HttpStatusApi._201, "No se encontró el Cliente para id: " + idCliente);
		}
		tbCliente.setEliminadoPor(modificadoPor);
		tbCliente.setFechaBaja(LocalDateTime.now());
		tbCliente.setTbCatEstatus(TbCatEstatus.builder().idCatEstatus(19).build());
		modificar(tbCliente);
		return true;
	}
	
	@Override
	public List<TbCliente> filtrarxEmailoContrato(String email, String contrato) {
		return repo.findByEmailOrContrato(email, contrato);
	}
	
	@Override
	public List<TbCliente> filtrarEmail(String email) {
		return repo.findByEmail(email);
	}
	
	@Override
	public List<TbCliente> findByIdClienteTotalPlay(String idClienteTotalPlay){
		return repo.findByIdClienteTotalPlay(idClienteTotalPlay);
	}

	@Override
	public List<TbCliente> listarTodos() {
		TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus(Activo, Cliente);
		List<TbCliente> result = repo.findAllByTbCatEstatus(estatus);
		return result;
	}

	@Override
	public List<UsuarioAdmFavDto> listarTodosFavoritos(Integer idUsuario) {
		TbUsuario usr = usuarioService.listarPorId(idUsuario);
		 
		if (usr == null) 
			throw new ApiException(HttpStatusApi._301, "El usuario no se encuentra registrado en el sistema.");
		
		TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus("Activo", "C");
		
//		List<TbUsuarioAdmFav> listTb = usuarioAdmFavsRepository.findAllByTbUsuario(usr);
		List<TbUsuarioAdmFav> listTb = usuarioAdmFavsRepository
				.findAllByUsuarioAndEstatusCliente(usr.getIdUsuario(), estatus.getIdCatEstatus());
		
		List<UsuarioAdmFavDto> listDto = new ArrayList<UsuarioAdmFavDto>();
//		for(TbUsuarioAdmFav uAF : listTb) list.add(modelMapper.map(uAF, UsuarioAdmFavDto.class));
		for(TbUsuarioAdmFav uAF : listTb) listDto.add(UsuarioAdmFavDto.builder()
			.idFav(uAF.getIdFav())
			.tbCliente(modelMapper.map(uAF.getTbCliente(), ClienteDto.class))
			.build());
				
		return listDto;
	}

	@Override
	public Page<TbCliente> aplicarFiltros(FiltrarClientesModel request, Pageable pageable) {
		boolean isExistsEstatusCero = request.getEstatus().contains(0);
		boolean isExistsPaquetesCero = request.getPaquetes().contains(0);
		switch(request.getTipo()) {
			case "todos":
				if(isExistsEstatusCero || isExistsPaquetesCero ) {
					return repo.findByIdEstatusInOrIdPaquetesIn(request.getEstatus(), request.getPaquetes(), pageable);
				}else {
					return repo.findByIdEstatusInAndIdPaquetesIn(request.getEstatus(), request.getPaquetes(), pageable);
				}
			case "favoritos":
				if(isExistsEstatusCero || isExistsPaquetesCero ) {
					return repo.findByIdEstatusInOrIdPaquetesInAndIndicadorFavorito(request.getEstatus(), request.getPaquetes(), pageable);
				}else {
					return repo.findByIdEstatusInAndIdPaquetesIn(request.getEstatus(), request.getPaquetes(), pageable);
				}
			case "recientes":
				if(isExistsEstatusCero || isExistsPaquetesCero ) {
					return repo.findByIdEstatusInOrIdPaquetesInOrderByIdClienteDESC(request.getEstatus(), request.getPaquetes(), pageable);
				}else {
					return repo.findByIdEstatusInAndIdPaquetesInOrderByIdClienteDESC(request.getEstatus(), request.getPaquetes(), pageable);
				}
			case "antiguos":
				if(isExistsEstatusCero || isExistsPaquetesCero ) {
					return repo.findByIdEstatusInOrIdPaquetesInOrderByIdClienteASC(request.getEstatus(), request.getPaquetes(), pageable);
				}else {
					return repo.findByIdEstatusInAndIdPaquetesInOrderByIdClienteASC(request.getEstatus(), request.getPaquetes(), pageable);
				}
			case "cadena":
				if(isExistsEstatusCero || isExistsPaquetesCero ) {
					return repo.findByIdEstatusInOrIdPaquetesInAndRazonSocialLike(request.getBusqueda(),request.getEstatus(), request.getPaquetes(), pageable);
				}else {
					return repo.findByIdEstatusInAndIdPaquetesInAndRazonSocialLike(request.getBusqueda(), request.getEstatus(), request.getPaquetes(), pageable);
				}
			default:
				if(isExistsEstatusCero || isExistsPaquetesCero ) {
					return repo.findByIdEstatusInOrIdPaquetesIn(request.getEstatus(), request.getPaquetes(), pageable);
				}else {
					return repo.findByIdEstatusInAndIdPaquetesIn(request.getEstatus(), request.getPaquetes(), pageable);
				}
		}
	}

	@Override
	public List<String> listarDispositivosPorCliente(Long idCliente) {
		List<String> dispositivos = new ArrayList<String>();
		
		if(clientePuntaRepository.countEnlacesActivosByCliente(idCliente) > 0)
			dispositivos.add("ENLACES");
		if(clientePuntaRepository.countSitiosActByCliente(idCliente) > 0)
			dispositivos.add("SITIOS");
		if(puntaInterfazRepository.countInterfacesActivasByCliente(idCliente) > 0)
			dispositivos.add("SERVICIOS");
		
		return dispositivos;
	}

	@Override
	public List<String> distinctTipoPuntaByIdCliente(Long idCliente) {
		return clientePuntaRepository.distinctTipoPuntaByIdCliente(idCliente);
	}

	@Override
	public boolean validaSeguirInvitandoUsuariosDelCliente(Long idCliente) throws ApiException {
		/*
		 * Saber el numero de usuarios que contrató el cliente 
		 */
		TbCliente tbCliente = listarPorId(idCliente);
		
		if(tbCliente != null) {
			if(tbCliente.getTbCatPaquete() != null) {
				int numeroUsuariosPermitidosPorPaquete = tbCliente.getTbCatPaquete().getCantidadUsuarios();
				/*
				 * Contar el número de usuarios que tiene activos el cliente
				 */
				List<TbUsuario> listaUsuarios = cteUsrService.listarUsuariosNoInActivosPorClient(idCliente);
				if(numeroUsuariosPermitidosPorPaquete > listaUsuarios.size()) {
					return Boolean.TRUE;
				}else {
					return Boolean.FALSE;
				}
			}else {
				throw new ApiException(500, "El Cliente no cuenta con un paquete asociado.");
			}
		}else {
			throw new ApiException(500, "No existe el cliente con dico identificador.");
		}
		/*
		 * Hacer la operación y en exito => true  OTRO enviar false
		 */
		
	}

}
