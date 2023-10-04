package mx.com.totalplay.smc.repositories;

import mx.com.totalplay.smc.entities.TbDashboard;
import mx.com.totalplay.smc.entities.TbDashboardCuadrante;

import java.util.List;

public interface IDashboardCuadranteRepository extends IGenericRepository<TbDashboardCuadrante, Long> {

    List<TbDashboardCuadrante> findAllByTbDashboard(TbDashboard tbDashboard);

}
