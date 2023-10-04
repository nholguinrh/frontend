package mx.com.totalplay.smc.commons.services.impl;

import mx.com.totalplay.smc.commons.services.IPaqueteDashboardService;
import mx.com.totalplay.smc.entities.TbCatPaquete;
import mx.com.totalplay.smc.entities.TbPaqueteDashboard;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IPaqueteDashboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class PaqueteDashboardServiceImpl extends GenericServiceImpl<TbPaqueteDashboard, Integer> implements IPaqueteDashboardService {

    @Autowired
    private IPaqueteDashboardRepository repository;

    @Override
    protected IGenericRepository<TbPaqueteDashboard, Integer> getRepo() {
        return repository;
    }

    private static final Integer DASHBOARD_ACTIVO = 7;
    private static final Integer DASHBOARD_INACTIVO = 8;
    private static final Integer DASHBOARD_PENDIENTE = 9;

    @Override
    public List<TbPaqueteDashboard> findPaqueteDashboardByIdCatPaquete(Integer idCatPaquete) {
        return filtraActivo(repository.findAllByTbCatPaquete(TbCatPaquete.builder()
                .idCatPaquete(idCatPaquete)
                .build()));
    }

    @Override
    public List<TbPaqueteDashboard> findPaqueteDashboardByIdCatPaqueteAndIdUsuario(Integer idCatPaquete, Integer idUsuario) {
        return filtraActivo(repository.findAllByTbCatPaqueteAndCreadoPor(TbCatPaquete.builder()
                        .idCatPaquete(idCatPaquete)
                        .build(),
                TbUsuario.builder()
                        .idUsuario(idUsuario)
                        .build()));
    }

    @Override
    public List<TbPaqueteDashboard> saveAllDashboards(List<TbPaqueteDashboard> paqueteDashboards) {
        if (paqueteDashboards.isEmpty()) {
            return null;
        }
        return repository.saveAll(paqueteDashboards);
    }

    @Override
    public void deleteAllPaqueteDashboard(List<TbPaqueteDashboard> paqueteDashboards) {
        repository.deleteAll(paqueteDashboards);
    }

    private List<TbPaqueteDashboard> filtraActivo(List<TbPaqueteDashboard> paqueteDashboards) {
        return paqueteDashboards.stream()
                .filter(pd -> Objects.equals(pd.getTbDashboard().getTbCatEstatus().getIdCatEstatus(), DASHBOARD_ACTIVO))
                .collect(Collectors.toList());
    }


}
