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
public class ConsultarVistaGeneralResponseDto extends GenericResponseAPI{
	
	private String date;
	private String idEmpresa;
	private String tipoDispositivo;
	private int totalDispositivosActivos;
	private int totalDispositivosInactivos;
	private int totalDispositivosMantenimiento;
	List<Data> data;
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Data{
		private String fecha;
		private String estatus;
		private String valor;
	}
	
}
