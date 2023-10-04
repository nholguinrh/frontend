package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.com.totalplay.smc.entities.TbCatEstatus;
import mx.com.totalplay.smc.entities.TbCliente;

public interface IClienteRepository extends IGenericRepository<TbCliente, Long> {
	
	TbCliente findByContrato (String contrato);
	
	TbCliente findByIdCliente (Long IdCliente);
	
	Page<TbCliente> findByTbCatEstatus(TbCatEstatus estatus, Pageable pageable);

	Page<TbCliente> findByRazonSocialLike(String cadena, Pageable pageable);
	
	List<TbCliente> findByEmailOrContrato(String email, String contrato);
	
	List<TbCliente> findByEmail(String email);

	List<TbCliente> findAllByTbCatEstatus(TbCatEstatus estatus);
	
	List<TbCliente> findByIdClienteTotalPlay(String idClienteTotalPlay);

	@Query(value = "SELECT * FROM Clientes "
			+ "WHERE idCatEstatus IN ( :estatus ) "
			+ " OR idCatPaquetes IN ( :paquetes )", nativeQuery = true )
	Page<TbCliente> findByIdEstatusInOrIdPaquetesIn
		(@Param("estatus") List<Integer> estatus, @Param("paquetes") List<Integer> paquetes, Pageable pageable);
	
	@Query(value = "SELECT * FROM Clientes "
			+ "WHERE idCatEstatus IN ( :estatus ) "
			+ " AND idCatPaquetes IN ( :paquetes )", nativeQuery = true )
	Page<TbCliente> findByIdEstatusInAndIdPaquetesIn
		(@Param("estatus") List<Integer> estatus, @Param("paquetes") List<Integer> paquetes, Pageable pageable);
	
	@Query(value = "SELECT * FROM Clientes "
			+ " WHERE indicadorFavorito = 1 "
			+ " AND (idCatEstatus IN ( :estatus ) OR  idCatPaquetes IN ( :paquetes )) ", nativeQuery = true )
	Page<TbCliente> findByIdEstatusInOrIdPaquetesInAndIndicadorFavorito
		(@Param("estatus") List<Integer> estatus, @Param("paquetes") List<Integer> paquetes, Pageable pageable);
	
	@Query(value = "SELECT * FROM Clientes "
			+ " WHERE indicadorFavorito = 1 "
			+ " AND (idCatEstatus IN ( :estatus ) AND  idCatPaquetes IN ( :paquetes )) ", nativeQuery = true )
	Page<TbCliente> findByIdEstatusInAndIdPaquetesInAndIndicadorFavorito
		(@Param("estatus") List<Integer> estatus, @Param("paquetes") List<Integer> paquetes, Pageable pageable);
	
	@Query(value = "SELECT * FROM Clientes "
			+ "WHERE idCatEstatus IN ( :estatus ) "
			+ " OR idCatPaquetes IN ( :paquetes )"
			+ " ORDER BY idClientes DESC ", nativeQuery = true )
	Page<TbCliente> findByIdEstatusInOrIdPaquetesInOrderByIdClienteDESC
		(@Param("estatus") List<Integer> estatus, @Param("paquetes") List<Integer> paquetes, Pageable pageable);
	
	@Query(value = "SELECT * FROM Clientes "
			+ "WHERE idCatEstatus IN ( :estatus ) "
			+ " AND idCatPaquetes IN ( :paquetes )"
			+ " ORDER BY idClientes DESC ", nativeQuery = true )
	Page<TbCliente>findByIdEstatusInAndIdPaquetesInOrderByIdClienteDESC
		(@Param("estatus") List<Integer> estatus, @Param("paquetes") List<Integer> paquetes, Pageable pageable);
	
	@Query(value = "SELECT * FROM Clientes "
			+ "WHERE idCatEstatus IN ( :estatus ) "
			+ " OR idCatPaquetes IN ( :paquetes )"
			+ " ORDER BY idClientes ASC ", nativeQuery = true )
	Page<TbCliente> findByIdEstatusInOrIdPaquetesInOrderByIdClienteASC
		(@Param("estatus") List<Integer> estatus, @Param("paquetes") List<Integer> paquetes, Pageable pageable);
	

	@Query(value = "SELECT * FROM Clientes "
			+ "WHERE idCatEstatus IN ( :estatus ) "
			+ " AND idCatPaquetes IN ( :paquetes )"
			+ " ORDER BY idClientes ASC ", nativeQuery = true )
	Page<TbCliente>findByIdEstatusInAndIdPaquetesInOrderByIdClienteASC
		(@Param("estatus") List<Integer> estatus, @Param("paquetes") List<Integer> paquetes, Pageable pageable);
	
	@Query(value = "SELECT * FROM Clientes "
			+ " WHERE razonSocial like %:busqueda%  "
			+ " AND (idCatEstatus IN ( :estatus ) OR idCatPaquetes IN ( :paquetes ) ) ", nativeQuery = true )
	Page<TbCliente> findByIdEstatusInOrIdPaquetesInAndRazonSocialLike
		(@Param("busqueda") String busqueda, @Param("estatus") List<Integer> estatus, @Param("paquetes") List<Integer> paquetes, Pageable pageable);
	
	@Query(value = "SELECT * FROM Clientes "
			+ " WHERE razonSocial like %:busqueda%  "
			+ " AND (idCatEstatus IN ( :estatus ) AND idCatPaquetes IN ( :paquetes ) ) ", nativeQuery = true )
	Page<TbCliente>findByIdEstatusInAndIdPaquetesInAndRazonSocialLike
		(@Param("busqueda") String busqueda, @Param("estatus") List<Integer> estatus, @Param("paquetes") List<Integer> paquetes, Pageable pageable);
}