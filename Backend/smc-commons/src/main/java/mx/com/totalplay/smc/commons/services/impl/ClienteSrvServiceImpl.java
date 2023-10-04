 package mx.com.totalplay.smc.commons.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;
import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.services.IClienteSrvService;
import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClienteServicio;
import mx.com.totalplay.smc.repositories.IClienteServiciosRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

@Slf4j
@Service
public class ClienteSrvServiceImpl extends GenericServiceImpl<TbClienteServicio, Integer> implements IClienteSrvService {
	
	@Autowired
	private IClienteServiciosRepository repo;
	
	@Override
	protected IGenericRepository<TbClienteServicio, Integer> getRepo() {
		return repo;
	}
	
	@Override
	public TbClienteServicio save(TbClienteServicio tbClienteServicio) {
		return repo.save(tbClienteServicio);
	}
	
	@Override
	public void delete(TbClienteServicio tbClienteServicio) {
		repo.delete(tbClienteServicio);
	}
	
	@Override
	public List<TbClienteServicio> obtenerservicios(Long idCliente) throws ApiException {
		log.info("ClienteServiciosServiceImpl->obtenerservicios->{}", idCliente);
		return repo.findByTbCliente(TbCliente.builder().idCliente(idCliente).build());
	}
	
	@Override
	public List<TbClienteServicio> findByTbCliente(TbCliente tbCliente){
		return repo.findByTbCliente(tbCliente);
	}

}
