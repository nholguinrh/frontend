 package mx.com.totalplay.smc.commons.services.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.extern.slf4j.Slf4j;
import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.services.IClienteConfiguracionService;
import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClienteConfiguracion;
import mx.com.totalplay.smc.repositories.IClienteConfiguracionRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

@Slf4j
@Service
public class ClienteConfiguracionServiceImpl extends GenericServiceImpl<TbClienteConfiguracion, Long> implements IClienteConfiguracionService {
	
	@Autowired
	private IClienteConfiguracionRepository repo;
	
	@Override
	protected IGenericRepository<TbClienteConfiguracion, Long> getRepo() {
		return repo;
	}
	
	@Override
	public List<TbClienteConfiguracion> obtenerClienteConfiguracion(Long idCliente) throws ApiException {
		log.info("ClienteConfiguracionServiceImpl->obtenerClienteConfiguracion->{}", idCliente);
		return repo.findByTbCliente(TbCliente.builder().idCliente(idCliente).build());
	}
	

	@Transactional
	@Override
	public TbClienteConfiguracion registrarClienteConfiguracion(TbClienteConfiguracion request) {
		log.debug("Se registra clienteConfiguracion");
		return repo.save(request);
	}

	@Transactional
	@Override
	public TbClienteConfiguracion actualizarClienteConfiguracion(TbClienteConfiguracion request) {
		log.debug("Se actualiza clienteConfiguracion");
		return repo.save(request);
	}

}
