package mx.com.totalplay.smc.commons.model;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class DashboardCuadranteDto {

    private Long idDashboardCudrante;
    private Long idDashboard;
    private String titulo;
    private String nombre;
    private Integer activarEdicion;
    private CuadranteGraficaActivaDto cuadranteActivo;

    private List<CuadranteGraficaDto> cuadranteGrafica;

}
