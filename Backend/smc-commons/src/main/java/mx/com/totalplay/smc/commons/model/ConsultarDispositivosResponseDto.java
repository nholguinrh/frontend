package mx.com.totalplay.smc.commons.model;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ConsultarDispositivosResponseDto extends GenericResponseAPI{
	
	private List<Dispositivo> dispositivos;
	private String date;
	
	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Dispositivo{
		private String idDispositivo;
		private String nombreDispositivo;
		private String ip;
	}

}
