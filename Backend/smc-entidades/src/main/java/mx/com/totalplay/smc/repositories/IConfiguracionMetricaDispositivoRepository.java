package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import mx.com.totalplay.smc.entities.TbConfiguracionMetricasDispositivo;

public interface IConfiguracionMetricaDispositivoRepository extends JpaRepository<TbConfiguracionMetricasDispositivo, Long> {
	
	List<TbConfiguracionMetricasDispositivo> findByTbTipoDispositivoCveTipoDispositivo(String tipoDispositivo);

}
