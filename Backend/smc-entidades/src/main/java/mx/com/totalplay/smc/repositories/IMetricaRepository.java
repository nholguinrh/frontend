package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.com.totalplay.smc.entities.TbMetrica;

/**
 * @author Luis Luna
 *
 */
public interface IMetricaRepository extends IGenericRepository<TbMetrica, Integer> {

//	@Query(value = "SELECT m.* FROM Metricas m  WHERE m.idMetricas IN "
//			+ "	(SELECT DISTINCT  cs.idMetricas FROM ConfiguracionSLAMetricas cs WHERE cs.idConfiguracionSLA IN "
//			+ "	(SELECT DISTINCT  cp.idConfiguracionSLA  FROM ClientePuntas cp WHERE cp.idClientes = :idCliente"
//			+ "	AND cp.idCatEstatus = :idCatEstatus) AND cs.valor IS NOT NULL) ", nativeQuery = true)
//	List<TbMetrica> filtrarMetricasPorCliente(@Param("idCliente") Long idCliente, @Param("idCatEstatus") Integer idCatEstatus);
	
	@Query(value = "select m.*  from Clientes c, PaqueteMetricas pm, Metricas m "
			+ "where c.idClientes = :idCliente "
			+ "and c.idCatPaquetes  = pm.idCatPaquetes "
			+ "and pm.idMetricas = m.idMetricas ", nativeQuery = true)
	List<TbMetrica> filtrarMetricasPorCliente(@Param("idCliente") Long idCliente);
	
	List<TbMetrica> findByTipoMetrica(String tipoMetrica);
	

}
