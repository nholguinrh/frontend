package mx.com.totalplay.smc.repositories;

import mx.com.totalplay.smc.entities.TbCuadranteGrafica;
import mx.com.totalplay.smc.entities.TbUsuarioConfiguracionDashboard;
import mx.com.totalplay.smc.entities.TbUsuarioConfiguracionGrafica;

import java.util.List;

public interface IUsuarioConfigGraficaRepository extends IGenericRepository<TbUsuarioConfiguracionGrafica, Integer> {

    List<TbUsuarioConfiguracionGrafica> findByTbUsuarioConfiguracionDashboard
            (TbUsuarioConfiguracionDashboard tbUsuarioConfiguracionDashboard);

    TbUsuarioConfiguracionGrafica findByTbUsuarioConfiguracionDashboardAndTbCuadranteGrafica
            (TbUsuarioConfiguracionDashboard tbUsuarioConfiguracionDashboard, TbCuadranteGrafica tbCuadranteGrafica);

    int deleteByTbUsuarioConfiguracionDashboard(TbUsuarioConfiguracionDashboard configDashboard);

    List<TbUsuarioConfiguracionGrafica> findAllByTbUsuarioConfiguracionDashboard(TbUsuarioConfiguracionDashboard tbUsuarioConfiguracionDashboard);

}
