package mx.com.totalplay.smc.entities;

import java.time.LocalDate;
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
@Table(name = "DashboardImagenes")
public class TbDashboardImagen {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idDashboardImagenes")
	private Long idDashboardImagen;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idDashboard", nullable = false, foreignKey = @ForeignKey(name = "FK_TbDashboardImagen_TbDashboard"))
	private TbDashboard tbDashboard;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idImagenes", nullable = false, foreignKey = @ForeignKey(name = "FK_TbDashboardImagen_TbDashboardImagen"))
	private TbConfiguracionImagen tbConfiguracionImagen;

	@Column(name = "activoInactivo", length = 1)
	private String activoInactivo;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbDashboardImagen_TbUsuario_CreadoPor"))
	private TbUsuario creadoPor;

	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDateTime fechaActualizacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", foreignKey = @ForeignKey(name = "FK_TbDashboardImagen_TbUsuario_ActualizadoPor"))
	private TbUsuario actualizadoPor;

	@JsonIgnore
	@Column(name = "fechaBaja")
	private LocalDate fechaBaja;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "eliminadoPor", foreignKey = @ForeignKey(name = "FK_TbDashboardImagen_TbUsuario_EliminadoPor"))
	private TbUsuario eliminadoPor;

}
