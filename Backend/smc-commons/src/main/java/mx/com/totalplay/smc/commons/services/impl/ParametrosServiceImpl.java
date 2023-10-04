package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IParametrosService;
import mx.com.totalplay.smc.entities.TbParametros;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IParametrosRepository;

@Service
public class ParametrosServiceImpl extends GenericServiceImpl<TbParametros, String> implements IParametrosService {

	@Autowired
	private IParametrosRepository repo;

	@Override
	protected IGenericRepository<TbParametros, String> getRepo() {
		return repo;
	}

	@Override
	public TbParametros buscarPorId(String identificador) {
		return repo.findById(identificador).orElse(null);
	}

}
