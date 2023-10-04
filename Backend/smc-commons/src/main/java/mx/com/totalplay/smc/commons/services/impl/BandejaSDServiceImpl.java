/**
 * 
 */
package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IBandejaSDService;
import mx.com.totalplay.smc.entities.TbCatBandejaSD;
import mx.com.totalplay.smc.repositories.ICatBandejaSDRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

/**
 * @author Luis Luna
 *
 */

@Service
public class BandejaSDServiceImpl extends GenericServiceImpl<TbCatBandejaSD, Integer> 
	implements IBandejaSDService {

	@Autowired
	private ICatBandejaSDRepository bandejaSDRepository;
	
	@Override
	protected IGenericRepository<TbCatBandejaSD, Integer> getRepo() {
		return this.bandejaSDRepository;
	}

}
