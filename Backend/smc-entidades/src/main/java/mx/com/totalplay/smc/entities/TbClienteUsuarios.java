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
@Table(name = "ClienteUsuarios")
public class TbClienteUsuarios {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idClienteUsuarios")
	private Long idClienteUsuario;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idUsuarios", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteUsuarios_TbUsuario"))
	private TbUsuario tbUsuario;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idClientes", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteUsuarios_TbCliente"))
	private TbCliente tbCliente;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatDashboards", foreignKey = @ForeignKey(name = "FK_TbClienteUsuarios_TbDashboard"))
	private TbDashboard tbDashboard;

	@Column(name = "fechaExpPwd")
	private LocalDateTime fechaExpPwd;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteUsuarios_TbUsuario_CreadorPor"))
	private TbUsuario creadoPor;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", foreignKey = @ForeignKey(name = "FK_TbClienteUsuarios_TbUsuario_ActualizadoPor"))
	private TbUsuario actualizadoPor;

	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDateTime fechaActualizacion;

	@JsonIgnore
	@Column(name = "fechaBaja")
	private LocalDateTime fechaBaja;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "eliminadoPor", foreignKey = @ForeignKey(name = "FK_TbClienteUsuarios_TbUsuario_EliminadoPor"))
	private TbUsuario eliminadoPor;

}
