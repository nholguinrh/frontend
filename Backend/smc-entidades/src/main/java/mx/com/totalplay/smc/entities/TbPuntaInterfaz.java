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
@Table(name = "PuntasInterfaces")
public class TbPuntaInterfaz {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idPuntasInterfaces")
	private Long idPuntaInterfaz;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idClientePuntas", nullable = false, foreignKey = @ForeignKey(name = "FK_TbPuntaInterfaz_TbClientePunta"))
	private TbClientePunta tbClientePunta;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatEstatus", nullable = false, foreignKey = @ForeignKey(name = "FK_TbPuntaInterfaz_TbCatEstatus"))
	private TbCatEstatus tbCatEstatus;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idConfiguracionSLA", foreignKey = @ForeignKey(name = "FK_TbPuntaInterfaz_TbConfiguracionSLA"))
	private TbConfiguracionSLA tbConfiguracionSLA;

	@Column(name = "interfaz", length = 60)
	private String interfaz;

	@Column(name = "alias", length = 80)
	private String alias;

//	@Column(name = "activarInterfaz")
//	private Boolean activarInterfaz;

	@Column(name = "tipoServicios", length = 80)
	private String tipoServicios;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbPuntaInterfaz_TbUsuario_CreadorPor"))
	private TbUsuario creadoPor;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", foreignKey = @ForeignKey(name = "FK_TbPuntaInterfaz_TbUsuario_ActualizadoPor"))
	private TbUsuario actualizadoPor;

	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDateTime fechaActualizacion;

	@JsonIgnore
	@Column(name = "fechaBaja")
	private LocalDateTime fechaBaja;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "eliminadoPor", foreignKey = @ForeignKey(name = "FK_TbPuntaInterfaz_TbUsuario_EliminadoPor"))
	private TbUsuario eliminadoPor;
}
