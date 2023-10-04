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
@Table(name = "DashboardMetricas")
public class TbDashboardMetrica {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idDashboardMetricas")
	private Integer idDashboardMetrica;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idMetricas", nullable = false, foreignKey = @ForeignKey(name = "FK_TbDashboardMetrica_TbMetrica"))
	private TbMetrica tbMetrica;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idDashboard", nullable = false, foreignKey = @ForeignKey(name = "FK_TbDashboardMetrica_TbDashboard"))
	private TbDashboard tbDashboard;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbDashboardMetrica_TbUsuario_CreadoPor"))
	private TbUsuario creadoPor;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

}
