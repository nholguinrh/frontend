package mx.com.totalplay.smc.commons.utils;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ConstantesApi {

	DASHBOARD_MONITOREO_EJECUTIVO(1,"Monitoreo Ejecutivo","C"), 
	DASHBOARD_MONITOREO_ENLACES(2,"Monitoreo Global de Servicios", "C"), 
	DASHBOARD_MONITOREO_MAPAS(3,"Monitoreo de Mapas", "C"), 
	ESTATUS_U_ACTIVO(1,"Activo","U"),
	ESTATUS_U_INACTIVO(2,"Inactivo","U"), 
	ESTATUS_U_PENDIENTE(3,"Pendiente","U"), 
	ESTATUS_U_ONBOARDING(4,"Onboarding","U"),
	PERFIL_EJECUTIVO(1,"Ejecutivo", "C"),
	PERFIL_MONITOREO(2, "Operador", "C"),
	ESTATUS_CODIGO_PENDIENTE(13, "Pendiente", "V"),
	ESTATUS_CODIGO_VALIDADO(14, "Validado", "V")
	;

	private int code;
	private String descripcion;
	private String tipo;

}
