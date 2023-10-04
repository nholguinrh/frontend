package mx.com.totalplay.smc.commons.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ApiException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	private Integer code;
	private String message;
}
