package mx.com.totalplay.smc.commons.utils;

import java.util.HashMap;
import java.util.Map;

public class ConstantesFront {
	
	public static Map<String, String> icons_tickets = new HashMap<>();
	public static Map<String, String> colors_tickets = new HashMap<>();
	public static Map<String, String> colors_tickets_options = new HashMap<>();
	public static Map<String, String> clase_tickets = new HashMap<>();
	public static Map<String, String> icons_busqueda = new HashMap<>();
	public static Map<String, String> colors_tickets_area = new HashMap<>();
	
	static {
		icons_tickets.put("totales", "image-option-total");
		icons_tickets.put("en curso", "image-option-curso");
		icons_tickets.put("pendiente", "image-option-pendientes");
		icons_tickets.put("resuelto", "image-option-resueltos");
		
		colors_tickets.put("totales", "#285CED");
		colors_tickets.put("en curso", "#FDA700");
		colors_tickets.put("pendiente", "#F95A36");
		colors_tickets.put("resuelto", "#1A7F1C");
		
		colors_tickets_options.put("totales", "#d4defb");
		colors_tickets_options.put("en curso", "#ffedcc");
		colors_tickets_options.put("pendiente", "#fedede");
		colors_tickets_options.put("resuelto", "#cfeee4");
		
		colors_tickets_area.put("en curso", "#ffedcc");
		colors_tickets_area.put("pendiente", "#fed6cd");
		colors_tickets_area.put("resuelto", "#d1e5d2");
		colors_tickets_area.put("totales", "#d4defb");
		
		clase_tickets.put("totales", "estatus-todos");
		clase_tickets.put("en curso", "estatus-curso");
		clase_tickets.put("pendiente", "estatus-pendientes");
		clase_tickets.put("resuelto", "estatus-resueltos");
		
		icons_busqueda.put("P", "sitio");
		icons_busqueda.put("E", "enlace");
		icons_busqueda.put("other", "servicio");
	}

}
