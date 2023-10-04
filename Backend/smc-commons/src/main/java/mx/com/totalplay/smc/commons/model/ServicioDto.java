package mx.com.totalplay.smc.commons.model;

import java.time.LocalDateTime;
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
public class ServicioDto {
	private String sitio;
	private String idDispositivo;
	//private String nombreDispositivo;
	private String tipoDispositivo;
	private String enlace;
	private String estatus;
	private String ipNs;
	private String folioTicket;
	private String alias;
//	private List<InterfacesDto> interfaces;
//	private List<dataDto> data;
//	private List<ticketsDto> tickets;
	private List<MetricaLine> metricas;
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class MetricaLine{
		private int idMetrica;
		private String metrica;
		private String porcentajeActual;
		private String porcentajeAyer;
		private String porcentajeSla;
		private String color;
		private List<Data> data;
	}
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Data implements Comparable<Data>{
		private LocalDateTime id;
		private String y;
		private String x;
		private String yAnterior;
		
		@Override
		public int compareTo(Data d) {
			return this.id.compareTo(d.id);
		}
	}
	
}







