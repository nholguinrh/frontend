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
public class ConsultarPuntasResponseDto extends GenericResponseAPI{
	private String date;
	private List<PuntaDto> puntas;
	
	public ConsultarPuntasResponseDto(int httpStatus, String message, String dateTime, List<PuntaDto> puntas) {
		super(httpStatus, message, dateTime, "", 0, 0);
		this.puntas = puntas;
	}

}
