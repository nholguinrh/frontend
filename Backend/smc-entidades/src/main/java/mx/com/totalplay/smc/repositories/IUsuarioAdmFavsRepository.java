/**
 * 
 */
package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.entities.TbUsuarioAdmFav;

/**
 * @author Luis Luna
 *
 */
public interface IUsuarioAdmFavsRepository extends IGenericRepository<TbUsuarioAdmFav, Integer> {
	
	TbUsuarioAdmFav findByTbUsuarioAndTbCliente(TbUsuario usuario, TbCliente cliente);
	
	Page<TbUsuarioAdmFav> findByTbUsuario(TbUsuario usuario, Pageable pageable);
	
	Page<TbUsuarioAdmFav> findByTbUsuarioAndTbCliente(TbUsuario usuario, TbCliente cliente, Pageable pageable);

	List<TbUsuarioAdmFav> findAllByTbUsuario(TbUsuario usr);

	@Query(value = "SELECT uaf.* FROM UsuarioAdmFavs uaf "
			+ "INNER JOIN SMCv2.Clientes c "
			+ "WHERE c.idClientes = uaf.idClientes "
			+ "AND uaf.idUsuarios = :idUsuario "
			+ "AND c.idCatEstatus = :idCatEstatus", nativeQuery = true)
	List<TbUsuarioAdmFav> findAllByUsuarioAndEstatusCliente(@Param("idUsuario") Integer idUsuario,
			@Param("idCatEstatus") Integer idCatEstatus);

}
