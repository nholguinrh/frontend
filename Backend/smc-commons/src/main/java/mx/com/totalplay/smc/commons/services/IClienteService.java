package mx.com.totalplay.smc.commons.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.ActualizaCteFavModel;
import mx.com.totalplay.smc.commons.model.FiltrarClientesModel;
import mx.com.totalplay.smc.commons.model.GuardarClienteModel;
import mx.com.totalplay.smc.commons.model.ResponseEntityModel;
import mx.com.totalplay.smc.commons.model.ResumenContratoModel;
import mx.com.totalplay.smc.commons.model.UsuarioAdmFavDto;
import mx.com.totalplay.smc.entities.TbCliente;
import mx.com.totalplay.smc.entities.TbUsuarioAdmFav;

public interface IClienteService extends IGenericService<TbCliente, Long> {

	/**
	 * Obtener cliente por contrato y password externo
	 * 
	 * @param contrato
	 * @param pwd
	 * @param ip
	 * @return
	 * @throws ApiException
	 */
	TbCliente obtenerCliente(String contrato, String pwd, String ip) throws ApiException;

	/**
	 * Permite crear un cliente, su usuario y establecer su relacion
	 * 
	 * @param idUsuarioOpera Usurio que reliza dicha operación
	 * @param request        Cliente del SMC
	 * @return
	 */
	GuardarClienteModel registrarClienteCrearUsuario(int idUsuarioOpera, GuardarClienteModel request);

	/**
	 * @param request
	 * @return
	 */
	ResponseEntityModel<Boolean> editarFav(ActualizaCteFavModel request);

	/**
	 * @param contrato
	 * @return
	 */
	ResumenContratoModel consultaResumen(String contrato);
	
	/**
	 * @param pageable
	 * @param idUsuario
	 * @return
	 */
	Page<TbUsuarioAdmFav> listarFavoritos(Pageable pageable, Integer idUsuario);

	/**
	 * Obtener listado de clientes por página
	 * @param pageable
	 * @return
	 */
	Page<TbCliente> obtenerClientes(Pageable pageable);

	/**
	 * 
	 * @param tipo
	 * @param pageable
	 * @return
	 */
	Page<TbCliente> ordenarPorAntiguedad(String tipo, Pageable pageable);

	/**
	 * 
	 * @param pageable
	 * @param cadena
	 * @return
	 */
	Page<TbCliente> filtrarxCadenaLike(Pageable pageable, String cadena);
	
	/**
	 * Actualizar la información de un cliente
	 * @param IdCliente
	 * @param request
	 * @return
	 */
	GuardarClienteModel actualizarCliente(Integer idUsuarioOpera, GuardarClienteModel request);
	

	/**
	 * Obtener detalle de cliente favorito por idCliente y idUsuario
	 * @param pageable
	 * @param idUsuario
	 * @param idCliente
	 * @return
	 */
	Page<TbUsuarioAdmFav> listarFavorito(Pageable pageable, Integer idUsuario, Long idCliente);
	
	/**
	 * Recupera si tiene favorito o no
	 * @param request
	 * @return
	 */
	Boolean existeFav(long idCliente, int idUsuario);
	
	/**
	 * Eliminar cliente
	 * @param idUsuarioOpera
	 * @param idCliente
	 * @return
	 */
	boolean eliminarCliente(Integer idUsuarioOpera, Long idCliente);
	
	List<TbCliente> filtrarxEmailoContrato(String email, String contrato);
	
	List<TbCliente> filtrarEmail(String email);
	
	List<TbCliente> findByIdClienteTotalPlay(String idClienteTotalPlay);
	
	List<TbCliente> listarTodos();

	List<UsuarioAdmFavDto> listarTodosFavoritos(Integer idUsuario);

	Page<TbCliente> aplicarFiltros(FiltrarClientesModel request, Pageable pageable);

	List<String> listarDispositivosPorCliente(Long idCliente);
	
	List<String> distinctTipoPuntaByIdCliente(Long idCliente);
	
	boolean validaSeguirInvitandoUsuariosDelCliente(Long idCliente) throws ApiException;

		
}
