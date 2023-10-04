package mx.com.totalplay.smc.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "PersonalizacionClientes")
public class TbPersonalizacionClientes {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idPersonaliza")
	private Integer idPersonaliza;
	
	@Column(name = "idClienteTotalPlay")
	private String idClienteTotalPlay;

	@Column(name = "idDispositivo")
	private String idDispositivo;

	@Column(name = "dispositivoAlias")
	private String dispositivoAlias;

	@Column(name = "folioTicket")
	private String folioTicket;

	@Column(name = "ticketExterno")
	private String ticketExterno;
}
