package mx.com.totalplay.smc.repositories;

import java.util.List;

import mx.com.totalplay.smc.entities.TbMetricaDispositivo;

public interface IMetricaDispositivoRepository extends IGenericRepository<TbMetricaDispositivo, Integer> {

	List<TbMetricaDispositivo> findByTipoDispositivoAndAplica(String tipoDispositivo, Boolean aplica);

}
