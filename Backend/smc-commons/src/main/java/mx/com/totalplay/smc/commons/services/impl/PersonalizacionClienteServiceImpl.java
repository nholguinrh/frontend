package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IPersonalizacionClienteService;
import mx.com.totalplay.smc.entities.TbPersonalizacionClientes;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IPersonalizacionClientesRepository;

@Service
public class PersonalizacionClienteServiceImpl extends GenericServiceImpl<TbPersonalizacionClientes, Long>
		implements IPersonalizacionClienteService {

	@Autowired
	private IPersonalizacionClientesRepository repo;

	@Override
	protected IGenericRepository<TbPersonalizacionClientes, Long> getRepo() {
		return repo;
	}

	@Override
	public TbPersonalizacionClientes obtenerTicketPersonalizado(String clienteTotalPlay, String folioTicket) {
		return repo.findByIdClienteTotalPlayAndFolioTicket(clienteTotalPlay, folioTicket);
	}

	@Override
	public TbPersonalizacionClientes obtenerDispositivoPersonalizado(String clienteTotalPlay, String idDispositivo) {
		return repo.obtenerDispositivo(clienteTotalPlay, idDispositivo);
	}

}
