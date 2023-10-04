package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailModelAsync {

		private String[] receptor;

		private String nombreServicio;
		
		private String codeError;
		
		private String detalleError;
		
		private String FechaHora;
			
}
