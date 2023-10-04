/**
 *
 */
package mx.com.totalplay.smc.commons.services.impl;

import mx.com.totalplay.smc.commons.services.IPaqueteService;
import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbCatPaquete;
import mx.com.totalplay.smc.entities.TbUsuario;
import mx.com.totalplay.smc.repositories.ICatPaquetesRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author Luis Luna
 */

@Service
public class PaqueteServiceImpl extends GenericServiceImpl<TbCatPaquete, Integer>
        implements IPaqueteService {

    @Autowired
    private ICatPaquetesRepository repository;

    @Override
    protected IGenericRepository<TbCatPaquete, Integer> getRepo() {
        return this.repository;
    }


    @Override
    public TbCatPaquete findByIdPaqueteAndIdUsuario(Integer idCatPaquete, Integer idUsuario) {
        return repository.findByIdCatPaqueteAndCreadoPor(idCatPaquete,
                TbUsuario.builder()
                        .idUsuario(idUsuario)
                        .build());
    }

    @Override
    public List<TbCatPaquete> findAllByIdUsuario(Integer idUsuario) {
        return repository.findAllByCreadoPor(
                TbUsuario.builder()
                        .idUsuario(idUsuario)
                        .build()
        );
    }


	@Override
	public List<TbCatPaquete> findAllByTbCatEstatus(TbCatEstatus estatus) {
		return repository.findAllByTbCatEstatus(estatus);
	}


	@Override
	public List<TbCatPaquete> findByIdCatPaqueteActivosAsociados() {
		return repository.findByIdCatPaqueteActivosAsociados();
	}

}
