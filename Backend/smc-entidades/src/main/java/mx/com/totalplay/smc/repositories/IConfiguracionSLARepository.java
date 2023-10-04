package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.web.PageableDefault;

import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbConfiguracionSLA;

/**
 * @author Luis Luna
 *
 */
public interface IConfiguracionSLARepository extends IGenericRepository<TbConfiguracionSLA, Long> {

	List<TbConfiguracionSLA> findAllByIndicaPlantilla(int i);

	List<TbConfiguracionSLA> findAllByIndicaPlantillaAndTbCatEstatus(int i, TbCatEstatus estatus);
	
	List<TbConfiguracionSLA> findAllByTbCatEstatus(TbCatEstatus estatus);

	Page<TbConfiguracionSLA> findByTituloSLALike(String concat, Pageable pageable);
	
	List<TbConfiguracionSLA> findByTituloSLALike(String concat);

	List<TbConfiguracionSLA> findByTituloSLALikeAndIndicaPlantillaAndTbCatEstatus(
			String concat, int i, TbCatEstatus estatus);
	
	@Query(value = "SELECT * FROM ConfiguracionSLA "
			+ " WHERE tituloSLA like %:cadena% "
			+ " AND idCatEstatus =:estatus "
			+ " AND indicaPlantilla = 1", nativeQuery = true)
	List<TbConfiguracionSLA> findByTituloSLALikeAndTbCatEstatus(@Param("cadena")String cadena,@Param("estatus") TbCatEstatus estatus);
	
	List<TbConfiguracionSLA> findAllByTituloSLA(String tituloSLA);

	List<TbConfiguracionSLA> findAllByTituloSLAAndTbCatEstatus(String tituloSLA, TbCatEstatus estatus);
	
}
