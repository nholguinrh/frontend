package mx.com.totalplay.smc.repositories;

import java.time.LocalDateTime;
import java.util.List;

import mx.com.totalplay.smc.entities.TbVClientesTotalEquipo;

public interface IVClientesTotalEquipoRepository extends IGenericRepository<TbVClientesTotalEquipo, Long> {

	List<TbVClientesTotalEquipo> findByIdEmpresaAndFechaTotalEquiposAndIdTipoDispositivo(String idEmpresa, LocalDateTime fechaTotalEquipos, long idTipoDispositivo);

}
