package mx.com.totalplay.smc.repositories;

import mx.com.totalplay.smc.entities.TbPrecarga;

public interface IPrecargaRepository extends IGenericRepository<TbPrecarga, Long> {

	TbPrecarga findByIdCliente(Long idCliente);
	
}