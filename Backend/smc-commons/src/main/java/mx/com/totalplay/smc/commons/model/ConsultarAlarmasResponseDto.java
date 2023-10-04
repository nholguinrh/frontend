package mx.com.totalplay.smc.commons.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConsultarAlarmasResponseDto extends GenericResponseAPI{
	
	private String date;
	private String idEmpresa;
	private String tipoDispositivo;
	private int dispositivosInalcanzables;
	private int dispositivosSinGestion;
	private int dispositicosConIncMem;
	private int dispositivosConIncCPU;
	private int totalAlarmas;
	private int totalAlarmasMesAnt;
	List<Data> alarmas;
	List<Data> alarmasMesAnterior;
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Data{
		private String fecha;
		private String categoria;
		private String valor;
	}
	
}
