package mx.com.totalplay.smc.repositories;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import org.springframework.beans.factory.annotation.Autowired;

public class IClientePuntaRepositoryCustomImpl implements IClientePuntaRepositoryCustom{
	
	@Autowired
	EntityManager entityManager;

	@SuppressWarnings("unchecked")
	@Override
	public List<Long> filtrar(String queryStr) {
		List<Long> puntas = new ArrayList<>();
		Query query = entityManager.createNativeQuery(queryStr);
		List<BigInteger> list = query.getResultList();
		for(BigInteger obj : list)
			puntas.add(obj.longValue());
		return puntas;
	}

}
