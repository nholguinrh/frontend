/**
 * 
 */
package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import mx.com.totalplay.smc.commons.services.IDashboardService;
import mx.com.totalplay.smc.entities.TbDashboard;
import mx.com.totalplay.smc.repositories.IDashboardRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

/**
 * @author Luis Luna
 *
 */
@Service
public class DashboardServiceImpl extends GenericServiceImpl<TbDashboard, Integer> 
	implements IDashboardService {

	@Autowired
	private IDashboardRepository dashboardRepository;

	@Override
	protected IGenericRepository<TbDashboard, Integer> getRepo() {
		return this.dashboardRepository;
	}

}
