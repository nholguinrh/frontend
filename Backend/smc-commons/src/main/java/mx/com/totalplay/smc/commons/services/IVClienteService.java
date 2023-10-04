package mx.com.totalplay.smc.commons.services;

import mx.com.totalplay.smc.entities.TbVClientes;

public interface IVClienteService {

	void guardarCliente(Long idCliente, String idEmpresa);
	
	TbVClientes obtenerPorId(Long idCliente, String idEmpresa);

}
