package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IOrigenNombreService;
import mx.com.totalplay.smc.entities.TbCatOrigenNombre;
import mx.com.totalplay.smc.repositories.ICatOrigenNombreRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;
@Service
public class OrigenNombreServiceImpl extends GenericServiceImpl<TbCatOrigenNombre, Integer>
		implements IOrigenNombreService {

	@Autowired
	private ICatOrigenNombreRepository origenNombreRepository;

	@Override
	protected IGenericRepository<TbCatOrigenNombre, Integer> getRepo() {
		return origenNombreRepository;
	}
}
