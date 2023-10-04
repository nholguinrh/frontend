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
public class ConsultarMetricasResponseDto extends GenericResponseAPI{
	
	private String date;
	private String idEmpresa;
	private String idServicio;
	private String idSitio;
	private String tipoDispositivo;
	private List<Metrica> metrica;
	private List<Dispositivo> dispositivos;
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Metrica{
		private String nombre;
		private int porcentajePromedio;
		private int diferenciaPorcentajePromedioVsSlaPromedio;
		private int slaPromedio;
		private int totalDispositivosPorcentajeMenorSla;
		private int totalDispositivosPorcentajeMayorSla;
		private int totalDispositivos;
		private int porcentajeMinimo;
		private int porcentajeMaximo;
		private int estatusDetalleDispositivo;
		private boolean metricaDefault;
		private List<Data> data;
		private List<Dispositivo> dispositivos; 
	}
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Dispositivo{
		private String sitio;
		private String idDispositivo;
		private String nombreDispositivo;
		private String tipoDispositivo;
		private String ipNs;
		private String tiempoCaida;
		private String fechaCaida;
		private String estatusDescripcion;
		private String folioTicket;
		private int sla;
		private int porcentajePromedio;
		private int diferenciaporcentajePromedioVsSla;
		private List<Data> data;
		private List<Metrica> metricas; 
	}
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Data implements Comparable<Data>{
		private LocalDateTime id;
		private String fecha;
		private String porcentaje;
		private String porcentajeDiaAnterior;
		private String metrica;
		
		@Override
		public int compareTo(Data d) {
			return this.id.compareTo(d.id);
		}
	}

}
