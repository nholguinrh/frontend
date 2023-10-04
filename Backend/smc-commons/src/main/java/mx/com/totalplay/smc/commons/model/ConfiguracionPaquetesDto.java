package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class ConfiguracionPaquetesDto extends PaqueteDto implements Serializable {
    private static final long serialVersionUID = 280626591010427472L;
    private List<PaquetesDto> servicios = new ArrayList<>();
    private List<PaquetesDto> metricas = new ArrayList<>();
    private List<PaquetesDto> dashboards = new ArrayList<>();
}
