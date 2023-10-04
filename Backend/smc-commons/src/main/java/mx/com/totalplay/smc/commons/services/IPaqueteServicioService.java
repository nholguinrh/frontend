package mx.com.totalplay.smc.commons.services;

import mx.com.totalplay.smc.entities.TbPaqueteServicio;

import java.util.List;

public interface IPaqueteServicioService extends IGenericService<TbPaqueteServicio, Integer> {

    List<TbPaqueteServicio> findPaqueteServicioByIdCatPaquete(Integer idCatPaquete);

    List<TbPaqueteServicio> findPaqueteServicioByIdCatPaqueteAndIdUsuario(Integer idCatPaquete, Integer idUsuario);

    List<TbPaqueteServicio> saveAllPaqueteServicio(List<TbPaqueteServicio> paqueteServicios);

    void deleteListPaqueteServicio(List<TbPaqueteServicio> paqueteServicios);

}
