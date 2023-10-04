/**
 * 
 */
package mx.com.totalplay.smc.commons.model;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import mx.com.totalplay.smc.entities.TbCatPaquete;

/**
 * @author Luis Luna
 *
 */

@Getter
@Setter
public class ResumenContratoModel {

	String noContrato;
	LocalDate renovacion;
	TbCatPaquete paquete;
}
