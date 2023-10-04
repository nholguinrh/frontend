/**
 * 
 */
package mx.com.totalplay.smc.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbClientePunta;
import mx.com.totalplay.smc.entities.TbPuntaInterfaz;

/**
 * @author Luis Luna
 *
 */
public interface IPuntaInterfazRepository extends IGenericRepository<TbPuntaInterfaz, Long> {

	List<TbPuntaInterfaz> findAllByTbClientePunta(TbClientePunta punta);
	
	List<TbPuntaInterfaz> findAllByTbClientePuntaAndTbCatEstatus(TbClientePunta punta, TbCatEstatus tbCatEstatus);	

	Integer countByTbClientePunta(TbClientePunta punta);
	
	Integer countByTbClientePuntaAndTbCatEstatus(TbClientePunta punta, TbCatEstatus tbCatEstatus);

//	@Query(value = "UPDATE PuntasInterfaces SET activarInterfaz = :activacion, "
	@Query(value = "UPDATE PuntasInterfaces SET idCatEstatus = :estatus, "
			+ "actualizadoPor = :idUsuario, "
			+ "fechaActualizacion = :fechaActualizacion WHERE "
			+ "idClientePuntas IN "
				+ "( SELECT idClientePuntas FROM ClientePuntas "
				+ "WHERE idClientes = :idCliente ) ", nativeQuery = true)
	void activacionMasiva(@Param("idCliente")Long idCliente,@Param("estatus") Integer estatus,
			@Param("idUsuario") Integer idUsuario, @Param("fechaActualizacion") LocalDateTime fechaActualizacion);
	
	@Query(value = " UPDATE PuntasInterfaces SET idConfiguracionSLA = null "
			+ " WHERE idClientePuntas IN "
			+ " ( SELECT idClientePuntas FROM ClientePuntas "
			+ " WHERE idClientes = :idCliente and idCatEstatus = 16) ", nativeQuery = true)
	void desactivaConfiguracionSLA(@Param("idCliente")Long idCliente);

	@Query(value = "SELECT count(*) FROM PuntasInterfaces PI WHERE "
			+ "PI.idClientePuntas IN "
			+ "( SELECT idClientePuntas FROM ClientePuntas CP WHERE CP.idClientes = :idCliente ) "
			+ "AND PI.idCatEstatus = 27", nativeQuery = true)
	int countInterfacesActivasByCliente(@Param("idCliente") Long idCliente);

	@Query(value = "UPDATE PuntasInterfaces pi "
			+ "SET pi.idCatEstatus = :idCatEstatus, "
			+ "pi.actualizadoPor = :idUsuario, "
			+ "pi.fechaActualizacion = :date "
			+ "WHERE pi.idClientePuntas = :idClientePunta ", nativeQuery = true)
	void activarDesactivarInterfacesPunta(@Param("idClientePunta")Long idClientePunta,
			@Param("idCatEstatus") Integer idCatEstatus, 
			@Param("idUsuario")Integer idUsuario,@Param("date") LocalDateTime date);
	
	@Query(value = "SELECT count(1) FROM PuntasInterfaces CP "
			+ "WHERE CP.idClientePuntas = :idClientePuntas "
			+ "AND CP.idConfiguracionSLA is not null", nativeQuery = true)
	int countInterfacesConfiguaradsByClientePuntas(@Param("idClientePuntas") Long idClientePuntas);
	
	@Query(value = "SELECT count(1) FROM PuntasInterfaces CP "
			+ "WHERE CP.idClientePuntas = :idClientePuntas "
			+ "AND CP.idConfiguracionSLA = :idConfiguracionSLA", nativeQuery = true)
	int countInterfacesConfiguarads(@Param("idClientePuntas") Long idClientePuntas, @Param("idConfiguracionSLA") Long idConfiguracionSLA);
	
	@Query(value = "SELECT count(1) FROM PuntasInterfaces CP "
			+ "WHERE CP.idClientePuntas = :idClientePuntas "
			+ "AND CP.idCatEstatus = 27 "
			+ "AND CP.idConfiguracionSLA = :idConfiguracionSLA", nativeQuery = true)
	int countInterfacesActivasYConfiguaradas(@Param("idClientePuntas") Long idClientePuntas, @Param("idConfiguracionSLA") Long idConfiguracionSLA);
	
	@Query(value = "SELECT SUM(numeroInterfaces) FROM ClientePuntas CP WHERE CP.idClientes =:idCliente", nativeQuery = true)
	int countInterfacesByCliente(@Param("idCliente") Long idCliente);
	
	
	@Query(value = "SELECT COUNT(*) FROM PuntasInterfaces PI "
	             + "WHERE PI.idClientePuntas =:idClientePuntas "
			     + "AND PI.idCatEstatus = :estatus", nativeQuery = true)
	int countNumeroInterfacesActivas(@Param("idClientePuntas") Long idClientePuntas, @Param("estatus") Integer estatus);
	
	@Query(value = "SELECT COUNT(*) FROM PuntasInterfaces PI "
            + "WHERE PI.idClientePuntas =:idClientePuntas ", nativeQuery = true)
	int countNumeroInterfaces(@Param("idClientePuntas") Long idClientePuntas);
	
}
