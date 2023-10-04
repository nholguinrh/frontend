package mx.com.totalplay.smc.commons.services;

import java.util.List;

import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.entities.TbClienteConfiguracion;

public interface IClienteConfiguracionService extends IGenericService<TbClienteConfiguracion, Long> {

	/**
	 * Obtener clienteConfiguracion por idCliente
	 * 
	 * @param idCliente
	 * @return
	 * @throws ApiException
	 */
	List<TbClienteConfiguracion> obtenerClienteConfiguracion(Long idCliente) throws ApiException;

	/**
	 * Permite crear un clienteConfiguracion
	 * 
	 * @param request        ClienteConfiguracion del SMC
	 * @return
	 */
	TbClienteConfiguracion registrarClienteConfiguracion(TbClienteConfiguracion request);
	
	/**
	 * Permite actualizar un clienteConfiguracion
	 * 
	 * @param request        ClienteConfiguracion del SMC
	 * @return
	 */
	TbClienteConfiguracion actualizarClienteConfiguracion(TbClienteConfiguracion request);
		
}
