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
public class ConsultarLlamadasResponseDto extends GenericResponseAPI{
	
	private List<Llamada> llamadas;
	private List<Data> data;
	private String date;
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Llamada{
		private String name;
		private int total;
	}
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Data{
		private String date;
		private Double value;
		private String type;
	}

}
