package mx.com.totalplay.smc.commons.model;

import java.time.LocalDateTime;

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
public class DataDto implements Comparable<DataDto>{
	
	private LocalDateTime id; 
	private String date;//barras,linea,data
	private double value;//barras,linea,data,burbujas
	private String media;//barras,linea,data
	private String title;//values,burbujas
	private BarDto bar;//values
	private String color;//burbujas
	private String border;//burbujas
	private String numeroTicket;
	private String descripcion;
	private String estatus;
	private String metricaDiaAnterior;
	private String interfaceName;
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class BarDto {
		
		private int value;
		private int max;
		private String color;
		private String titulo;
		private String textcolor;
		private String textcolordark;
		private int textx;
		private int texty;
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class ContentDto{
		private String metrica;
		private int idMetrica;
		private String title;
		private String fecha;
		private String hora;
		private boolean ticket;
		
	}
	
	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class SortDto{
		private boolean sorted;
		private boolean unsorted;
		private boolean empty;
	}
	
	@Override
	public int compareTo(DataDto d) {
		return this.id.compareTo(d.id);
	}

}
