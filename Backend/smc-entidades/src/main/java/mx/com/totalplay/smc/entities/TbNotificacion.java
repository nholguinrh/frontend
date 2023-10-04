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
@Table(name = "Notificaciones")
public class TbNotificacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idNotificaciones")
	private Long idNotificacion;

	@Column(name = "titulo", length = 60)
	private String titulo;

	@Column(name = "descripcion", length = 255)
	private String descripcion;

	@Column(name = "tipoNotificacion", length = 1)
	private char tipoNotificacion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idCatProcesos", foreignKey = @ForeignKey(name = "FK_TbNotificacion_TbCatProceso"))
	private TbCatProceso tbCatProceso;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatEstatus", nullable = false, foreignKey = @ForeignKey(name = "FK_TbNotificacion_TbCatEstatus"))
	private TbCatEstatus tbCatEstatus;

	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@Column(name = "fechaLectura")
	private LocalDateTime fechaLectura;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbNotificacion_TbUsuario"))
	private TbUsuario creadoPor;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idParametrosUrl", foreignKey = @ForeignKey(name = "FK_TbNotificacion_TbParametroUrl"))
	private TbParametroUrl tbParametroUrl;

}
