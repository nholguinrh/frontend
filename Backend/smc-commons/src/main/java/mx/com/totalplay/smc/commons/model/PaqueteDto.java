package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class PaqueteDto implements Serializable {
    private static final long serialVersionUID = 655522994926122267L;

    private Integer idCatPaquetes;
    private String informacion;
    private String descripcion;
    private Integer cantidadUsuarios;
}
