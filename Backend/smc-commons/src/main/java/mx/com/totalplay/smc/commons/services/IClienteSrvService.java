package mx.com.totalplay.smc.commons.services;

import java.util.List;

import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClienteServicio;

public interface IClienteSrvService extends IGenericService<TbClienteServicio, Integer> {
	
	public TbClienteServicio save(TbClienteServicio tbClienteServicio);
	
	public void delete(TbClienteServicio tbClienteServicio);
	
	public List<TbClienteServicio> obtenerservicios(Long idCliente);
	
	public List<TbClienteServicio> findByTbCliente(TbCliente tbCliente);
		
}
