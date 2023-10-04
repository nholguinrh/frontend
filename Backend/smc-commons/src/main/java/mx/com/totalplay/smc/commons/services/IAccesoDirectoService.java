package mx.com.totalplay.smc.commons.services;

import java.util.List;

import mx.com.totalplay.smc.entities.TbCatAccesoDirecto;

public interface IAccesoDirectoService extends IGenericService<TbCatAccesoDirecto, Long> {

	List<TbCatAccesoDirecto> listarPorTipoAcceso(String tipoAcceso);
	
}
