package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbCatPerfil;
import mx.com.totalplay.smc.entities.TbUsuario;

public interface IUsuarioRepository extends IGenericRepository<TbUsuario, Integer> {

	TbUsuario findByEmail(String email);
	
	TbUsuario findByCodigoVerificacion(String codigoVerificacion);
	
	@Query(value = "SELECT Count(*) FROM SMCv2.Usuarios usr, SMCv2.CatPerfiles per "
			+ "WHERE usr.idCatEstatus =:idCatEstatus "
			+ "AND per.tipo =:tipo AND usr.idCatPerfiles = per.idCatPerfiles", nativeQuery = true)
	Integer contarUsuarios(@Param("idCatEstatus") Integer idCatEstatus,
			@Param("tipo") String tipo);
	
	@Query(value = "FROM TbUsuario usr "			
			+ "WHERE usr.tbCatPerfil.tipo='admin' AND "
			+ " usr.tbCatEstatus.idCatEstatus != 2 AND "
			+ "(usr.nombreCompleto LIKE %:filtro% OR usr.email LIKE %:filtro%)" 
			)
	Page<TbUsuario> listarUsuariosAdminPorFiltroNombresOEmail(@Param("filtro") String filtro,
			Pageable pageable);
	
	Page<TbUsuario> findByTbCatEstatusAndTbCatPerfilIn(TbCatEstatus tbCatEstatus,
			List<TbCatPerfil> tbCatPerfil, Pageable pageable);
	
	Page<TbUsuario> findByTbCatPerfilIn(List<TbCatPerfil> tbCatPerfil, Pageable pageable);
	
	List<TbUsuario> findByTbCatEstatusAndTbCatPerfilIn(TbCatEstatus tbCatEstatus, List<TbCatPerfil> tbCatPerfil);

	Page<TbUsuario> findByTbCatPerfilInAndTbCatEstatusNot(List<TbCatPerfil> perfil, TbCatEstatus estatus,
			Pageable pageable);
		
	@Query(value = "SELECT COUNT(*) FROM Usuarios u WHERE u.idUsuarios IN "
			+ "(SELECT cu.idUsuarios FROM ClienteUsuarios cu WHERE cu.idClientes =:idCliente)", nativeQuery = true)
			//+ " AND u.idCatEstatus !=2 ", 
    int countUsuariosCliente(@Param("idCliente") Long idCliente);
}