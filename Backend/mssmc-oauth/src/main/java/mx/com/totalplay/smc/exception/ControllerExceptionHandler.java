package mx.com.totalplay.smc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ControllerExceptionHandler {

	@ExceptionHandler(UserNotFoundException.class)
	protected ResponseEntity<?> handleException(UserNotFoundException e) {
		return new ResponseEntity<>(new ErrorResponseModel(401, e.getMessage()), HttpStatus.UNAUTHORIZED);
	}

	class ErrorResponseModel {
		private int code;
		private String message;

		public ErrorResponseModel(int code, String message) {
			this.code = code;
			this.message = message;
		}

		public int getCode() {
			return code;
		}

		public void setCode(int code) {
			this.code = code;
		}

		public String getMessage() {
			return message;
		}

		public void setMessage(String message) {
			this.message = message;
		}

	}
}
