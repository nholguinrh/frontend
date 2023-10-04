package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IClienteTicketService;
import mx.com.totalplay.smc.entities.TbClienteTicket;
import mx.com.totalplay.smc.repositories.IClienteTicketRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

@Service
public class ClienteTicketServiceImpl extends GenericServiceImpl<TbClienteTicket, Long> implements IClienteTicketService {

	@Autowired
	private IClienteTicketRepository clienteTicketRepository;
	
	@Override
	protected IGenericRepository<TbClienteTicket, Long> getRepo() {		
		return this.clienteTicketRepository;
	}

	

}
