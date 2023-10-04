package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PersonalizaClienteDto {

	private String folioTicket;
	private String ticketExterno;
	private String idDispositivo;
	private String dispositivoAlias;
	private String idClienteTotalPlay;

}
