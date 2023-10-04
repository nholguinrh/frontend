package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.com.totalplay.smc.entities.TbNotificacion;

public interface INotificacionRepository extends IGenericRepository<TbNotificacion, Long> {
	
	@Query(value = "SELECT n.* FROM NotificacionesUsuarios nu, Notificaciones n "
		+ "WHERE nu.destinatario = :idUsuario AND nu.activoInactivo = :activoInactivo "
		+ "AND nu.leidoNoleido = :leidoNoleido "
		+ "AND n.idNotificaciones = nu.idNotificaciones "
		+ "ORDER BY n.fechaCreacion DESC ", nativeQuery = true)
	List<TbNotificacion> findAllByDestinatarioAndActivoInactivoAndLeidoNoleido(@Param("idUsuario") Integer idUsuario,
			@Param("activoInactivo") Boolean activoInactivo, @Param("leidoNoleido") Boolean leidoNoleido);
	
	@Query(value = " SELECT * FROM NotificacionesUsuarios nu, Notificaciones n "
			+ " WHERE nu.idNotificaciones  = n.idNotificaciones "
			+ " AND (n.titulo LIKE %:busqueda%  OR n.descripcion LIKE %:busqueda%) "
			+ " AND nu.destinatario = :idUsuario "
			+ " AND nu.leidoNoleido = :leidoNoleido ", nativeQuery = true)
		List<TbNotificacion> findAllByTituloAndDestinatarioAndLeidoNoleido(@Param("idUsuario") Integer idUsuario,
				@Param("busqueda") String busqueda, @Param("leidoNoleido") Integer leidoNoleido);

}


