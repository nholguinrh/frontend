package mx.com.totalplay.smc.commons.services.impl;

import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.ConfiguracionPaquetesDto;
import mx.com.totalplay.smc.commons.model.PaquetesDto;
import mx.com.totalplay.smc.commons.services.IConfiguracionPaqueteService;
import mx.com.totalplay.smc.commons.services.IDashboardService;
import mx.com.totalplay.smc.commons.services.IMetricaService;
import mx.com.totalplay.smc.commons.services.IPaqueteDashboardService;
import mx.com.totalplay.smc.commons.services.IPaqueteMetricaService;
import mx.com.totalplay.smc.commons.services.IPaqueteService;
import mx.com.totalplay.smc.commons.services.IPaqueteServicioService;
import mx.com.totalplay.smc.commons.services.IServicioService;
import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbCatPaquete;
import mx.com.totalplay.smc.entities.TbCatServicio;
import mx.com.totalplay.smc.entities.TbDashboard;
import mx.com.totalplay.smc.entities.TbMetrica;
import mx.com.totalplay.smc.entities.TbPaqueteDashboard;
import mx.com.totalplay.smc.entities.TbPaqueteMetrica;
import mx.com.totalplay.smc.entities.TbPaqueteServicio;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.repositories.ICatEstatusRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConfiguracionPaqueteServiceImpl implements IConfiguracionPaqueteService {

    @Autowired
    private IPaqueteService paqueteService;
    @Autowired
    private IServicioService servicioService;
    @Autowired
    private IMetricaService metricaService;
    @Autowired
    private IDashboardService dashboardService;

    @Autowired
    private IPaqueteServicioService paqueteServicioService;

    @Autowired
    private IPaqueteMetricaService paqueteMetricaService;

    @Autowired
    private IPaqueteDashboardService paqueteDashboardService;
    
    @Autowired
	private ICatEstatusRepository estatusRepository;


    @Override
    public ConfiguracionPaquetesDto obtieneInformacionPaquetes() {

        List<PaquetesDto> servicios = servicioService.listar().stream()
                .map(s -> PaquetesDto.builder()
                        .id(s.getIdCatServicios())
                        .descripcion(s.getDescripcion())
                        .build()).collect(Collectors.toList());
        List<PaquetesDto> dashboards = dashboardService.listar().stream()
                .map(d -> PaquetesDto.builder()
                        .id(d.getIdDashboard())
                        .descripcion(d.getDescripcion())
                        .build())
                .collect(Collectors.toList());
        List<PaquetesDto> metricas = metricaService.listar().stream()
                .map(m -> PaquetesDto.builder()
                        .id(m.getIdMetrica())
                        .descripcion(m.getInformacion())
                        .build())
                .collect(Collectors.toList());


        return ConfiguracionPaquetesDto.builder()
                .servicios(servicios)
                .dashboards(dashboards)
                .metricas(metricas)
                .build();
    }

    @Override
    public ConfiguracionPaquetesDto obtieneInformacionPaqueteById(Integer id) {

        TbCatPaquete paquete = validaCatPaquete(paqueteService.listarPorId(id));

        List<PaquetesDto> paqueteServicios = paqueteServiciosToPaquetesDto(paqueteServicioService.findPaqueteServicioByIdCatPaquete(id));
        List<PaquetesDto> paqueteMetricas = paqueteMetricasToPaquetesDto(paqueteMetricaService.findPaqueteMetricaByIdCatPaquete(id));
        List<PaquetesDto> paqueteDashboards = paqueteDashboardsToPaquetesDto(paqueteDashboardService.findPaqueteDashboardByIdCatPaquete(id));


        return generaConfiguracionPaquetesDto(paquete, paqueteServicios, paqueteMetricas, paqueteDashboards);
    }

    @Override
    public List<ConfiguracionPaquetesDto> obtieneInformacionPaqueteByCreadoPor(Integer idUsuario) {

        List<TbCatPaquete> paquetes = paqueteService.findAllByIdUsuario(idUsuario).stream()
                .filter(p -> p.getFechaBaja() == null)
                .collect(Collectors.toList());
        List<ConfiguracionPaquetesDto> listaPaquetes = new ArrayList<>();
        if (!paquetes.isEmpty()) {
            listaPaquetes = paquetes.stream().map(p -> {
                List<PaquetesDto> paqueteServicios = paqueteServiciosToPaquetesDto(paqueteServicioService.findPaqueteServicioByIdCatPaquete(p.getIdCatPaquete()));
                List<PaquetesDto> paqueteMetricas = paqueteMetricasToPaquetesDto(paqueteMetricaService.findPaqueteMetricaByIdCatPaquete(p.getIdCatPaquete()));
                List<PaquetesDto> paqueteDashboards = paqueteDashboardsToPaquetesDto(paqueteDashboardService.findPaqueteDashboardByIdCatPaquete(p.getIdCatPaquete()));
                return generaConfiguracionPaquetesDto(p, paqueteServicios, paqueteMetricas, paqueteDashboards);
            }).collect(Collectors.toList());
        } else {
            throw new ApiException(404, "Datos no encontrados");
        }

        return listaPaquetes;
    }


    @Override
    public ConfiguracionPaquetesDto obtieneInformacionPaqueteByIdAndCreadoPor(Integer id, Integer idUsuario) {
        TbCatPaquete paquete = validaCatPaquete(paqueteService.findByIdPaqueteAndIdUsuario(id, idUsuario));

        List<PaquetesDto> paqueteServicios = paqueteServiciosToPaquetesDto(paqueteServicioService.findPaqueteServicioByIdCatPaqueteAndIdUsuario(id, idUsuario));
        List<PaquetesDto> paqueteMetricas = paqueteMetricasToPaquetesDto(paqueteMetricaService.findPaqueteMetricaByIdCatPaqueteAndIdUsuario(id, idUsuario));
        List<PaquetesDto> paqueteDashboards = paqueteDashboardsToPaquetesDto(paqueteDashboardService.findPaqueteDashboardByIdCatPaqueteAndIdUsuario(id, idUsuario));


        return generaConfiguracionPaquetesDto(paquete, paqueteServicios, paqueteMetricas, paqueteDashboards);
    }


    @Override
    public ConfiguracionPaquetesDto registraPaquetesByCreadoPor(Integer idUsuario, ConfiguracionPaquetesDto configuracionPaquetes) {
        TbUsuario usuario = TbUsuario.builder()
                .idUsuario(idUsuario)
                .build();

        TbCatPaquete paqueteCreado = paqueteService.registrar(paqueteDtoToTbCatPaquete(configuracionPaquetes, usuario));


        List<PaquetesDto> paqueteServicios = paqueteServiciosToPaquetesDto(paqueteServicioService.saveAllPaqueteServicio(listaServicioDtoToListaTbPaqueteServicio(configuracionPaquetes.getServicios(), paqueteCreado, usuario)));
        List<PaquetesDto> paqueteDashboards = paqueteDashboardsToPaquetesDto(paqueteDashboardService.saveAllDashboards(listaDashboardDtoToListaTbPaqueteDashboard(configuracionPaquetes.getDashboards(), paqueteCreado, usuario)));
        List<PaquetesDto> paqueteMetricas = paqueteMetricasToPaquetesDto(paqueteMetricaService.saveAllMetricas(listaMetricaDtoToListaTbPaqueteMetrica(configuracionPaquetes.getMetricas(), paqueteCreado, usuario)));

        return generaConfiguracionPaquetesDto(paqueteCreado, paqueteServicios, paqueteMetricas, paqueteDashboards);
    }


    @Override
    public ConfiguracionPaquetesDto actualizaPaquetesByCreadoPorAndIdPaquete(Integer idCatPaquete, Integer idUsuario, ConfiguracionPaquetesDto configuracionPaquete) {
        List<PaquetesDto> listaPaqueteServicio = new ArrayList<>();
        List<PaquetesDto> listaPaqueteDashboard = new ArrayList<>();
        List<PaquetesDto> listaPaqueteMetrcica = new ArrayList<>();
        TbCatPaquete paquete = validaCatPaquete(paqueteService.listarPorId(idCatPaquete));
        TbUsuario usuario = TbUsuario.builder()
                .idUsuario(idUsuario)
                .build();
        ConfiguracionPaquetesDto configuracionPaquetesDtoOriginal = obtieneInformacionPaqueteById(idCatPaquete);

        paquete.setCantidadUsuarios(configuracionPaquete.getCantidadUsuarios());
        paquete.setInformacion(configuracionPaquete.getInformacion());
        paquete.setDescripcion(configuracionPaquete.getDescripcion());
        paquete.setActualizadoPor(usuario);
        paquete.setFechaActualizacion(LocalDateTime.now());

        paquete = paqueteService.modificar(paquete);


        if (!configuracionPaquetesDtoOriginal.getMetricas().equals(configuracionPaquete.getMetricas())) {
            List<TbPaqueteMetrica> metricas = paqueteMetricaService.findPaqueteMetricaByIdCatPaquete(idCatPaquete);
            paqueteMetricaService.deleteAllPaquetemetrica(metricas);

            listaPaqueteMetrcica = paqueteMetricasToPaquetesDto(paqueteMetricaService.saveAllMetricas(listaMetricaDtoToListaTbPaqueteMetrica(configuracionPaquete.getMetricas(), paquete, usuario)));

        }
        if (!configuracionPaquetesDtoOriginal.getServicios().equals(configuracionPaquete.getServicios())) {
            List<TbPaqueteServicio> servicios = paqueteServicioService.findPaqueteServicioByIdCatPaquete(idCatPaquete);
            paqueteServicioService.deleteListPaqueteServicio(servicios);

            listaPaqueteServicio = paqueteServiciosToPaquetesDto(paqueteServicioService.saveAllPaqueteServicio(listaServicioDtoToListaTbPaqueteServicio(configuracionPaquete.getServicios(), paquete, usuario)));

        }
        if (!configuracionPaquetesDtoOriginal.getDashboards().equals(configuracionPaquete.getDashboards())) {
            List<TbPaqueteDashboard> dashboards = paqueteDashboardService.findPaqueteDashboardByIdCatPaquete(idCatPaquete);
            paqueteDashboardService.deleteAllPaqueteDashboard(dashboards);

            listaPaqueteDashboard = paqueteDashboardsToPaquetesDto(paqueteDashboardService.saveAllDashboards(listaDashboardDtoToListaTbPaqueteDashboard(configuracionPaquete.getDashboards(), paquete, usuario)));

        }

        return generaConfiguracionPaquetesDto(paquete, listaPaqueteServicio, listaPaqueteMetrcica, listaPaqueteDashboard);
    }

    @Override
    public void borraPaqueteByIdCatPaqueteAndCreadoPor(Integer idCatPaquete, Integer idUsuario) {

        borraCatPaquete(validaCatPaquete(paqueteService.listarPorId(idCatPaquete)));
        /*borraPaqueteMetricas(idCatPaquete);
        borraPaqueteDashboard(idCatPaquete);
        borraPaqueteServicios(idCatPaquete);*/
    }

    private void borraCatPaquete(TbCatPaquete paquete) {
    	TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus("Inactivo", "G");
    	paquete.setFechaBaja(LocalDateTime.now());
        paquete.setEliminadoPor(paquete.getCreadoPor());
        paquete.setTbCatEstatus(estatus);
        paqueteService.modificar(paquete);
    }

    private void borraPaqueteMetricas(Integer idCatPaquete) {
        List<TbPaqueteMetrica> metricas = paqueteMetricaService.findPaqueteMetricaByIdCatPaquete(idCatPaquete);
        if (!metricas.isEmpty()) {
            paqueteMetricaService.deleteAllPaquetemetrica(metricas);
        }
    }

    private void borraPaqueteServicios(Integer idCatPaquete) {
        List<TbPaqueteServicio> servicios = paqueteServicioService.findPaqueteServicioByIdCatPaquete(idCatPaquete);
        if (!servicios.isEmpty()) {
            paqueteServicioService.deleteListPaqueteServicio(servicios);
        }
    }

    private void borraPaqueteDashboard(Integer idCatPaquete) {
        List<TbPaqueteDashboard> dashboards = paqueteDashboardService.findPaqueteDashboardByIdCatPaquete(idCatPaquete);
        if (!dashboards.isEmpty()) {
            paqueteDashboardService.deleteAllPaqueteDashboard(dashboards);
        }
    }

    private List<TbPaqueteServicio> listaServicioDtoToListaTbPaqueteServicio(List<PaquetesDto> servicios, TbCatPaquete paquete, TbUsuario usuario) {

        if (servicios == null || servicios.isEmpty()) {
            return new ArrayList<>();
        }

        return servicios.stream()
                .map(s -> TbPaqueteServicio.builder()
                        .tbCatPaquete(paquete)
                        .tbCatServicio(TbCatServicio.builder()
                                .idCatServicios(s.getId())
                                .build())
                        .creadoPor(usuario)
                        .fechaCreacion(LocalDateTime.now())
                        .build())
                .collect(Collectors.toList());
    }

    private List<TbPaqueteMetrica> listaMetricaDtoToListaTbPaqueteMetrica(List<PaquetesDto> metricas, TbCatPaquete paquete, TbUsuario usuario) {
        if (metricas == null || metricas.isEmpty()) {
            return new ArrayList<>();
        }
        return metricas.stream()
                .map(m -> TbPaqueteMetrica.builder()
                        .tbMetrica(TbMetrica.builder()
                                .idMetrica(m.getId())
                                .build())
                        .tbCatPaquete(paquete)
                        .fechaCreacion(LocalDateTime.now())
                        .creadoPor(usuario)
                        .build())
                .collect(Collectors.toList());
    }

    private List<TbPaqueteDashboard> listaDashboardDtoToListaTbPaqueteDashboard(List<PaquetesDto> dashboards, TbCatPaquete paquete, TbUsuario usuario) {
        if (dashboards == null || dashboards.isEmpty()) {
            return new ArrayList<>();
        }
        return dashboards.stream()
                .map(d -> TbPaqueteDashboard.builder()
                        .tbCatPaquete(paquete)
                        .tbDashboard(TbDashboard.builder()
                                .idDashboard(d.getId())
                                .build())
                        .creadoPor(usuario)
                        .fechaCreacion(LocalDateTime.now())
                        .build())
                .collect(Collectors.toList());
    }

    private TbCatPaquete paqueteDtoToTbCatPaquete(ConfiguracionPaquetesDto configuracionPaquetes, TbUsuario usuario) {
    	TbCatEstatus estatus = estatusRepository.findByDescripcionAndTipoEstatus("Activo", "G");
    	
        return TbCatPaquete.builder()
                .descripcion(configuracionPaquetes.getDescripcion())
                .informacion(configuracionPaquetes.getInformacion())
                .cantidadUsuarios(configuracionPaquetes.getCantidadUsuarios())
                .fechaCreacion(LocalDateTime.now())
                .creadoPor(usuario)
                .tbCatEstatus(estatus)
                .build();
    }

    private TbCatPaquete validaCatPaquete(TbCatPaquete paquete) {
        if (paquete == null || paquete.getFechaBaja() != null) {
            throw new ApiException(404, "Paquete no encontrado");
        }
        return paquete;
    }

    private ConfiguracionPaquetesDto generaConfiguracionPaquetesDto(TbCatPaquete paquete, List<PaquetesDto> paqueteServicios, List<PaquetesDto> paqueteMetricas, List<PaquetesDto> paqueteDashboards) {
        return ConfiguracionPaquetesDto.builder()
                .idCatPaquetes(paquete.getIdCatPaquete())
                .informacion(paquete.getInformacion())
                .descripcion(paquete.getDescripcion())
                .cantidadUsuarios(paquete.getCantidadUsuarios())
                .servicios(paqueteServicios)
                .dashboards(paqueteDashboards)
                .metricas(paqueteMetricas)
                .build();
    }

    private List<PaquetesDto> paqueteServiciosToPaquetesDto(List<TbPaqueteServicio> paqueteServicios) {
        if (paqueteServicios == null || paqueteServicios.isEmpty()) {
            return new ArrayList<>();
        }
        return paqueteServicios.stream().map(ps -> PaquetesDto.builder()
                        .id(ps.getTbCatServicio().getIdCatServicios())
                        .descripcion(ps.getTbCatServicio().getDescripcion())
                        .build())
                .collect(Collectors.toList());
    }

    private List<PaquetesDto> paqueteMetricasToPaquetesDto(List<TbPaqueteMetrica> paqueteMetricas) {
        if (paqueteMetricas == null || paqueteMetricas.isEmpty()) {
            return new ArrayList<>();
        }
        return paqueteMetricas.stream().map(pm -> PaquetesDto.builder()
                        .id(pm.getTbMetrica().getIdMetrica())
                        .descripcion(pm.getTbMetrica().getInformacion())
                        .build())
                .collect(Collectors.toList());
    }

    private List<PaquetesDto> paqueteDashboardsToPaquetesDto(List<TbPaqueteDashboard> paqueteDashboards) {
        if (paqueteDashboards == null || paqueteDashboards.isEmpty()) {
            return new ArrayList<>();
        }
        return paqueteDashboards.stream().map(pd -> PaquetesDto.builder()
                        .id(pd.getTbDashboard().getIdDashboard())
                        .descripcion(pd.getTbDashboard().getInformacion())
                        .build())
                .collect(Collectors.toList());
    }

}
