package mx.com.totalplay.smc.repositories;

import mx.com.totalplay.smc.entities.TbCatPaquete;
import mx.com.totalplay.smc.entities.TbPaqueteServicio;
import mx.com.totalplay.smc.entities.TbUsuario;

import java.util.List;

public interface IPaqueteServicioRepository extends IGenericRepository<TbPaqueteServicio, Integer> {

    List<TbPaqueteServicio> findAllByTbCatPaquete(TbCatPaquete paqueteServicio);

    List<TbPaqueteServicio> findAllByTbCatPaqueteAndCreadoPor(TbCatPaquete catPaquete, TbUsuario usuario);
    
}
