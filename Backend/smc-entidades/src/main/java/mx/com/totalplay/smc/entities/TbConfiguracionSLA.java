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
@Table(name = "ConfiguracionSLA")
public class TbConfiguracionSLA {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idConfiguracionSLA")
	private Long idConfiguracionSLA;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatEstatus", nullable = false, foreignKey = @ForeignKey(name = "FK_TbConfiguracionSLA_TbCatEstatus"))
	private TbCatEstatus tbCatEstatus;

	@Column(name = "tituloSLA", length = 80)
	private String tituloSLA;

	@Column(name = "descripcion", length = 250)
	private String descripcion;

	@Column(name = "slaUtilizado")
	private Integer slaUtilizado;

	@Column(name = "totalPuntasConfiguradas")
	private Long totalPuntasConfiguradas;

	@Column(name = "totalInterfacesConfiguradas")
	private Long totalInterfacesConfiguradas;

	@Column(name = "indicaPlantilla")
	private Integer indicaPlantilla;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbConfiguracionSLA_TbUsuario_CreadoPor"))
	private TbUsuario creadoPor;

	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDateTime fechaActualizacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", foreignKey = @ForeignKey(name = "FK_TbConfiguracionSLA_TbUsuario_ActualizadoPor"))
	private TbUsuario actualizadoPor;

}
