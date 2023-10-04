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
@Table(name = "CatProcesos")
public class TbCatProceso {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idCatProcesos")
	private Integer idCatProceso;

	@Column(name = "descripcion", length = 255)
	private String descripcion;

	@Column(name = "url", length = 255)
	private String url;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbCatProceso_TbUsuario_CreadorPor"))
	private TbUsuario creadoPor;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", foreignKey = @ForeignKey(name = "FK_TbCatProceso_TbUsuario_ActualizadoPor"))
	private TbUsuario actualizadoPor;

	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDateTime fechaActualizacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "eliminadoPor", foreignKey = @ForeignKey(name = "FK_TbCatProceso_TbUsuario_EliminadoPor"))
	private TbUsuario eliminadoPor;

	@JsonIgnore
	@Column(name = "fechaBaja")
	private LocalDateTime fechaBaja;

}
