package mx.com.totalplay.smc.entities;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "ClienteTickets")
public class TbClienteTicket {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idClienteTickets")
	private Long idClienteTicket;
	

	@ManyToOne
	@JoinColumn(name = "idClientes", foreignKey = @ForeignKey(name = "FK_TbClienteTicket_TbClientes"))
	private TbCliente tbCliente;

	@Column(name = "fechaApertura")
	private LocalDateTime fechaApertura;
	
	@Column(name = "fechaCierre")
	private LocalDateTime fechaCierre;
	
	@Column(name = "numeroTicket", length = 45)
	private String numeroTicket;
	
	@Column(name = "ticketExterno", length = 45)
	private String ticketExterno;
	
	@Column(name = "categoria", length = 45)
	private String categoria;
	
	@Column(name = "comentarios", length = 255)
	private String comentarios;
	
	@Column(name = "enlacePunta", length = 45)
	private String enlacePunta;
	
	@Column(name = "descripcion", length = 255)
	private String descripcion;
	
	@Column(name = "resumen", length = 255)
	private String resumen;
	
	@Column(name = "diagnosticoFinal", length = 255)
	private String diagnosticoFinal;
	
	@Column(name = "estatus", length = 40)
	private String estatus;
	
	@Column(name = "descripcionEstatus", length = 80)
	private String descripcionEstatus;		
	
}
