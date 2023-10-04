package mx.com.totalplay.smc.commons.model;

import java.util.Date;
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
public class ConsultarServiciosResponseDto extends GenericResponseAPI{
	
	private Date date;
	private List<ServicioDto> respuesta;
	
//	@SuperBuilder
//	@Data
//	@Builder
//	@AllArgsConstructor
//	@NoArgsConstructor
//	public static class Dispositivo{
//		private String sitio;
//		private String idDispositivo;
//		private String ipNs;
//		private String nombreDispositivo;
//		private String tipoDispositivo;
//		private String enlace;
//		private String estatus;
//		private List<DispositivoInterface> interfaces;
//		private List<DispositivoData> data;
//		private List<DispositivoTicket> tickets;
//	}
//	
//	@SuperBuilder
//	@Data
//	@Builder
//	@AllArgsConstructor
//	@NoArgsConstructor
//	public static class DispositivoInterface{
//		private String idDispositivo;
//		private String _interface;
//		private String tipoServicio;
//		private String estatus;
//		private String conecta_con;
//	}
//	
//	@SuperBuilder
//	@Data
//	@Builder
//	@AllArgsConstructor
//	@NoArgsConstructor
//	public static class DispositivoData{
//		private String fecha;
//		private String porcentaje;
//		private String porcentajeDiaAnterior;
//		private String metrica;
//	}
//	
//	@SuperBuilder
//	@Data
//	@Builder
//	@AllArgsConstructor
//	@NoArgsConstructor
//	public static class DispositivoTicket{
//		private String categoria;
//		private String comentarios;
//		private String descripcion;
//		private String descripcionEstatus;
//		private String diagnosticoFinal;
//		private String enlacePunta;
//		private String estatus;
//		private String fechaApertura;
//		private String fechaSolucion;
//		private String folioTicket;
//		private String idDispositivo;
//		private String ipNs;
//		private String resumen;
//		private String sitio;
//		private String solicitante;
//		private String ticketExterno;
//	}

}
