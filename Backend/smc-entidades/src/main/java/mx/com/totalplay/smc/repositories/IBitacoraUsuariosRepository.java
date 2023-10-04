package mx.com.totalplay.smc.repositories;

import java.time.LocalDateTime;
import java.util.List;

import mx.com.totalplay.smc.entities.TbBitacoraUsuarios;

public interface IBitacoraUsuariosRepository extends IGenericRepository<TbBitacoraUsuarios, Long> {

	List<TbBitacoraUsuarios> findByFechaCreacionBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);
	
	List<TbBitacoraUsuarios> findByFechaCreacionBetween(String fechaInicio, String fechaFin);

}
