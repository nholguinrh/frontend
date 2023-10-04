package mx.com.totalplay.smc.commons.services;

import mx.com.totalplay.smc.entities.TbPaqueteDashboard;

import java.util.List;

public interface IPaqueteDashboardService extends IGenericService<TbPaqueteDashboard, Integer> {

    List<TbPaqueteDashboard> findPaqueteDashboardByIdCatPaquete(Integer idCatPaquete);

    List<TbPaqueteDashboard> findPaqueteDashboardByIdCatPaqueteAndIdUsuario(Integer idCatPaquete, Integer idUsuario);

    List<TbPaqueteDashboard> saveAllDashboards(List<TbPaqueteDashboard> paqueteDashboards);

    void deleteAllPaqueteDashboard(List<TbPaqueteDashboard> paqueteDashboards);
}
