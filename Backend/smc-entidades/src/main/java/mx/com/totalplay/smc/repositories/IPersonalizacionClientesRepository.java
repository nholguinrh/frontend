package mx.com.totalplay.smc.repositories;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.com.totalplay.smc.entities.TbPersonalizacionClientes;

public interface IPersonalizacionClientesRepository extends IGenericRepository<TbPersonalizacionClientes, Long> {

	TbPersonalizacionClientes findByIdClienteTotalPlayAndFolioTicket(String idCliente, String folioTicket);
	
	@Query("FROM TbPersonalizacionClientes p WHERE p.idClienteTotalPlay =:idCliente AND p.idDispositivo =:idDispositivo AND p.folioTicket IS NULL AND p.ticketExterno IS NULL")
	TbPersonalizacionClientes obtenerDispositivo(@Param("idCliente") String idCliente, @Param("idDispositivo") String idDispositivo);
	
}
