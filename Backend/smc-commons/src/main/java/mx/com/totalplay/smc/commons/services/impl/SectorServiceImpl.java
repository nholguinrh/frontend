package mx.com.totalplay.smc.commons.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import mx.com.totalplay.smc.commons.services.ISectorService;
import mx.com.totalplay.smc.entities.TbCatSector;
import mx.com.totalplay.smc.repositories.ICatSectorRepository;
import mx.com.totalplay.smc.repositories.IGenericRepository;

@Service
public class SectorServiceImpl extends GenericServiceImpl<TbCatSector, Integer> implements ISectorService {

	@Autowired
	private ICatSectorRepository sectorRepository;

	@Override
	protected IGenericRepository<TbCatSector, Integer> getRepo() {
		return sectorRepository;
	}

}
