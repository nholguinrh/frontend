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

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "NotificacionesUsuarios")
public class TbNotificacionUsuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idNotificacionesUsuarios")
	private Long idNotificacionUsuario;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idNotificaciones", nullable = false, foreignKey = @ForeignKey(name = "FK_TbNotificacionUsuario_TbNotificacion"))
	private TbNotificacion tbNotificacion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "destinatario", nullable = false, foreignKey = @ForeignKey(name = "FK_TbNotificacionUsuario_TbUsuario"))
	private TbUsuario destinatario;

	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@Column(name = "fechaLectura")
	private LocalDateTime fechaLectura;

	@Column(name = "activoInactivo")
	private Boolean activoInactivo;
	
	@Column(name = "leidoNoleido")
	private Boolean leidoNoleido;

}
