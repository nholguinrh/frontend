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
@Table(name = "PaqueteDashboard")
public class TbPaqueteDashboard {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idPaqueteDashboard")
	private Integer idPaqueteDashboard;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatPaquetes", foreignKey = @ForeignKey(name = "FK_TbPaqueteDashboard_TbCatEstatus"))
	private TbCatPaquete tbCatPaquete;

	@ManyToOne
	@JoinColumn(name = "idDashboard", foreignKey = @ForeignKey(name = "FK_TbPaqueteDashboard_TbDashboard"))
	private TbDashboard tbDashboard;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbPaqueteDashboard_TbUsuario_CreadoPor"))
	private TbUsuario creadoPor;
}
