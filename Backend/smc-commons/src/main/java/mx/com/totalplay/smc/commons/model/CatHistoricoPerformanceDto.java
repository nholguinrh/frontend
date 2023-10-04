/**
 * 
 */
package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CatHistoricoPerformanceDto {

	private Integer idCatHistoricoPerformance;
	private Integer valor;
	private String unidad;
}
