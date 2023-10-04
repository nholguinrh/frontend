package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.com.totalplay.smc.entities.TbAsignacionSLAClientes;
import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbConfiguracionSLA;

public interface IAsignacionSLAClientesRepository extends 
	IGenericRepository<TbAsignacionSLAClientes, Long> {
	
	List<TbAsignacionSLAClientes> findByTbCliente(TbCliente tbCliente);
	
	List<TbAsignacionSLAClientes> findByTbConfiguracionSLA(TbConfiguracionSLA tbConfiguracionSLA);
	
	@Query(value = "SELECT DISTINCT idClientes FROM AsignacionSLAClientes WHERE idConfiguracionSLA = :idConfiguracionSLA "
			+ " ORDER BY idAsignacionSLAClientes DESC LIMIT 3", nativeQuery = true)
	List<Long> findLastIdClienteByIdConfiguracionSLA(@Param("idConfiguracionSLA") Long idConfiguracionSLA);

	@Query(value = "SELECT DISTINCT idClientes FROM AsignacionSLAClientes " 
			     + " WHERE idConfiguracionSLA in "
			     + "	(select idConfiguracionSLA from ConfiguracionSLA where tituloSLA = :tituloSLA )"
			     + " ORDER BY idAsignacionSLAClientes DESC LIMIT 3", nativeQuery = true)
	List<Long> findLastIdClienteByTituloSLA(@Param("tituloSLA") String tituloSLA);
	
	
	@Query(value = "SELECT * FROM AsignacionSLAClientes " 
		     + " WHERE idConfiguracionSLA in "
		     + "	(select idConfiguracionSLA from ConfiguracionSLA where tituloSLA = :tituloSLA )"
		     + " ORDER BY idAsignacionSLAClientes DESC LIMIT 3", nativeQuery = true)
    List<TbAsignacionSLAClientes> findAsignacionSLAClientesByTituloSLA(@Param("tituloSLA") String tituloSLA);
	
	
	@Query(value = "SELECT DISTINCT idClientes FROM AsignacionSLAClientes " 
		     + " WHERE idConfiguracionSLA in "
		     + "	(select idConfiguracionSLA from ConfiguracionSLA where idCatEstatus = 16)"
		     + " ORDER BY idAsignacionSLAClientes DESC LIMIT 3", nativeQuery = true)
	List<Long> findLastIdCliente();
}
