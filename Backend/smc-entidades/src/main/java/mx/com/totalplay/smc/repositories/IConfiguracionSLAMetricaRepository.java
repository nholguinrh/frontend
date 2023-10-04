/**
 * 
 */
package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.com.totalplay.smc.entities.TbConfiguracionSLA;
import mx.com.totalplay.smc.entities.TbConfiguracionSLAMetrica;

/**
 * @author Luis Luna
 *
 */
public interface IConfiguracionSLAMetricaRepository 
	extends IGenericRepository<TbConfiguracionSLAMetrica, Long> {

	List<TbConfiguracionSLAMetrica> findByTbConfiguracionSLA(TbConfiguracionSLA configuracionSLA);
	
	@Query(value = "SELECT m FROM TbConfiguracionSLAMetrica m WHERE m.tbConfiguracionSLA.idConfiguracionSLA =:idConfiguracionSLA")
	List<TbConfiguracionSLAMetrica> buscarPorIdConfiguracion(@Param("idConfiguracionSLA") Long idConfiguracionSLA);

}
