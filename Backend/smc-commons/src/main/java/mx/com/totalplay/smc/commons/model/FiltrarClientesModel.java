package mx.com.totalplay.smc.commons.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FiltrarClientesModel {
	
	private List<Integer> estatus;
	private List<Integer> paquetes;
	private String tipo;
	private String busqueda;
}
