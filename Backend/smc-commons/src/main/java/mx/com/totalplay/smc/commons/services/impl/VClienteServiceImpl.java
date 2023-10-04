package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IVClienteService;
import mx.com.totalplay.smc.entities.TbVClientes;
import mx.com.totalplay.smc.entities.VClientesId;
import mx.com.totalplay.smc.repositories.IVClienteRepository;

@Service
public class VClienteServiceImpl implements IVClienteService {

	@Autowired
	private IVClienteRepository repo;

	@Override
	public void guardarCliente(Long idCliente, String idEmpresa) {
		repo.save(TbVClientes.builder()
				.idClientes(idCliente)
				.idEmpresa(idEmpresa)
				.build());
	}

	@Override
	public TbVClientes obtenerPorId(Long idCliente, String idEmpresa) {
		return repo.findById(VClientesId.builder().idClientes(idCliente).idEmpresa(idEmpresa).build()).orElse(null);
	}
	
	
	
	
}
