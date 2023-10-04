/**
 * 
 */
package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IProcesoService;
import mx.com.totalplay.smc.entities.TbCatProceso;
import mx.com.totalplay.smc.repositories.ICatProcesoRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

/**
 * @author jacob
 *
 */

@Service
public class ProcesoServiceImpl extends GenericServiceImpl<TbCatProceso, Integer> 
implements IProcesoService {
	
	@Autowired
	private ICatProcesoRepository repo;

	@Override
	protected IGenericRepository<TbCatProceso, Integer> getRepo() {
		return repo;
	}
}
