package mx.com.totalplay.smc.commons.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IPerfilService;
import mx.com.totalplay.smc.entities.TbCatPerfil;
import mx.com.totalplay.smc.repositories.ICatPerfilRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

@Service
public class PerfilServiceImpl extends GenericServiceImpl<TbCatPerfil, Integer> implements IPerfilService {

	@Autowired
	private ICatPerfilRepository perfilRepository;

	@Override
	protected IGenericRepository<TbCatPerfil, Integer> getRepo() {
		return perfilRepository;
	}

	@Override
	public List<TbCatPerfil> listarPorTipo(String tipo) {
		return perfilRepository.findByTipo(tipo);
	}

}
