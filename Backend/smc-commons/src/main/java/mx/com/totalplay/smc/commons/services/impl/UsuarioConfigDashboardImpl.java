package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import mx.com.totalplay.smc.commons.services.IUsuarioConfigDashboardService;
import mx.com.totalplay.smc.entities.TbUsuarioConfiguracionDashboard;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IUsuarioConfigDashboardRepository;

@Service
public class UsuarioConfigDashboardImpl extends GenericServiceImpl<TbUsuarioConfiguracionDashboard, Long> 
	implements IUsuarioConfigDashboardService{
	
	@Autowired
	private IUsuarioConfigDashboardRepository repo;
	
	@Override
	protected IGenericRepository<TbUsuarioConfiguracionDashboard, Long> getRepo() {
		return repo;
	}

}
