package mx.com.totalplay.smc.commons.services.impl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.ActualizaGraficaUsuarioModel;
import mx.com.totalplay.smc.commons.model.PaqueteDashboardDto;
import mx.com.totalplay.smc.commons.model.TipoDispositivoFrontDto;
import mx.com.totalplay.smc.commons.model.UsuarioConfiguracionDashboardDto;
import mx.com.totalplay.smc.commons.services.IUsuarioConfigGraficaService;
import mx.com.totalplay.smc.commons.services.IUsuarioService;
import mx.com.totalplay.smc.commons.utils.HttpStatusApi;
import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClientePunta;
import mx.com.totalplay.smc.entities.TbClienteUsuarios;
import mx.com.totalplay.smc.entities.TbCuadranteGrafica;
import mx.com.totalplay.smc.entities.TbDashboardCuadrante;
import mx.com.totalplay.smc.entities.TbPaqueteDashboard;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.entities.TbUsuarioConfiguracionDashboard;
import mx.com.totalplay.smc.entities.TbUsuarioConfiguracionGrafica;
import mx.com.totalplay.smc.repositories.IClientePuntaRepository;
import mx.com.totalplay.smc.repositories.IClienteRepository;
import mx.com.totalplay.smc.repositories.IClienteUsuarioRepository;
import mx.com.totalplay.smc.repositories.ICuadranteGraficaRepository;
import mx.com.totalplay.smc.repositories.IDashboardCuadranteRepository;
import mx.com.totalplay.smc.repositories.IDashboardRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IPaqueteDashboardRepository;
import mx.com.totalplay.smc.repositories.IPuntaInterfazRepository;
import mx.com.totalplay.smc.repositories.IUsuarioConfigDashboardRepository;
import mx.com.totalplay.smc.repositories.IUsuarioConfigGraficaRepository;

