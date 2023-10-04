/**
 * 
 */
package mx.com.totalplay.smc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import mx.com.totalplay.smc.entities.TbNotificacion;
import mx.com.totalplay.smc.entities.TbNotificacionUsuario;
import mx.com.totalplay.smc.entities.TbUsuario;

/**
 * @author Luis Luna
 *
 */
public interface INotificacionUsuarioRepository extends IGenericRepository<TbNotificacionUsuario, Long> {

	List<TbNotificacionUsuario> findAllByDestinatario(TbUsuario destinatario);
	
	List<TbNotificacionUsuario> findAllByDestinatarioAndActivoInactivoAndLeidoNoleido(TbUsuario destinatario, Boolean activoInactivo, Boolean leidoNoleido);

	TbNotificacionUsuario findByDestinatarioAndTbNotificacion(TbUsuario usr, TbNotificacion notif);
	
	Integer countByDestinatarioAndActivoInactivoAndLeidoNoleido(TbUsuario usr, Boolean activoInactivo, Boolean leidoNoleido);

	@Query(value = "UPDATE NotificacionesUsuarios nu SET nu.leidoNoleido = 1 "
			+ "WHERE nu.idNotificaciones IN "
			+ "(SELECT n.idNotificaciones FROM Notificaciones n WHERE n.idParametrosUrl IN "
			+ "(SELECT pu.idParametrosUrl FROM ParametrosUrl pu WHERE "
			+ "pu.parametros like :idCliente )) AND nu.leidoNoleido = 0 ", nativeQuery = true)
	void marcarLeidasPorCliente(@Param("idCliente")String idCliente);

}
