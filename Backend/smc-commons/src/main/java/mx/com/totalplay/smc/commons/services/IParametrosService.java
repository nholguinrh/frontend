package mx.com.totalplay.smc.commons.services;

import mx.com.totalplay.smc.entities.TbParametros;

public interface IParametrosService extends IGenericService<TbParametros, String> {
	
	TbParametros buscarPorId(String identificador); 

}
