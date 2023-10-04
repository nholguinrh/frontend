package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CatSectorDto {
	
	private Integer idCatSector;
	private String descripcion;

}
