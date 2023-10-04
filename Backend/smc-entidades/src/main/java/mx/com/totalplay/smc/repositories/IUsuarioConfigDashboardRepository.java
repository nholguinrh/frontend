package mx.com.totalplay.smc.repositories;

import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.entities.TbUsuarioConfiguracionDashboard;

public interface IUsuarioConfigDashboardRepository extends IGenericRepository<TbUsuarioConfiguracionDashboard, Long> {
	
	TbUsuarioConfiguracionDashboard findByTbUsuario(TbUsuario tbUsuario);

}
