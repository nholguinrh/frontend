/**
 * 
 */
package mx.com.totalplay.smc.repositories;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.entities.TbUsuarioValidacion;

/**
 * @author Luis Luna
 *
 */
public interface IUsuarioValidacionRepository extends IGenericRepository<TbUsuarioValidacion, Long> {

	TbUsuarioValidacion findByTbUsuarioAndTipoValidacion(TbUsuario tbUsuario, Integer tipoValidacion);
	
	@Transactional
	@Modifying
	@Query("DELETE FROM TbUsuarioValidacion tuv WHERE tuv.tbUsuario.idUsuario =:idUsuario")
	void eliminarRegistro(@Param("idUsuario") Integer idUsuario);
	
}
