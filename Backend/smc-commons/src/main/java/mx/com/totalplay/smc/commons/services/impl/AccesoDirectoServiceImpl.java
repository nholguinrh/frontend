package mx.com.totalplay.smc.commons.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IAccesoDirectoService;
import mx.com.totalplay.smc.entities.TbCatAccesoDirecto;
import mx.com.totalplay.smc.repositories.ICatAccesoDirectoRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

@Service
public class AccesoDirectoServiceImpl extends GenericServiceImpl<TbCatAccesoDirecto, Long>
		implements IAccesoDirectoService {

	@Autowired
	private ICatAccesoDirectoRepository repo;

	@Override
	protected IGenericRepository<TbCatAccesoDirecto, Long> getRepo() {
		return repo;
	}

	@Override
	public List<TbCatAccesoDirecto> listarPorTipoAcceso(String tipoAcceso) {
		return this.repo.findByTipoAcceso(tipoAcceso);
	}

}
