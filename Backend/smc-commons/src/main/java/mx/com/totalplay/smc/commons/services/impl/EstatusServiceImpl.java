package mx.com.totalplay.smc.commons.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.services.IEstatusService;
import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.repositories.ICatEstatusRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

@Service
public class EstatusServiceImpl extends GenericServiceImpl<TbCatEstatus, Integer> implements IEstatusService {

	@Autowired
	private ICatEstatusRepository repo;

	@Override
	protected IGenericRepository<TbCatEstatus, Integer> getRepo() {
		return repo;
	}

	@Override
	public List<TbCatEstatus> listarPorTipo(String tipo) throws ApiException {
		return repo.findByTipoEstatus(tipo);
	}

}
