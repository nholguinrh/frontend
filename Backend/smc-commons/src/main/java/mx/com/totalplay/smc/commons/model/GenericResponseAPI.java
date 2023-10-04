package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GenericResponseAPI {

	private int httpStatus;
	private String message;
	private String dateTime;
	private String source;
	private long timeInSecsLocalServices;
	private long timeInSecsExternalServices;

}
