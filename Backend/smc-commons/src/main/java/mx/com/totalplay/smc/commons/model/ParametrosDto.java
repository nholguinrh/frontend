package mx.com.totalplay.smc.commons.model;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ParametrosDto {

	private String idParametro;

	private String descripcion;

	private String valor;

	private LocalDate fechaCreacion;

}
