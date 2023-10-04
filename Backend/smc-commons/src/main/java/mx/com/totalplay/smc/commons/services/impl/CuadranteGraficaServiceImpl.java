package mx.com.totalplay.smc.commons.services.impl;

import mx.com.totalplay.smc.commons.services.ICuadranteGraficaService;
import mx.com.totalplay.smc.entities.TbCuadranteGrafica;
import mx.com.totalplay.smc.repositories.ICuadranteGraficaRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import org.springframework.beans.factory.annotation.Autowired;

public class CuadranteGraficaServiceImpl extends GenericServiceImpl<TbCuadranteGrafica, Integer> implements ICuadranteGraficaService {

    @Autowired
    private ICuadranteGraficaRepository repo;

    @Override
    protected IGenericRepository<TbCuadranteGrafica, Integer> getRepo() {
        return repo;
    }
}
