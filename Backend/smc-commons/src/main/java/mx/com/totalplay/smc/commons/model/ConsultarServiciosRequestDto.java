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
public class ConsultarServiciosRequestDto {
	
	private Cliente cliente;
	private List<Dispositivo> dispositivos;
	private List<TipoDispositivo> tipoDispositivos;
	private List<Estatus> estatus;
	private List<Metrica> metricas;
	private List<TipoTicket> tipoTicket;
	private String sla;
	private String funcionalidadMetrica;
	private String funcionalidadTicket;
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Cliente{
		private int idCliente;
		private String nombreCliente;
	}
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Dispositivo{
		private int idDispositivo;
		private String nombreDispositivo;
	}
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class TipoDispositivo{
		private int idTipoDispositivo;
		private String nombreTipoDispositivo;
	}
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Estatus{
		private int idEstatus;
		private String nombreEstatus;
	}
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Metrica{
		private int idMetrica;
		private String nombreMetrica;
	}
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class TipoTicket{
		private int idTicket;
		private String nombreTicket;
	}

}
