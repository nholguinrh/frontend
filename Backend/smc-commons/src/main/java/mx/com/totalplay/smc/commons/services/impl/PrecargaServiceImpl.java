/**
 * 
 */
package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.IPrecargaService;
import mx.com.totalplay.smc.entities.TbPrecarga;
import mx.com.totalplay.smc.repositories.IGenericRepository;
import mx.com.totalplay.smc.repositories.IPrecargaRepository;

/**
 * @author jacob
 *
 */

@Service
public class PrecargaServiceImpl extends GenericServiceImpl<TbPrecarga, Long> implements IPrecargaService {

	

	@Autowired
	private IPrecargaRepository repo;
	
	@Override
	protected IGenericRepository<TbPrecarga, Long> getRepo() {
		return repo;
	}

	@Override
	public TbPrecarga findByIdCliente(Long idCliente) {
		return repo.findByIdCliente(idCliente);
	}

}