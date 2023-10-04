/**
 * 
 */
package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.ITipoTicketService;
import mx.com.totalplay.smc.entities.TbCatTipoTicket;
import mx.com.totalplay.smc.repositories.ICatTipoTicketRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

/**
 * @author Luis Luna
 *
 */

@Service
public class TipoTicketServiceImpl extends GenericServiceImpl<TbCatTipoTicket, Integer>
	implements ITipoTicketService {
	
	@Autowired
	private ICatTipoTicketRepository tipoTicketRepository;

	@Override
	protected IGenericRepository<TbCatTipoTicket, Integer> getRepo() {
		return this.tipoTicketRepository;
	}

	

}
