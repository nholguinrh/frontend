/**
 * 
 */
package mx.com.totalplay.smc.commons.services.impl;

import java.util.List;

import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.services.IGenericService;
import mx.com.totalplay.smc.repositories.IGenericRepository;

public abstract class GenericServiceImpl<T, ID> implements IGenericService<T, ID> {

	protected abstract IGenericRepository<T, ID> getRepo();

	public T registrar(T obj) throws ApiException {
		return getRepo().save(obj);
	}

	public T modificar(T obj) throws ApiException {
		return getRepo().save(obj);
	}

	public List<T> listar() throws ApiException {
		return getRepo().findAll();
	}

	public T listarPorId(ID id) throws ApiException {
		return getRepo().findById(id).orElse(null);
	}

	public void eliminar(ID id) throws ApiException {
		getRepo().deleteById(id);
	}

}
