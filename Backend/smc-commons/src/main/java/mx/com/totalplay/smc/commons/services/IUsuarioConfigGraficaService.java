package mx.com.totalplay.smc.commons.services;

import java.util.List;

import mx.com.totalplay.smc.commons.model.ActualizaGraficaUsuarioModel;
import mx.com.totalplay.smc.commons.model.PaqueteDashboardDto;
import mx.com.totalplay.smc.commons.model.TipoDispositivoFrontDto;
import mx.com.totalplay.smc.commons.model.UsuarioConfiguracionDashboardDto;
import mx.com.totalplay.smc.entities.TbUsuarioConfiguracionGrafica;

public interface IUsuarioConfigGraficaService extends IGenericService<TbUsuarioConfiguracionGrafica, Integer> {
	
	List<TbUsuarioConfiguracionGrafica> obtenerConfiguracion (Integer idUsuario);
	
	TbUsuarioConfiguracionGrafica actualizarGrafica(ActualizaGraficaUsuarioModel request);
	
	UsuarioConfiguracionDashboardDto personalizarDashbords(Integer idUsuario, Integer idDashboard, String aspecto);
	
	UsuarioConfiguracionDashboardDto recuperarDashbords(Integer idUsuario);
	
	List<PaqueteDashboardDto> recuperarDashbordsPaquete(Integer idUsuario);
	
	List<TipoDispositivoFrontDto> recuperarTipoDispositivo(Integer idCliente);

}
