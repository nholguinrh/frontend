package mx.com.totalplay.smc.commons.utils;

public class ValidacionesApi {

	public static boolean isIntegerValido(Integer input) {
		if (input == null || input <= 0) {
			return false;
		}
		return true;
	}
	
	public static boolean isLongValido(Long input) {
		if (input == null || input <= 0) {
			return false;
		}
		return true;
	}
}
