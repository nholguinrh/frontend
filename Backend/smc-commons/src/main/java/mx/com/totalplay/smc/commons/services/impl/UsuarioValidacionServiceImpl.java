package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IUsuarioValidacionService;
import mx.com.totalplay.smc.entities.TbUsuarioValidacion;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IUsuarioValidacionRepository;

@Service
public class UsuarioValidacionServiceImpl extends GenericServiceImpl<TbUsuarioValidacion, Long> implements IUsuarioValidacionService{

	@Autowired
	private IUsuarioValidacionRepository repo;
	
	@Override
	protected IGenericRepository<TbUsuarioValidacion, Long> getRepo() {
		return repo;
	}
}
