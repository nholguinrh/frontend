/**
 * 
 */
package mx.com.totalplay.smc.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClientePunta;


/**
 * @author Luis Luna
 *
 */
public interface IClientePuntaRepository extends IGenericRepository<TbClientePunta, Long>, IClientePuntaRepositoryCustom {

	List<TbClientePunta> findAllByTbCliente(TbCliente cte);
	
	List<TbClientePunta> findAllByTbClienteAndTbCatEstatus(TbCliente cte, TbCatEstatus tbCatEstatus);
		
	Page<TbClientePunta> findByTbCliente(TbCliente cte, Pageable pageable);
	
	Page<TbClientePunta> findByTbClienteAndTbCatEstatusNot(TbCliente cliente, TbCatEstatus tbCatEstatus, Pageable pageable);

	Page<TbClientePunta> findByTbClienteAndTbCatEstatus(TbCliente cliente, TbCatEstatus tbCatEstatus, Pageable pageable);

	Page<TbClientePunta> findByTbClienteAndTipoPunta(TbCliente cliente, String tipoPunta, Pageable pageable);
	
	Page<TbClientePunta> findByTbClienteAndTipoPuntaAndTbCatEstatusNot(TbCliente cliente, String tipoPunta, TbCatEstatus tbCatEstatus, Pageable pageable);
	
	Page<TbClientePunta> findByTbClienteAndTipoPuntaAndTbCatEstatus(TbCliente cliente, String tipoPunta, TbCatEstatus tbCatEstatus, Pageable pageable);
	
	Page<TbClientePunta> findByTbClienteAndTipoPuntaNotAndTbCatEstatus(TbCliente cliente, String tipoPunta, TbCatEstatus tbCatEstatus, Pageable pageable);
	
	Page<TbClientePunta> findByTbClienteAndTipoPuntaNot(TbCliente cliente, String tipoPunta, Pageable pageable);
	
	Page<TbClientePunta> findByTbClienteAndTipoPuntaNotAndTbCatEstatusNot(TbCliente cliente, String tipoPunta, TbCatEstatus tbCatEstatus, Pageable pageable);

	@Query(value = "UPDATE ClientePuntas SET idCatEstatus = :estatus, "
			+ "actualizadoPor = :idUsuario, "
			+ "fechaActualizacion = :fechaActualizacion WHERE "
			+ "idClientes = :idCliente and idCatEstatus != 32", nativeQuery = true)
	void activacionMasiva(@Param("idCliente") Long idCliente, @Param("estatus") Integer estatus, 
			@Param("idUsuario") Integer idUsuario, @Param("fechaActualizacion") LocalDateTime fechaActualizacion);
	

	@Query(value = " UPDATE ClientePuntas SET idConfiguracionSLA = null WHERE idClientes = :idCliente and idCatEstatus = 16 ", nativeQuery = true)
	void desactivaConfiguracionSLA(@Param("idCliente") Long idCliente);

	int countByTbClienteAndSitioNotNull(TbCliente cte);
	
	int countByTbClienteAndEnlaceNotNull(TbCliente cte);
		
	@Query(value = "SELECT count(*) FROM ClientePuntas CP WHERE CP.idConfiguracionSLA  = :idConfiguracionSLA", nativeQuery = true)
	int countidConfiguracionSLACliente(@Param("idConfiguracionSLA") Long idConfiguracionSLA);
	
	@Query(value = "SELECT count(*) FROM PuntasInterfaces pi2 WHERE pi2.idConfiguracionSLA  = :idConfiguracionSLA", nativeQuery = true)
	int countidConfiguracionSLAPuntasInterfaces(@Param("idConfiguracionSLA") Long idConfiguracionSLA);	
	
	@Query(value = "SELECT count(1) FROM ClientePuntas CP "
			+ "WHERE CP.idClientes = :idCliente "
			+ "AND idCatEstatus = 16", nativeQuery = true)
	int countSitiosActByCliente(@Param("idCliente") Long idCliente);

