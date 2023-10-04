package mx.com.totalplay.smc.commons.services;

import mx.com.totalplay.smc.entities.TbPaqueteMetrica;

import java.util.List;

public interface IPaqueteMetricaService extends IGenericService<TbPaqueteMetrica, Integer> {

    List<TbPaqueteMetrica> findPaqueteMetricaByIdCatPaquete(Integer idCatPaquete);

    List<TbPaqueteMetrica> findPaqueteMetricaByIdCatPaqueteAndIdUsuario(Integer idCatPaquete, Integer idUsuario);

    List<TbPaqueteMetrica> saveAllMetricas(List<TbPaqueteMetrica> paqueteMetricas);

    void deleteAllPaquetemetrica(List<TbPaqueteMetrica> paqueteMetricas);
}
