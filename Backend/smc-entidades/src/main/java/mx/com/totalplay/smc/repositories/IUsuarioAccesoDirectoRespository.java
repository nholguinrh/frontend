package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import mx.com.totalplay.smc.entities.TbUsuarioAccesoDirecto;

public interface IUsuarioAccesoDirectoRespository extends IGenericRepository<TbUsuarioAccesoDirecto, Long> {

	@Transactional
	@Modifying
	@Query("DELETE FROM TbUsuarioAccesoDirecto tuad WHERE tuad.paraUsuario.idUsuario =:idUsuario")
	void eliminarAccesosPorUsuario(@Param("idUsuario") Integer idUsuario);

	List<TbUsuarioAccesoDirecto> findByParaUsuarioIdUsuario(Integer idUsuario);

	List<TbUsuarioAccesoDirecto> findByParaUsuarioIdUsuarioAndAccesoDirectoTipoAcceso(Integer idUsuario,
			String tipoAcceso);

	void deleteByParaUsuarioIdUsuarioAndAccesoDirectoIdCatAccesoDirecto(Integer idUsuario, Long idAcceso);
}
