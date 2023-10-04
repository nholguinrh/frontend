package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MetricaDispositivoDto {

private Integer idMetricasDispositivos;

private MetricaDto metrica;
	
private String tipoDispositivo;

private Boolean aplica;
}
