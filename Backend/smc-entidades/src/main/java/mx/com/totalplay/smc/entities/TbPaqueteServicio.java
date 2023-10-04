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
@Table(name = "PaqueteServicios")
public class TbPaqueteServicio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idPaqueteServicios")
	private Integer idPaqueteServicio;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idCatPaquetes", foreignKey = @ForeignKey(name = "FK_TbPaqueteServicio_TbCatPaquete"))
	private TbCatPaquete tbCatPaquete;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idCatServicios", foreignKey = @ForeignKey(name = "FK_TbPaqueteServicio_TbCatServicio"))
	private TbCatServicio tbCatServicio;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbPaqueteServicio_TbUsuario_CreadoPor"))
	private TbUsuario creadoPor;

}
