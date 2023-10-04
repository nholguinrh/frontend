package mx.com.totalplay.smc.commons.services;

import mx.com.totalplay.smc.entities.TbPersonalizacionClientes;

public interface IPersonalizacionClienteService extends IGenericService<TbPersonalizacionClientes, Long> {

	TbPersonalizacionClientes obtenerTicketPersonalizado(String clienteTotalPlay, String folioTicket);

	TbPersonalizacionClientes obtenerDispositivoPersonalizado(String clienteTotalPlay, String idDispositivo);

}
