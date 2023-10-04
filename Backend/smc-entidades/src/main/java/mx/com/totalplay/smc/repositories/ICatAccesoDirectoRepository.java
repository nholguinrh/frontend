package mx.com.totalplay.smc.repositories;

import java.util.List;

import mx.com.totalplay.smc.entities.TbCatAccesoDirecto;

public interface ICatAccesoDirectoRepository extends IGenericRepository<TbCatAccesoDirecto, Long> {

	List<TbCatAccesoDirecto> findByTipoAcceso(String tipoAcceso);

}
