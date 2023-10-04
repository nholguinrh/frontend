package mx.com.totalplay.smc.commons.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CatEstatusDto {

	private Integer idCatEstatus;

	private String descripcion;

	private String tipoEstatus;

	private LocalDateTime fechaCreacion;
}
