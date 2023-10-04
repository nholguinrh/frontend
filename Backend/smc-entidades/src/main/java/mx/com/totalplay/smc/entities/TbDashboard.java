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
@Table(name = "Dashboards")
public class TbDashboard {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idDashboard")
	private Integer idDashboard;

	@Column(name = "descripcion", length = 45)
	private String descripcion;

	@Column(name = "informacion", length = 255)
	private String informacion;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatEstatus", nullable = false, foreignKey = @ForeignKey(name = "FK_TbDashboard_TbCatEstatus"))
	private TbCatEstatus tbCatEstatus;

	@Column(name = "icono", length = 45)
	private String icono;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbNotificacion_TbUsuario_CreadoPor"))
	private TbUsuario creadoPor;

	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDateTime fechaActualizacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", foreignKey = @ForeignKey(name = "FK_TbNotificacion_TbUsuario_ActualizadoPor"))
	private TbUsuario actualizadoPor;

	@JsonIgnore
	@Column(name = "fechaBaja")
	private LocalDateTime fechaBaja;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "eliminadoPor", foreignKey = @ForeignKey(name = "FK_TbNotificacion_TbUsuario_EliminadoPor"))
	private TbUsuario eliminadoPor;

}
