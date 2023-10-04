package mx.com.totalplay.smc.repositories;

import java.util.List;

import mx.com.totalplay.smc.entities.TbCatEstatus;

/**
 * 
 * U Usuario. N Notificaciones. V Validacion. D Dashboard. M Metricas. P Puntas.
 * I Interfaz. S SLA. N Notificacione.
 *
 */
public interface ICatEstatusRepository extends IGenericRepository<TbCatEstatus, Integer> {

	List<TbCatEstatus> findByTipoEstatus(String tipo);
	
	TbCatEstatus findByDescripcionAndTipoEstatus(String descripcion, String tipo);

}
