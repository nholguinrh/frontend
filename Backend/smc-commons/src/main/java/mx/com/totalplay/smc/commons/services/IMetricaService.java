/**
 * 
 */
package mx.com.totalplay.smc.commons.services;

import java.util.List;

import mx.com.totalplay.smc.commons.model.MetricaDispositivoDto;
import mx.com.totalplay.smc.commons.model.MetricaDto;
import mx.com.totalplay.smc.entities.TbConfiguracionMetricasDispositivo;
import mx.com.totalplay.smc.entities.TbMetrica;

/**
 * @author Luis Luna
 *
 */
public interface IMetricaService extends IGenericService<TbMetrica, Integer> {

	List<MetricaDispositivoDto> listarTodos();

	List<MetricaDispositivoDto> filtrarPorTipoDispositivo(String tipoDispositivo);

	List<MetricaDto> filtrarMetricasPorCliente(Long idCliente);
	
	List<MetricaDto> findByTipoMetrica(String tipoMetrica);
	
	List<TbConfiguracionMetricasDispositivo> obtenerMetricasPorTipoDispositivo(String tipoDispositivo);
	
}
