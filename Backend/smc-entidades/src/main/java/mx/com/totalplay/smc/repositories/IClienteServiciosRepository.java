/**
 * 
 */
package mx.com.totalplay.smc.repositories;

import java.util.List;

import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClienteServicio;

/**
 * @author Luis Luna
 *
 */
public interface IClienteServiciosRepository extends IGenericRepository<TbClienteServicio, Integer> {
	
	List<TbClienteServicio> findByTbCliente(TbCliente tbCliente);

}
