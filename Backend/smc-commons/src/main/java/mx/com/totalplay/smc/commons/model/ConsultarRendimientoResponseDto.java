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
public class ConsultarRendimientoResponseDto extends GenericResponseAPI{
	
	private List<Metrica> metricas;
	private String date;
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Metrica{
		private String name;
		private String total;
		private String siglas;
		private String promedioComparativo;
		private String unidad;
		private String titulo;
		private List<Data> data;
		
	}
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Data{
		private String date;
		private String value;
	}

}
