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
@Table(name = "Usuarios")
public class TbUsuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idUsuarios")
	private Integer idUsuario;

	@Column(name = "nombreCompleto", length = 255)
	private String nombreCompleto;

	@Column(name = "email", length = 100)
	private String email;

	@JsonIgnore
	@Column(name = "pwd", length = 200)
	private String pwd;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatEstatus", nullable = false, foreignKey = @ForeignKey(name = "FK_TbUsuario_TbCatEstatus"))
	private TbCatEstatus tbCatEstatus;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatPerfiles", foreignKey = @ForeignKey(name = "FK_TbUsuario_TbCatPerfil"))
	private TbCatPerfil tbCatPerfil;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@Column(name = "reenvioPwd")
	private int reenvioPwd;

	@Column(name = "email_promotor", length = 100)
	private String emailPromotor;
	
	@Column(name = "codigoVerificacion", length = 45)
	private String codigoVerificacion;

}
