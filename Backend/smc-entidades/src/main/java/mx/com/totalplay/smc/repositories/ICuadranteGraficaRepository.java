package mx.com.totalplay.smc.repositories;

import mx.com.totalplay.smc.entities.TbCuadranteGrafica;
import mx.com.totalplay.smc.entities.TbDashboardCuadrante;

import java.util.List;

public interface ICuadranteGraficaRepository extends IGenericRepository<TbCuadranteGrafica, Integer> {

    List<TbCuadranteGrafica> findByTbDashboardCuadrante(TbDashboardCuadrante tbDashboardCuadrante);

    List<TbCuadranteGrafica> findAllByTbDashboardCuadranteIn(List<TbDashboardCuadrante> tbDashboardCuadranteList);

}
