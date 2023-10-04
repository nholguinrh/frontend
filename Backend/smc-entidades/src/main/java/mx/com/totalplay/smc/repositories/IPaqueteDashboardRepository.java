package mx.com.totalplay.smc.repositories;

import mx.com.totalplay.smc.entities.TbCatPaquete;
import mx.com.totalplay.smc.entities.TbPaqueteDashboard;
import mx.com.totalplay.smc.entities.TbUsuario;

import java.util.List;

public interface IPaqueteDashboardRepository extends IGenericRepository<TbPaqueteDashboard, Integer> {

    List<TbPaqueteDashboard> findAllByTbCatPaquete(TbCatPaquete catPaquete);

    List<TbPaqueteDashboard> findAllByTbCatPaqueteAndCreadoPor(TbCatPaquete catPaquete, TbUsuario usuario);

}