	@Query(value = "SELECT count(1) FROM ClientePuntas CP "
			+ "WHERE CP.idClientes = :idCliente "
			+ "AND CP.tipoPunta != 'ENLACE' "
			+ "AND idCatEstatus = 16", nativeQuery = true)
	int countSitiosActivosByCliente(@Param("idCliente") Long idCliente);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas CP "
			+ "WHERE CP.idClientes = :idCliente "
			+ "AND CP.enlace is not null "
			+ "AND idCatEstatus = 16", nativeQuery = true)
	int countEnlacesActivosByCliente(@Param("idCliente") Long idCliente);
	
	Page<TbClientePunta> findByTbClienteAndTbConfiguracionSLANotNull(TbCliente cte,Pageable pageable);
	
	Page<TbClientePunta> findByTbClienteAndTbConfiguracionSLAIsNull(TbCliente cte,Pageable pageable);
	
	Page<TbClientePunta> findByTbClienteAndTbCatEstatusAndTbConfiguracionSLANotNull(TbCliente cte, TbCatEstatus tbCatEstatus, Pageable pageable);
	
	Page<TbClientePunta> findByTbClienteAndTbCatEstatusAndTbConfiguracionSLAIsNull(TbCliente cte, TbCatEstatus tbCatEstatus, Pageable pageable);

	Page<TbClientePunta> findByEnlaceContainingOrIpnsContainingOrSitioContainingOrAliasContainingAndTbCliente
	(String cadena1, String cadena2, String cadena3, String cadena4, TbCliente cliente, Pageable pageable);

	@Query(value = "SELECT * FROM ClientePuntas "
			+ "WHERE idClientes = :idCliente AND( "
			+ "ipns LIKE %:cadena% OR "
			+ "alias LIKE %:cadena% OR "
			+ "enlace LIKE %:cadena% OR "
			+ "sitio LIKE %:cadena%) AND idCatEstatus != 32", nativeQuery = true)
	Page<TbClientePunta> filtrarPorCadena(@Param("idCliente") Long idCliente, @Param("cadena")String cadena, Pageable pageable);

	Page<TbClientePunta> findByTbClienteAndTipoPuntaNotAndTbConfiguracionSLANotNull(TbCliente cte,String tipoPunta,Pageable pageable);
	
	Page<TbClientePunta> findByTbClienteAndTipoPuntaNotAndTbConfiguracionSLAIsNull(TbCliente cte,String tipoPunta,Pageable pageable);
	
	List<TbClientePunta> findByTbClienteAndTbConfiguracionSLANotNull(TbCliente cte);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas "
			+ " WHERE idClientes = :idCliente "
			+ " AND tipoPunta != 'ENLACE'"
			+ " And idCatEstatus = 16 ", nativeQuery = true)
	int countPuntas(@Param("idCliente") Long idCliente);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas "
			+ " WHERE idClientes = :idCliente "
			+ " AND idConfiguracionSLA IS NOT NULL"
			+ " And idCatEstatus = 16 ", nativeQuery = true)
	int countPuntasConfiguradasSLA(@Param("idCliente") Long idCliente);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas "
			+ " WHERE idClientes = :idCliente "
			+ " AND idConfiguracionSLA = :idConfiguracionSLA "
			+ " And idCatEstatus = 16 ", nativeQuery = true)
	int countPuntasConfiguradasSLAPlantilla(@Param("idCliente") Long idCliente, @Param("idConfiguracionSLA") Long idConfiguracionSLA);	
	
	@Query(value = "SELECT count(1) FROM ClientePuntas "
			+ " WHERE idClientes = :idCliente "
			+ " AND tipoPunta != 'ENLACE'"
			+ " AND idConfiguracionSLA = :idConfiguracionSLA", nativeQuery = true)
	int countPuntasConfiguradas(@Param("idCliente") Long idCliente, 
			@Param("idConfiguracionSLA") Long idConfiguracionSLA);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas "
			+ " WHERE idClientes = :idCliente "
			+ " AND tipoPunta = 'ENLACE'"
			+ " AND idConfiguracionSLA = :idConfiguracionSLA", nativeQuery = true)
	int countEnlacesConfigurados(@Param("idCliente") Long idCliente, 
			@Param("idConfiguracionSLA") Long idConfiguracionSLA);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas "
			+ " WHERE idClientes = :idCliente "
			+ " AND idCatEstatus = 16 "
			+ " AND tipoPunta = 'ENLACE' ", nativeQuery = true)
	int countEnlacesActivos(@Param("idCliente") Long idCliente);
	
	
	@Query(value = "SELECT count(1) FROM ClientePuntas "
			+ " WHERE idClientes = :idCliente "
			+ " AND idCatEstatus = 16 "
			+ " AND tipoPunta = 'ENLACE' "
			+ " AND idConfiguracionSLA is not null ", nativeQuery = true)
	int countEnlacesActivosConfigurados(@Param("idCliente") Long idCliente);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas "
			+ " WHERE idClientes = :idCliente "
			+ " AND idCatEstatus = 16 "
			+ " AND tipoPunta = 'ENLACE' "
			+ " AND idConfiguracionSLA = :idConfiguracionSLA ", nativeQuery = true)
	int countEnlacesActivosConfigurados(@Param("idCliente") Long idCliente,
			@Param("idConfiguracionSLA") Long idConfiguracionSLA);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas "
			+ " WHERE idClientes = :idCliente "
			+ " AND idCatEstatus = 16 "
			+ " AND tipoPunta != 'ENLACE' "
			+ " AND idConfiguracionSLA = :idConfiguracionSLA ", nativeQuery = true)
	int countPuntasActivasConfiguradas(@Param("idCliente") Long idCliente,
			@Param("idConfiguracionSLA") Long idConfiguracionSLA);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas "
			+ " WHERE idClientes = :idCliente "
			+ " AND idCatEstatus = 16 "
			+ " AND tipoPunta != 'ENLACE' "
			+ " AND idConfiguracionSLA is not null ", nativeQuery = true)
	int countPuntasActivasConfiguradas(@Param("idCliente") Long idCliente);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas CP, PuntasInterfaces PI "
			+  " WHERE CP.idClientes = :idCliente "
			+  " AND PI.idCatEstatus = 27 "
			+  " AND CP.idConfiguracionSLA is not null"
			+  " AND PI.idConfiguracionSLA is not null "
			+  " AND CP.idClientePuntas = PI.idClientePuntas ", nativeQuery = true)
	int countServiciosActivos(@Param("idCliente")Long idCliente);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas CP, PuntasInterfaces PI "
			+  " WHERE CP.idClientes = :idCliente "
			+  " AND PI.idCatEstatus = 27 "
			+  " AND CP.idClientePuntas = PI.idClientePuntas ", nativeQuery = true)
	int countServiciosActivosByTbInterfazAndSLANotNull(@Param("idCliente")Long idCliente);
	

	@Query(value = "SELECT count(1) FROM ClientePuntas CP "
			+ " WHERE CP.idClientes = :idCliente "
			+ " AND CP.idCatEstatus = 16 ", nativeQuery = true)
	int countSitiosByTbClienteAndTbConfiguracionSLANotNullAndTbEstatus(@Param("idCliente") Long idCliente);
	
	@Query(value = "SELECT count(1) FROM ClientePuntas CP, PuntasInterfaces PI "
			+  " WHERE CP.idClientes = :idCliente "
			+  " AND CP.idClientePuntas = PI.idClientePuntas "
			+  " AND PI.idCatEstatus = 27 ", nativeQuery = true)
	int countServiciosActivosByTbInterfazAndSLANotNullAndTbEstatus(@Param("idCliente")Long idCliente);

	@Query(value = "SELECT CP.idClientePuntas FROM ClientePuntas CP join PuntasInterfaces PI "
			+  "ON CP.idClientePuntas = PI.idClientePuntas "
			+  "WHERE CP.idClientes = :idCliente "
			+  "AND CP.idCatEstatus != 32 "
			//+  "AND PI.idCatEstatus = 27 "
			+  "AND CP.tipoPunta != 'ENLACE'", nativeQuery = true)
	List<Long> filtrarPorClienteInterfaces(@Param("idCliente") Long idCliente);
	
	Page<TbClientePunta> findByIdClientePuntaIn(List<Long> ids,Pageable pageable);

	@Query(value = " update ConfiguracionSLA set idCatEstatus = 17 where idConfiguracionSLA = :idConfiguracionSLA ", nativeQuery = true )
	void desactivaConfiguracionSLACliente(@Param("idConfiguracionSLA")Long idConfiguracionSLA);
	
	@Query(value = " update ClientePuntas set idConfiguracionSLA = null where idConfiguracionSLA = :idConfiguracionSLA ", nativeQuery = true )
	void desactivaConfiguracionSLAClientePuntas(@Param("idConfiguracionSLA")Long idConfiguracionSLA);
	
	@Query(value = " update PuntasInterfaces set idConfiguracionSLA = null where idConfiguracionSLA = :idConfiguracionSLA ", nativeQuery = true )
	void desactivaConfiguracionSLAPuntasInterfaces(@Param("idConfiguracionSLA")Long idConfiguracionSLA);
	
	int countByTbClienteAndTipoPuntaNotAndTbCatEstatus(TbCliente cliente, String tipoPunta, TbCatEstatus tbCatEstatus);
	
	int countByTbClienteAndTipoPuntaNotAndTbCatEstatusNot(TbCliente cliente, String tipoPunta, TbCatEstatus tbCatEstatus);
	
	int countByTbClienteAndTipoPuntaNot(TbCliente cliente, String tipoPunta);
	
	int countByTbClienteAndTipoPuntaAndTbCatEstatus(TbCliente cliente, String tipoPunta, TbCatEstatus tbCatEstatus);
	
	int countByTbClienteAndTipoPunta(TbCliente cliente, String tipoPunta);
	
	@Query(value = "SELECT cp.idClientePuntas FROM ClientePuntas cp left JOIN PuntasInterfaces pi "
			+  "ON pi.idClientePuntas = cp.idClientePuntas "
			+  "WHERE cp.idClientes = :idCliente "
			+  "AND cp.idCatEstatus = 16 "
			+  "AND (cp.idConfiguracionSLA IS NOT NULL "
			+  "OR pi.idConfiguracionSLA IS NOT NULL ) ", nativeQuery = true)
	List<Long> filtrarActivasYConfiguradas(@Param("idCliente")Long idCliente);
	
	@Query(value = "SELECT cp.idClientePuntas FROM ClientePuntas cp left JOIN PuntasInterfaces pi "
			+  "ON pi.idClientePuntas = cp.idClientePuntas "
			+  "WHERE cp.idClientes = :idCliente "
			+  "AND cp.idCatEstatus = 16 "
			+  "AND cp.idConfiguracionSLA IS NULL ", nativeQuery = true)
			//+  "AND (pi.idConfiguracionSLA IS NULL AND pi.idClientePuntas > 0 )", nativeQuery = true)
	List<Long> filtrarActivasYNoConfiguradas(@Param("idCliente")Long idCliente);
	
	int countByTbCliente(TbCliente cliente);
	
	List<TbClientePunta> findByIdDispositivo(String idDispositivo);
	
	@Query(value = "select DISTINCT(cp.tipoPunta) from ClientePuntas cp where cp.idClientes = :idCliente ", nativeQuery = true)
	List<String> distinctTipoPuntaByIdCliente(@Param("idCliente") Long idCliente);
	
}
