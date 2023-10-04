package mx.com.totalplay.smc.commons.services;

import mx.com.totalplay.smc.commons.model.DashboardCuadranteDto;
import mx.com.totalplay.smc.entities.TbDashboardCuadrante;

import java.util.List;

public interface IDashboardCuadranteService extends IGenericService<TbDashboardCuadrante, Long> {

    List<DashboardCuadranteDto> obtieneDashboardCuadranteGrafica(Long idUsuario, Long idDashboard);

}
