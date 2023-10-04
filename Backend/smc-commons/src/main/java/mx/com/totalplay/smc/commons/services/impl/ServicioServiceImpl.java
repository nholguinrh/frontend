package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IServicioService;
import mx.com.totalplay.smc.entities.TbCatServicio;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IServicioRepository;

@Service
public class ServicioServiceImpl extends GenericServiceImpl<TbCatServicio, Integer> implements IServicioService {

	@Autowired
	private IServicioRepository servicioRepository;
	
	@Override
	protected IGenericRepository<TbCatServicio, Integer> getRepo(){
		return servicioRepository;
	}
}
