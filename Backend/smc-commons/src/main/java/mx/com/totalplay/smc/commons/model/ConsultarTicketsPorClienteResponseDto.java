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
public class ConsultarTicketsPorClienteResponseDto extends GenericResponseAPI {

	private String date;
	private String idEmpresa;
	private String idDispositivo;
	private int totalEnCursoData;
	private int totalPendientesData;
	private int totalResueltosData;
	private int totalCerradosData;
	private int totalEnCursoDiaActual;
	private int totalPendientesDiaActual;
	private int totalResueltosDiaActual;
	private int totalCerradosDiaActual;
	private int totalTickets;
	private double tiempoMinimoRespuesta;
	private double tiempoMaximoRespuesta;
	private double tiempoPromedioRespuesta;
	private List<Dispositivo> agrupados;

	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Dispositivo {
		private String estatus;
		private List<Ticket> tickets;
		private List<DataDispositivo> data;
	}

	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Ticket {
		private String fechaApertura;
		private String fechaSolucion;
		private String tiempoTranscurrido;
		private String idDispositivo;
		private String ipNs;
		private String folioTicket;
		private String ticketExterno;
		private String categoria;
		private String sitio;
		private String solicitante;
		private String comentarios;
		private String enlacePunta;
		private String descripcion;
		private String resumen;
		private String diagnosticoFinal;
		private String estatus;
		private String descripcionEstatus;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class DataDispositivo{
		private String fecha;
		private long cantidad;

	}

	@Getter
	public enum Estatus {
		ENCURSO("en curso"), PENDIENTES("pendientes"), RESUELTOS("resueltos");

		private String descripcion;

		Estatus(String descripcion) {
			this.descripcion = descripcion;
		}

	}

}
