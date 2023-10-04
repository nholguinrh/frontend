package mx.com.totalplay.smc.commons.services;

import java.util.List;

import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.entities.TbCatEstatus;

public interface IEstatusService extends IGenericService<TbCatEstatus, Integer> {

	List<TbCatEstatus> listarPorTipo(String tipo) throws ApiException;
}
