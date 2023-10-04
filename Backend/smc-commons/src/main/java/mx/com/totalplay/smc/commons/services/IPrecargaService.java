/**
 *
 */
package mx.com.totalplay.smc.commons.services;


import mx.com.totalplay.smc.entities.TbPrecarga;

public interface IPrecargaService extends IGenericService<TbPrecarga, Long> {

	TbPrecarga findByIdCliente(Long idCliente);

}
