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
@Table(name = "UsuarioConfiguracionDashboard")
public class TbUsuarioConfiguracionDashboard {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idUsuarioConfigDashboard")
	private Long idClienteUsuario;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idUsuario", nullable = false, foreignKey = @ForeignKey(name = "FK_TbUsuarioConfiguracionDashboard_TbUsuario"))
	private TbUsuario tbUsuario;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idDashboard", nullable = false, foreignKey = @ForeignKey(name = "FK_TbUsuarioConfiguracionDashboard_TbDashboard"))
	private TbDashboard tbDashboard;

	@Column(name = "aspecto", length = 10)
	private String aspecto;

	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDateTime fechaActualizacion;

}
