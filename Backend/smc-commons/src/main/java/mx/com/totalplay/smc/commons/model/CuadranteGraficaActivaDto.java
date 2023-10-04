package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class CuadranteGraficaActivaDto extends CuadranteGraficaDto {

    private Integer activo;

}
