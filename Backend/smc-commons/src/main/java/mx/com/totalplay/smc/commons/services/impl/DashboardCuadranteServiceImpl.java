package mx.com.totalplay.smc.commons.services.impl;


import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.CuadranteGraficaActivaDto;
import mx.com.totalplay.smc.commons.model.CuadranteGraficaDto;
import mx.com.totalplay.smc.commons.model.DashboardCuadranteDto;
import mx.com.totalplay.smc.commons.services.IDashboardCuadranteService;
import mx.com.totalplay.smc.commons.services.IUsuarioService;
import mx.com.totalplay.smc.commons.utils.HttpStatusApi;
import mx.com.totalplay.smc.entities.TbCuadranteGrafica;
import mx.com.totalplay.smc.entities.TbDashboard;
import mx.com.totalplay.smc.entities.TbDashboardCuadrante;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.entities.TbUsuarioConfiguracionDashboard;
import mx.com.totalplay.smc.entities.TbUsuarioConfiguracionGrafica;
import mx.com.totalplay.smc.repositories.ICuadranteGraficaRepository;
import mx.com.totalplay.smc.repositories.IDashboardCuadranteRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IUsuarioConfigDashboardRepository;
import mx.com.totalplay.smc.repositories.IUsuarioConfigGraficaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardCuadranteServiceImpl extends GenericServiceImpl<TbDashboardCuadrante, Long> implements IDashboardCuadranteService {

    @Autowired
    private IDashboardCuadranteRepository dashboardCuadranteRepository;

    @Autowired
    private ICuadranteGraficaRepository cuadranteGraficaRepository;

    @Autowired
    private IUsuarioConfigGraficaRepository usuarioConfigGraficaRepository;

    @Autowired
    private IUsuarioConfigDashboardRepository usuarioConfigDashboardRepository;

    @Autowired
    private IUsuarioService usuarioService;

    @Override
    protected IGenericRepository<TbDashboardCuadrante, Long> getRepo() {
        return dashboardCuadranteRepository;
    }


    @Override
    public List<DashboardCuadranteDto> obtieneDashboardCuadranteGrafica(Long idUsuario, Long idDashboard) {

        TbUsuario usuario = usuarioService.listarPorId(idUsuario.intValue());
        if (usuario == null) {
            throw new ApiException(HttpStatusApi._404,
                    "No se encontró un usuario con el código consultado.");
        }
        TbUsuarioConfiguracionDashboard configuracionDashboard = usuarioConfigDashboardRepository.findByTbUsuario(usuario);
        if (configuracionDashboard == null) {
            throw new ApiException(HttpStatusApi._404,
                    "No se encontró un configuracion de dashboard para el usuario.");
        }

        List<TbUsuarioConfiguracionGrafica> tbUsuarioConfiguracionGraficaList = usuarioConfigGraficaRepository.findAllByTbUsuarioConfiguracionDashboard(configuracionDashboard);

        List<TbDashboardCuadrante> tbDashboardCuadranteList = dashboardCuadranteRepository.findAllByTbDashboard(TbDashboard.builder()
                .idDashboard(idDashboard.intValue())
                .build());

        List<TbCuadranteGrafica> tbCuadranteGraficaList = cuadranteGraficaRepository.findAllByTbDashboardCuadranteIn(tbDashboardCuadranteList);

        List<CuadranteGraficaActivaDto> cuadranteGraficaActivaDtoList = tbCuadranteGraficaList.stream()
                .filter(cf -> tbUsuarioConfiguracionGraficaList.stream().anyMatch(uc -> uc.getTbCuadranteGrafica().getIdCuadranteGrafica().equals(cf.getIdCuadranteGrafica())))
                .map(cg -> CuadranteGraficaActivaDto.builder()
                        .idCuadranteGrafica(Long.valueOf(cg.getIdCuadranteGrafica()))
                        .idDashboardCudrante(cg.getTbDashboardCuadrante().getIdDashboardCuadrante())
                        .tipoGrafica(cg.getTipoGrafica())
                        .imagen(cg.getImagen())
                        .activo(1)
                        .informacion(cg.getInformacion())
                        .build()).collect(Collectors.toList());

        return tbDashboardCuadranteList.stream().map(dc -> DashboardCuadranteDto.builder()
                .idDashboardCudrante(dc.getIdDashboardCuadrante())
                .activarEdicion(dc.getActivarEdicion())
                .nombre(dc.getNombre())
                .titulo(dc.getTitulo())
                .idDashboard(Long.valueOf(dc.getTbDashboard().getIdDashboard()))
                .cuadranteGrafica(tbCuadranteGraficaList.stream().filter(cf -> dc.getIdDashboardCuadrante().equals(cf.getTbDashboardCuadrante().getIdDashboardCuadrante()))
                        .map(cf -> CuadranteGraficaDto.builder()
                                .idCuadranteGrafica(Long.valueOf(cf.getIdCuadranteGrafica()))
                                .idDashboardCudrante(cf.getTbDashboardCuadrante().getIdDashboardCuadrante())
                                .imagen(cf.getImagen())
                                .informacion(cf.getInformacion())
                                .tipoGrafica(cf.getTipoGrafica())
                                .predeterminado(Integer.valueOf(cf.getPredeterminado()))
                                .build())
                        .collect(Collectors.toList()))
                .cuadranteActivo(cuadranteGraficaActivaDtoList.stream()
                        .filter(ca -> ca.getIdDashboardCudrante().equals(dc.getIdDashboardCuadrante()))
                        .findFirst()
                        .orElse(null))
                .build()).collect(Collectors.toList());
    }

}
