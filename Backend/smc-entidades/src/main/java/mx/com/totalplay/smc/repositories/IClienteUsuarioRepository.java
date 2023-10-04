package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbClienteUsuarios;
import mx.com.totalplay.smc.entities.TbUsuario;

public interface IClienteUsuarioRepository extends IGenericRepository<TbClienteUsuarios, Long> {

	@Query(value = "SELECT usrcte.tbUsuario FROM TbClienteUsuarios usrcte WHERE usrcte.tbCliente.idCliente =:idCliente")
	List<TbUsuario> listarUsuariosPorCliente(@Param("idCliente") Long idCliente);
	
	@Query(value = "SELECT usrcte.tbUsuario FROM TbClienteUsuarios usrcte WHERE usrcte.tbCliente.idCliente =:idCliente")
	Page<TbUsuario> listarUsuariosPorCliente(@Param("idCliente") Long idCliente, Pageable page);
	
	@Query(value = "SELECT usrcte.tbUsuario FROM TbClienteUsuarios usrcte WHERE usrcte.tbCliente.idCliente =:idCliente and usrcte.tbUsuario.tbCatEstatus.descripcion != 'Inactivo'")
	Page<TbUsuario> listarUsuariosPorClienteActivo(@Param("idCliente") Long idCliente, Pageable page);
	
	@Query(value = "SELECT usrcte.tbUsuario FROM TbClienteUsuarios usrcte WHERE usrcte.tbCliente.idCliente =:idCliente AND (usrcte.tbUsuario.nombreCompleto LIKE %:cadena% OR usrcte.tbUsuario.email LIKE %:cadena%)")
	Page<TbUsuario> listarUsuariosPorCadena(@Param("idCliente") Long idCliente,@Param("cadena") String cadena,  Pageable page);
		
	List<TbUsuario> findByTbCliente(TbCliente cliente);

	@Transactional
	@Modifying
	@Query("DELETE FROM TbClienteUsuarios tcu WHERE tcu.tbUsuario.idUsuario =:idUsuario")
	void eliminarUsuario(@Param("idUsuario") Integer idUsuario);
	
	@Transactional
	@Modifying
	@Query("UPDATE TbUsuario tu SET tu.tbCatEstatus.idCatEstatus = 2 WHERE tu.idUsuario =:idUsuario")
	void borradoLogico(@Param("idUsuario") Integer idUsuario);

	TbClienteUsuarios findByTbUsuarioAndTbCliente(TbUsuario usr, TbCliente tbCliente);

	TbClienteUsuarios findByTbUsuario(TbUsuario tbUsuario);

	@Query(value = "SELECT usrcte.tbUsuario FROM TbClienteUsuarios usrcte WHERE usrcte.tbCliente.idCliente =:idCliente and usrcte.tbUsuario.tbCatEstatus.descripcion='Activo'")
	List<TbUsuario> listarUsuariosActivosPorCliente(@Param("idCliente") Long idCliente);
	
	@Query(value = "SELECT usrcte.tbUsuario FROM TbClienteUsuarios usrcte WHERE usrcte.tbCliente.idCliente =:idCliente and usrcte.tbUsuario.tbCatEstatus.descripcion != 'Inactivo'")
	List<TbUsuario> listarUsuariosNoInActivosPorCliente(@Param("idCliente") Long idCliente);
	
}
