
/**
 * 
 */
package mx.com.totalplay.smc.commons.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.ActualizarContraseniaModel;
import mx.com.totalplay.smc.commons.model.CompletarRegistroModel;
import mx.com.totalplay.smc.commons.model.ResponseEntityModel;
import mx.com.totalplay.smc.commons.model.UsuarioDto;
import mx.com.totalplay.smc.entities.TbClienteUsuarios;
import mx.com.totalplay.smc.entities.TbUsuario;

/**
 * @author jacob
 *
 */
public interface IUsuarioService extends IGenericService<TbUsuario, Integer> {

	TbUsuario registrarUsuario(Integer idUsuarioOpera, TbUsuario request, String tipo) throws ApiException;
	
	TbUsuario registrarUsuarioActualiza(Integer idUsuarioOpera, TbUsuario request) throws ApiException;
	
	TbUsuario actualizarUsuario(Integer idUsuarioOpera, TbUsuario request) throws ApiException;
	
	ResponseEntityModel<String> actualizarContrasenia(ActualizarContraseniaModel request);

	/**
	 * Obtener usuario por usr & password
	 * 
	 * @param usr
	 * @param passwd Codificado by Bcrypt
	 * @return
	 */
	UsuarioDto obtenerUsuario(String usr, String passwd) throws ApiException;

	/**
	 * Obtener usuario por usr & password
	 * 
	 * @param usr
	 * @param passwd Codificado by Bcrypt
	 * @return
	 */
	TbUsuario obtenerUsuario(String usr) throws ApiException;

	/**
	 * @param idCliente
	 * @return
	 */
	List<TbUsuario> obtenerUsuarioPorCliente(Long idCliente);
	
	/**
	 * Obtener listado de usuarios por página
	 * @param pageable
	 * @return
	 */
	Page<TbUsuario> obtenerUsuariosAdmin(Pageable pageable);
	
	/**
	 * Obtener listado de usuarios admin por filtro de nombres y/o email por página
	 * @param pageable
	 * @return
	 */
	Page<TbUsuario> obtenerUsuariosAdminPorFiltroNombresOEmail(String filtro, Pageable pageable);
	
	/**
	 * Completar el registro del usuario
	 * @param completarRegistroModel
	 * @return
	 */
	TbUsuario completarRegistro(CompletarRegistroModel completarRegistroModel);
	
	/**
	 * Recupera los usuario activos de tipo cliente - ejecutivo y operador
	 * @return
	 */
	public List<TbUsuario> obtenerUsuariosActivosEjecutivoOperador();
	
	/**
	 * Recupera los usuario activos de tipo admin - backoffice y administrador
	 * @return
	 */
	public List<TbUsuario> obtenerUsuariosActivosBackofficeAdministrador();

	/**
	 * Realiazar un cambio de Estatus a Inactivo
	 * @return
	 */
	TbUsuario eliminarLogico(TbUsuario tbUsuario);

	/**
	 * Registrar usuarios a clientes, cuando hace una invitacion el cliente
	 * @return
	 */
	TbUsuario registrarUsuarioDeCliente(Integer idUsuarioOpera, TbClienteUsuarios request, String tipo) throws ApiException;
}
