/**
 * 
 */
package mx.com.totalplay.smc.commons.services.impl;


import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.model.MetricaDispositivoDto;
import mx.com.totalplay.smc.commons.model.MetricaDto;
import mx.com.totalplay.smc.commons.services.IMetricaService;
import mx.com.totalplay.smc.entities.TbConfiguracionMetricasDispositivo;
import mx.com.totalplay.smc.entities.TbMetrica;
import mx.com.totalplay.smc.entities.TbMetricaDispositivo;
import mx.com.totalplay.smc.repositories.IClientePuntaRepository;
import mx.com.totalplay.smc.repositories.IConfiguracionMetricaDispositivoRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IMetricaDispositivoRepository;
import mx.com.totalplay.smc.repositories.IMetricaRepository;

/**
 * @author Luis Luna
 *
 */

@Service
public class MetricaServiceImpl extends GenericServiceImpl<TbMetrica, Integer> 
	implements IMetricaService {
	
	private ModelMapper modelMapper = new ModelMapper();
	
	@Autowired
	private IMetricaRepository metricaRepository;
	@Autowired
	private IConfiguracionMetricaDispositivoRepository iConfMetricaDispRepository;
	@Autowired 
	private IMetricaDispositivoRepository metricaDispositivoRepository;
	@Autowired
	private IClientePuntaRepository iClientePuntaRepository;
	
	@Override
	protected IGenericRepository<TbMetrica, Integer> getRepo() {
		return this.metricaRepository;
	}


	@Override
	public List<MetricaDispositivoDto> listarTodos() {
		List<TbMetricaDispositivo> entities = metricaDispositivoRepository.findAll();
		List<MetricaDispositivoDto> result = new ArrayList<>();
		for(TbMetricaDispositivo entity: entities) {
			result.add(modelMapper.map(entity, MetricaDispositivoDto.class));
		}
		return result;
	}


	@Override
	public List<MetricaDispositivoDto> filtrarPorTipoDispositivo(String tipoDispositivo) {
		List<TbMetricaDispositivo> entities = metricaDispositivoRepository.findByTipoDispositivoAndAplica(tipoDispositivo, true);
		List<MetricaDispositivoDto> result = new ArrayList<>();
		for(TbMetricaDispositivo entity: entities) {
			result.add(modelMapper.map(entity, MetricaDispositivoDto.class));
		}
		return result;
	}


	@Override
	public List<MetricaDto> filtrarMetricasPorCliente(Long idCliente) {
		List<MetricaDto> result = new ArrayList<>();
		List<TbConfiguracionMetricasDispositivo> metricas = new ArrayList<>();
		List<String> metricasList = iClientePuntaRepository.distinctTipoPuntaByIdCliente(idCliente);
		for(String m : metricasList) {
			List<TbConfiguracionMetricasDispositivo> metricasTemp = obtenerMetricasPorTipoDispositivo(m);
			if(metricas.size()==0 || (metricas.size() > metricasTemp.size()))
				metricas = metricasTemp;
		}
		for(TbConfiguracionMetricasDispositivo tm : metricas) {
			MetricaDto mdto = modelMapper.map(tm.getTbMetrica(), MetricaDto.class);
			mdto.setMetricaDefault(tm.isMetricaDefault());
			result.add(mdto);
		}
		return result;
	}
	
	@Override
	public List<MetricaDto> findByTipoMetrica(String tipoMetrica) {
		List<TbMetrica> entities = metricaRepository.findByTipoMetrica(tipoMetrica);
		List<MetricaDto> result = new ArrayList<>();
		for(TbMetrica entity: entities) {
			result.add(modelMapper.map(entity, MetricaDto.class));
		}
		return result;
	}

	@Override
	public List<TbConfiguracionMetricasDispositivo> obtenerMetricasPorTipoDispositivo(String tipoDispositivo) {
		return iConfMetricaDispRepository.findByTbTipoDispositivoCveTipoDispositivo(tipoDispositivo);
	}

}
