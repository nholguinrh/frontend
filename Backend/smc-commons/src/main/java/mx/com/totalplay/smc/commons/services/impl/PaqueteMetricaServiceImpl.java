package mx.com.totalplay.smc.commons.services.impl;

import mx.com.totalplay.smc.commons.services.IPaqueteMetricaService;
import mx.com.totalplay.smc.entities.TbCatPaquete;
import mx.com.totalplay.smc.entities.TbPaqueteMetrica;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IPaqueteMetricaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PaqueteMetricaServiceImpl extends GenericServiceImpl<TbPaqueteMetrica, Integer> implements IPaqueteMetricaService {

    @Autowired
    private IPaqueteMetricaRepository repository;

    private static final Integer METRICA_ACTIVO = 10;
    private static final Integer METRICA_INACTIVO = 11;
    private static final Integer METRICA_PENDIENTE = 12;

    @Override
    protected IGenericRepository<TbPaqueteMetrica, Integer> getRepo() {
        return repository;
    }

    @Override
    public List<TbPaqueteMetrica> findPaqueteMetricaByIdCatPaquete(Integer idCatPaquete) {
        return filtraActivo(repository.findAllByTbCatPaquete(TbCatPaquete.builder()
                .idCatPaquete(idCatPaquete)
                .build()));
    }

    @Override
    public List<TbPaqueteMetrica> findPaqueteMetricaByIdCatPaqueteAndIdUsuario(Integer idCatPaquete, Integer idUsuario) {
        return filtraActivo(repository.findAllByTbCatPaqueteAndCreadoPor(TbCatPaquete.builder()
                        .idCatPaquete(idCatPaquete)
                        .build(),
                TbUsuario.builder()
                        .idUsuario(idUsuario)
                        .build()));
    }

    @Override
    public List<TbPaqueteMetrica> saveAllMetricas(List<TbPaqueteMetrica> paqueteMetricas) {
        if (paqueteMetricas.isEmpty()) {
            return null;
        }
        return repository.saveAll(paqueteMetricas);
    }

    @Override
    public void deleteAllPaquetemetrica(List<TbPaqueteMetrica> paqueteMetricas) {
        repository.deleteAll(paqueteMetricas);
    }

    private List<TbPaqueteMetrica> filtraActivo(List<TbPaqueteMetrica> paqueteMetricas) {
        return paqueteMetricas.stream()
                .filter(pm -> Objects.equals(pm.getTbMetrica().getTbCatEstatus().getIdCatEstatus(), METRICA_ACTIVO))
                .collect(Collectors.toList());
    }


}
