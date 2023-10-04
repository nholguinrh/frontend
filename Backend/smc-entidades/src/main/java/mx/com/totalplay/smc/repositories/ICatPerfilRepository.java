package mx.com.totalplay.smc.repositories;

import java.util.List;

import mx.com.totalplay.smc.entities.TbCatPerfil;

public interface ICatPerfilRepository extends IGenericRepository<TbCatPerfil, Integer> {

	List<TbCatPerfil> findByTipo(String tipo);
	
	List<TbCatPerfil> findByTipoNot(String tipo);
	

}
