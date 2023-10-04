package mx.com.totalplay.smc.entities;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "ClientesConfiguracion")
public class TbClienteConfiguracion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idClientesConfiguracion")
	private Long idClienteConfiguracion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idClientes", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteConfiguracion_TbCliente"))
	private TbCliente tbCliente;

	@Column(name = "tiempoHistorico")
	private Integer tiempoHistorico;

	@Column(name = "bandejaHistorico", length = 100)
	private String bandejaHistorico;

	@Column(name = "tipoTickets", length = 45)
	private String tipoTicketsS;

	@Column(name = "origenTicket", length = 80)
	private String origenTicket;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idCatTipoTickets", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteConfiguracion_TbCatTipoTicket"))
	private TbCatTipoTicket tbCatTipoTicket;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idCatSector", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteConfiguracion_TbCatSector"))
	private TbCatSector tbCatSector;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idCatOrigenNombre", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteConfiguracion_TbCatOrigenNombre"))
	private TbCatOrigenNombre tbCatOrigenNombre;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idCatBandejaSD", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteConfiguracion_TbCatBandejaSD"))
	private TbCatBandejaSD tbCatBandejaSD;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idCatHistoricoPerformance", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteConfiguracion_TbCatHistoricoPerformance"))
	private TbCatHistoricoPerformance tbCatHistoricoPerformance;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteConfiguracion_TbUsuario_CreadoPor"))
	private TbUsuario creadoPor;

	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDateTime fechaActualizacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", nullable = true, foreignKey = @ForeignKey(name = "FK_TbClienteConfiguracion_TbUsuario_ActualizadoPor"))
	private TbUsuario actualizadoPor;

	@JsonIgnore
	@Column(name = "fechaBaja")
	private LocalDateTime fechaBaja;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "eliminadoPor", nullable = true, foreignKey = @ForeignKey(name = "FK_TbClienteConfiguracion_TbUsuario_EliminadoPor"))
	private TbUsuario eliminadoPor;

}
