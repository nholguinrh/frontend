package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MetricaDto {

	private Integer idMetrica;

	private CatEstatusDto tbCatEstatus;

	private String metrica;

	private String tipoMetrica;

	private String informacion;
	
	private boolean metricaDefault;

}
