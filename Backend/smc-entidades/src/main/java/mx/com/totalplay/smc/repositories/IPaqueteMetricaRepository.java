package mx.com.totalplay.smc.repositories;

import mx.com.totalplay.smc.entities.TbCatPaquete;
import mx.com.totalplay.smc.entities.TbPaqueteMetrica;
import mx.com.totalplay.smc.entities.TbUsuario;

import java.util.List;

public interface IPaqueteMetricaRepository extends IGenericRepository<TbPaqueteMetrica, Integer> {

    List<TbPaqueteMetrica> findAllByTbCatPaquete(TbCatPaquete catPaquete);

    List<TbPaqueteMetrica> findAllByTbCatPaqueteAndCreadoPor(TbCatPaquete catPaquete, TbUsuario usuario);

}
