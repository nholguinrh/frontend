package mx.com.totalplay.smc.commons.services;

import java.util.List;

import mx.com.totalplay.smc.commons.exceptions.ApiException;

public interface IGenericService<T, ID> {

	/**
	 * 
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	T registrar(T obj) throws ApiException;

	/**
	 * 
	 * @param obj
	 * @return
	 * @throws Exception
	 */
	T modificar(T obj) throws ApiException;

	/**
	 * 
	 * @return
	 * @throws Exception
	 */
	List<T> listar() throws ApiException;

	/**
	 * 
	 * @param id
	 * @return
	 * @throws Exception
	 */
	T listarPorId(ID id) throws ApiException;

	/**
	 * 
	 * @param id
	 * @throws Exception
	 */
	void eliminar(ID id) throws ApiException;

}
