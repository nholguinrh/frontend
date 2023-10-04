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
@Table(name = "UsuarioValidacion")
public class TbUsuarioValidacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idUsuarioValidacion")
	private Long idUsuarioValidacion;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idUsuarios", nullable = false, foreignKey = @ForeignKey(name = "FK_TbUsuarioValidacion_TbUsuario"))
	private TbUsuario tbUsuario;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatEstatus", foreignKey = @ForeignKey(name = "FK_TbUsuarioValidacion_TbCatEstatus"))
	private TbCatEstatus tbCatEstatus;

	@Column(name = "tipoValidacion")
	private Integer tipoValidacion;

	@Column(name = "token", length = 6)
	private String token;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

}
