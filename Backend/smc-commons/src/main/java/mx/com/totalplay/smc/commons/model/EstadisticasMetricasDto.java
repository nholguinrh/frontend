package mx.com.totalplay.smc.commons.model;

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
public class EstadisticasMetricasDto {
	
		private String name;
		private String value;
		private String change;
		private String maximo;
		private String minimo;
		private int estatus;
		private boolean metricaDefault;
	
}
