/**
 * 
 */
package mx.com.totalplay.smc.repositories;

import mx.com.totalplay.smc.entities.TbDashboard;

/**
 * @author Luis Luna
 *
 */
public interface IDashboardRepository extends IGenericRepository<TbDashboard, Integer> {

	TbDashboard findByDescripcion(String descripcion);

}
