/**
 * 
 */
package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IHistoricoPerformanceService;
import mx.com.totalplay.smc.entities.TbCatHistoricoPerformance;
import mx.com.totalplay.smc.repositories.ICatHistoricoPerformanceRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

/**
 * @author jacob
 *
 */

@Service
public class HistoricoPerformanceServiceImpl extends GenericServiceImpl<TbCatHistoricoPerformance, Integer> 
	implements IHistoricoPerformanceService {

	@Autowired
	private ICatHistoricoPerformanceRepository repo;
	
	@Override
	protected IGenericRepository<TbCatHistoricoPerformance, Integer> getRepo() {
		return repo;
	}

}
