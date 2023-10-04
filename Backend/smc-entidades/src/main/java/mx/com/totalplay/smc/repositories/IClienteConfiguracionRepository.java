package mx.com.totalplay.smc.repositories;

import java.util.List;

import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClienteConfiguracion;

public interface IClienteConfiguracionRepository extends IGenericRepository<TbClienteConfiguracion, Long> {
	
	List<TbClienteConfiguracion> findByTbCliente(TbCliente tbCliente);
	
}