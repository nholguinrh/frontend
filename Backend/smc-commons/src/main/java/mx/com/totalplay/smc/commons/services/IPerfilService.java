package mx.com.totalplay.smc.commons.services;

import java.util.List;

import mx.com.totalplay.smc.entities.TbCatPerfil;

public interface IPerfilService extends IGenericService<TbCatPerfil, Integer> {

	/**
	 * Obtiene los perfiles por tipo
	 * 
	 * @param tipo
	 * @return
	 */
	List<TbCatPerfil> listarPorTipo(String tipo);

}