@Service
public class UsuarioConfigGraficaImpl extends GenericServiceImpl<TbUsuarioConfiguracionGrafica, Integer> 
	implements IUsuarioConfigGraficaService{
	
	private ModelMapper modelMapper = new ModelMapper();
	
	@Autowired
	private IUsuarioConfigGraficaRepository repo;
	
	@Autowired
	private IUsuarioConfigDashboardRepository dashboardRepo;
	
	@Autowired
	private IUsuarioService usuarioService;
	
	@Autowired
	private ICuadranteGraficaRepository graficaRepo;
	
	@Autowired
	private IDashboardCuadranteRepository cuadranteRepo;
	
	@Autowired
	private IDashboardRepository dashboardRepository;
	
	@Autowired
	private IClienteUsuarioRepository clienteUsuarioRepository;
	
	@Autowired
	private IPaqueteDashboardRepository paqueteDashboardRepository;
	
	@Autowired
	private IClienteRepository iClienteRepository;
	
	@Autowired
	private IClientePuntaRepository iClientePuntaRepository;
	
	@Autowired
	private IPuntaInterfazRepository iPuntaInterfazRepository;
	
	@Override
	protected IGenericRepository<TbUsuarioConfiguracionGrafica, Integer> getRepo() {
		return repo;
	}

	@Override
	public List<TbUsuarioConfiguracionGrafica> obtenerConfiguracion(Integer idUsuario) {
		TbUsuario usuario = usuarioService.listarPorId(idUsuario);
		TbUsuarioConfiguracionDashboard configDashboard = dashboardRepo.findByTbUsuario(usuario);
		List<TbUsuarioConfiguracionGrafica> configMetricaList = repo.findByTbUsuarioConfiguracionDashboard(configDashboard);
		
		return configMetricaList;
	}

	@Override
	public TbUsuarioConfiguracionGrafica actualizarGrafica(ActualizaGraficaUsuarioModel request) {
		
		TbUsuario usuario = usuarioService.listarPorId(request.getIdUsuario());
		TbUsuarioConfiguracionDashboard configDashboard = dashboardRepo.findByTbUsuario(usuario);
		
		Optional<TbDashboardCuadrante> tbDashboardCuadrante = cuadranteRepo.findById(request.getIdCuadrante());
		
		if (!tbDashboardCuadrante.isPresent())
			throw new ApiException(HttpStatusApi._301, "El cuadrante no existe para ese idCuadrante");
		
		TbDashboardCuadrante cuadrante = tbDashboardCuadrante.get();

		Optional<TbCuadranteGrafica> tbCuadranteGrafica = graficaRepo.findById(request.getIdGrafica());
		
		if (!tbCuadranteGrafica.isPresent())
			throw new ApiException(HttpStatusApi._301, "La grafica no existe para ese idGrafica");
		TbCuadranteGrafica newGrafica = tbCuadranteGrafica.get();
		
		List<TbUsuarioConfiguracionGrafica> configUsuarioGrafica = repo.findByTbUsuarioConfiguracionDashboard(configDashboard);
		List<TbCuadranteGrafica> graficas = graficaRepo.findByTbDashboardCuadrante(cuadrante);
		
		for (TbUsuarioConfiguracionGrafica configAEliminar:configUsuarioGrafica) {
			for(TbCuadranteGrafica grafica:graficas ) {
				/*if (configAEliminar.getTbCuadranteGrafica() == grafica) {
					eliminar(configAEliminar.getIdUsuarioConfiguracionGrafica());
				}*/
				if (configAEliminar.getTbCuadranteGrafica().getTbDashboardCuadrante() == grafica.getTbDashboardCuadrante() ) {
					eliminar(configAEliminar.getIdUsuarioConfiguracionGrafica());
				}
				break;
			}
		}
		
		TbUsuarioConfiguracionGrafica newConfig = new TbUsuarioConfiguracionGrafica();
		newConfig.setTbCuadranteGrafica(newGrafica);
		newConfig.setTbUsuarioConfiguracionDashboard(configDashboard);
		registrar(newConfig);
		return newConfig;
	}
	
	@Transactional
	@Override
	public UsuarioConfiguracionDashboardDto personalizarDashbords(Integer idUsuario, Integer idDashboard, String aspecto) {
		TbUsuarioConfiguracionDashboard configDashboard = dashboardRepo.findByTbUsuario(usuarioService.listarPorId(idUsuario));
		
		if(configDashboard != null && configDashboard.getTbDashboard().getIdDashboard() != idDashboard) {
			repo.deleteByTbUsuarioConfiguracionDashboard(configDashboard);
		}
		
		if(configDashboard == null) {
			TbUsuario usuario = usuarioService.listarPorId(idUsuario);
		    configDashboard = new TbUsuarioConfiguracionDashboard();
			configDashboard.setTbUsuario(usuario);
		}
		
		configDashboard.setTbDashboard(dashboardRepository.findById(idDashboard).orElse(null));
		configDashboard.setAspecto(aspecto);
		
		return modelMapper.map(dashboardRepo.save(configDashboard), UsuarioConfiguracionDashboardDto.class);
	}
	
	@Override
	public UsuarioConfiguracionDashboardDto recuperarDashbords(Integer idUsuario) {
		TbUsuario usuario = usuarioService.listarPorId(idUsuario);
		TbUsuarioConfiguracionDashboard configDashboard = dashboardRepo.findByTbUsuario(usuario);
		if(configDashboard==null) {
			TbClienteUsuarios cliente = clienteUsuarioRepository.findByTbUsuario(usuario);
			List<TbPaqueteDashboard> paquetes = paqueteDashboardRepository.findAllByTbCatPaquete(cliente.getTbCliente().getTbCatPaquete());
			configDashboard = dashboardRepo.save(TbUsuarioConfiguracionDashboard.builder().tbUsuario(usuario).
					tbDashboard(paquetes.get(0).getTbDashboard()).aspecto("claro").fechaActualizacion(LocalDateTime.now()).build());
		}
		return modelMapper.map(configDashboard, UsuarioConfiguracionDashboardDto.class);
	}
	
	@Override
	public List<PaqueteDashboardDto> recuperarDashbordsPaquete(Integer idUsuario) {
		TbUsuario usuario = usuarioService.listarPorId(idUsuario);
		TbClienteUsuarios cliente = clienteUsuarioRepository.findByTbUsuario(usuario);
		List<TbPaqueteDashboard> paquetes = paqueteDashboardRepository.findAllByTbCatPaquete(cliente.getTbCliente().getTbCatPaquete());
		return paquetes.stream().map(paquete -> modelMapper.map(paquete, PaqueteDashboardDto.class))
				  .collect(Collectors.toList());
	}
	
	@Override
	public List<TipoDispositivoFrontDto> recuperarTipoDispositivo(Integer idCliente){
		List<TipoDispositivoFrontDto> tipos = new ArrayList<>();		
		TbCliente client = iClienteRepository.findById(idCliente.longValue()).orElse(null);
		List<TbClientePunta> puntas = iClientePuntaRepository.findAllByTbCliente(client);
		boolean aplicaEnlaces = false;
		boolean aplicaServicios = false;
		for(TbClientePunta punta : puntas) {
			if("enlace".equalsIgnoreCase(punta.getTipoPunta()))
				aplicaEnlaces = true;
			if(iPuntaInterfazRepository.countByTbClientePunta(punta)>0)
				aplicaServicios = true;
			if(aplicaEnlaces && aplicaServicios)
				break;
		}
		if(aplicaEnlaces)
			tipos.add(TipoDispositivoFrontDto
					.builder()
					.name("Enlaces")
					.value("1")
					.clase("image-dashboard-enlace")
					.claseDark("image-dashboard-enlace-blanco")
					.build());
		if(aplicaServicios)
			tipos.add(TipoDispositivoFrontDto
					.builder()
					.name("Servicios")
					.value("2")
					.clase("image-dashboard-interface")
					.claseDark("image-dashboard-interface-blanco")
					.build());
		tipos.add(TipoDispositivoFrontDto
				.builder()
				.name("Sitios")
				.value("3")
				.clase("image-dashboard-punta")
				.claseDark("image-dashboard-punta-blanco")
				.build());
		return tipos;
	}

} 
