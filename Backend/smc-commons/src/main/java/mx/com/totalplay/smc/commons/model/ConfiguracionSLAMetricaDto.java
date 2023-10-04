package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ConfiguracionSLAMetricaDto {

	private Long idConfiguracionSLAMetrica;

	private ConfiguracionSLADto tbConfiguracionSLA;

	private MetricaDto tbMetrica;

	private String valor;

}
