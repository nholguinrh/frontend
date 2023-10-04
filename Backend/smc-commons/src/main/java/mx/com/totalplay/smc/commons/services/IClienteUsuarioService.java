package mx.com.totalplay.smc.commons.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import mx.com.totalplay.smc.commons.exceptions.ApiException;
import mx.com.totalplay.smc.commons.model.ClienteUsuarioDto;
import mx.com.totalplay.smc.commons.model.FiltrarClientesCadenaModel;
import mx.com.totalplay.smc.entities.TbClienteUsuarios;
import mx.com.totalplay.smc.entities.TbUsuario;

public interface IClienteUsuarioService extends IGenericService<TbClienteUsuarios, Long> {

	Page<TbUsuario> paginarPorIdCliente(Long idCliente, Pageable pageable);
	
	Page<TbUsuario> paginarPorCadena(Long idCliente, FiltrarClientesCadenaModel request, Pageable pageable);

	TbClienteUsuarios registrarUsuario(Integer idUsuarioOpera, TbClienteUsuarios request) throws ApiException;
	
	TbUsuario registrarUsuarioActualiza(Integer idUsuarioOpera, TbClienteUsuarios request) throws ApiException;

	void eliminarUsuario(Integer idUsuario) throws ApiException;
	
	void borradoLogico(Integer idUsuario) throws ApiException;

	ClienteUsuarioDto consultarDetalle(Integer idUsuario);

	List<TbUsuario> listarPorIdCliente(Long id);
	
	TbUsuario cambiarPerfil(Integer idUsuario, Integer idCatPerfil);
	
	TbClienteUsuarios findByTbUsuario(TbUsuario tbUsuario);
	
	List<TbUsuario> listarUsuariosNoInActivosPorClient(Long idCliente);
	
	boolean validaSeguirInvitandoPorCliente(Long idCliente) throws ApiException;
	
}
