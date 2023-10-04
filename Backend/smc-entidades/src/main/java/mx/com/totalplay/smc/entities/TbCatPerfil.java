package mx.com.totalplay.smc.entities;

import java.time.LocalDate;

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
@Table(name = "CatPerfiles")
public class TbCatPerfil {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idCatPerfiles")
	private Integer idCatPerfil;

	@Column(name = "descripcion", length = 45)
	private String descripcion;

	@Column(name = "informacion", length = 255)
	private String informacion;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatEstatus", nullable = false, foreignKey = @ForeignKey(name = "FK_TbCatPerfiles_TbCatEstatus"))
	private TbCatEstatus tbCatEstatus;

	@Column(name = "imagen", length = 45)
	private String imagen;
	
	@Column(name = "tipo", length = 1)
	private String tipo;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbCatPerfiles_TbUsuario_CreadorPor"))
	private TbUsuario creadoPor;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDate fechaCreacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", foreignKey = @ForeignKey(name = "FK_TbCatPerfiles_TbUsuario_ActualizadoPor"))
	private TbUsuario actualizadoPor;

	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDate fechaActualizacion;

	@JsonIgnore
	@Column(name = "fechaBaja")
	private LocalDate fechaBaja;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "eliminadoPor", foreignKey = @ForeignKey(name = "FK_TbCatPerfiles_TbUsuario_EliminadoPor"))
	private TbUsuario eliminadoPor;

}
