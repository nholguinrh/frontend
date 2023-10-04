package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.com.totalplay.smc.entities.TbCatPaquete;
import mx.com.totalplay.smc.entities.TbDashboard;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaqueteDashboardDto {
	
	private Integer idPaqueteDashboard;

	private TbCatPaquete tbCatPaquete;

	private TbDashboard tbDashboard;

}
