package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@SuperBuilder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CuadranteGraficaDto {

    private Long idCuadranteGrafica;
    private Long idDashboardCudrante;
    private Integer predeterminado;
    private String informacion;
    private String imagen;
    private String tipoGrafica;

}
