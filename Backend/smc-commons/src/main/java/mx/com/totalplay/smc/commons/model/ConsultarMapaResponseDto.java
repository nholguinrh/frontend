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
public class ConsultarMapaResponseDto extends GenericResponseAPI{
	
	private String date;
	private String idEmpresa;
	private String tipoDispositivo;
	private String minimoTiempoAfectacion;
	private String maximoTiempoAfectacion;
	private int totalDispositivosCliente;
	private List<Dispositivo> dispositivos;
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Dispositivo{
		private String idDispositivo;
		private String avanceAfectacion;
		private String tiempoTotalSolucion;
		private String sucursal;
		private String ipNs;
		private String sitio;
		private String tipoDispositivo;
		private String enlace;
		private String tipo;
		private String fechaAfectacion;
		private String duracionAfectacion;
		private String folioTicket;
		private String latitud;
		private String longitud;
		private String estado;
		private String identificadorEquipo;
		private List<Data> data;
	}
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Data{
		private String fecha;
		private String cantidad;
	}

}
