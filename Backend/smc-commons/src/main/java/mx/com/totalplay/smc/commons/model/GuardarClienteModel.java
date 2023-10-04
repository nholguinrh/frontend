package mx.com.totalplay.smc.commons.model;

import java.util.List;

import lombok.Data;

@Data
public class GuardarClienteModel {
	
	private ClienteDto cliente;
	private ClienteConfiguracionDto configuracion;
	private List<CatServicioDto> servicios;
	private UsuarioDto usuario;
}
