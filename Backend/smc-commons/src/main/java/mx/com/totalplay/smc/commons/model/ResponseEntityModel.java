package mx.com.totalplay.smc.commons.model;

import java.time.LocalDateTime;

import lombok.Getter;

@Getter
public class ResponseEntityModel<T> extends GenericResponseAPI {

	private T data;

	public ResponseEntityModel(T data, int httpStatus, String message) {
		super(httpStatus, message, LocalDateTime.now().toString(),"", 0, 0);
		this.data = data;
	}
}
