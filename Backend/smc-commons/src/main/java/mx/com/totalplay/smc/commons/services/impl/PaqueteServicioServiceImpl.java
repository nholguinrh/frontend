package mx.com.totalplay.smc.commons.services.impl;

import mx.com.totalplay.smc.commons.services.IPaqueteServicioService;
import mx.com.totalplay.smc.entities.TbCatPaquete;
import mx.com.totalplay.smc.entities.TbPaqueteServicio;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IPaqueteServicioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaqueteServicioServiceImpl extends GenericServiceImpl<TbPaqueteServicio, Integer> implements IPaqueteServicioService {

    @Autowired
    private IPaqueteServicioRepository repository;

    private static final Integer PAQUETE_ACTIVO = 16;
    private static final Integer PAQUETE_INACTIVO = 17;

    @Override
    protected IGenericRepository<TbPaqueteServicio, Integer> getRepo() {
        return repository;
    }

    @Override
    public List<TbPaqueteServicio> findPaqueteServicioByIdCatPaquete(Integer idCatPaquete) {
        return repository.findAllByTbCatPaquete(TbCatPaquete.builder()
                .idCatPaquete(idCatPaquete).
                build());
    }

    @Override
    public List<TbPaqueteServicio> findPaqueteServicioByIdCatPaqueteAndIdUsuario(Integer idCatPaquete, Integer idUsuario) {
        return repository.findAllByTbCatPaqueteAndCreadoPor(TbCatPaquete.builder()
                        .idCatPaquete(idCatPaquete)
                        .build(),
                TbUsuario.builder()
                        .idUsuario(idUsuario)
                        .build());
    }

    @Override
    public List<TbPaqueteServicio> saveAllPaqueteServicio(List<TbPaqueteServicio> paqueteServicios) {
        if (paqueteServicios.isEmpty()) {
            return null;
        }
        return repository.saveAll(paqueteServicios);
    }

    @Override
    public void deleteListPaqueteServicio(List<TbPaqueteServicio> paqueteServicios) {
        repository.deleteAll(paqueteServicios);
    }


}
