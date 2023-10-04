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
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "Clientes")
public class TbCliente {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idClientes")
	private Long idCliente;

	@ManyToOne
	@JoinColumn(name = "idCatPaquetes", foreignKey = @ForeignKey(name = "FK_TbCliente_TbCatPaquetes"))
	private TbCatPaquete tbCatPaquete;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatEstatus", foreignKey = @ForeignKey(name = "FK_TbCliente_TbCatEstatus"))
	private TbCatEstatus tbCatEstatus;

	@Column(name = "razonSocial", length = 255)
	private String razonSocial;

	@Column(name = "representante", length = 80)
	private String representante;

	@Column(name = "email", length = 100)
	private String email;

	@Column(name = "telefonoCelular")
	private String telefonoCelular;

	@Column(name = "telefonoFijo")
	private String telefonoFijo;

	@Column(name = "contrato")
	private String contrato;

	@Column(name = "totalPuntas")
	private Integer totalPuntas;

	@Column(name = "observaciones", length = 255)
	private String observaciones;

	@Column(name = "indicadorFavorito")
	private Integer indicadorFavorito;

	@Column(name = "rfc", length = 13)
	private String rfc;

	@Column(name = "fechaContratacion")
	private LocalDateTime fechaContratacion;

	@Column(name = "ipClienteRegistro", length = 15)
	private String ipClienteRegistro;

	@Column(name = "numeroUsuarios")
	private Integer numeroUsuarios;

	@Column(name = "idClienteTotalPlay", length = 45)
	private String idClienteTotalPlay;
	
	@JsonIgnoreProperties(allowSetters = true)
	@Column(name = "pwdTotalplay", length = 200)
	private String pwd;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", foreignKey = @ForeignKey(name = "FK_TbCliente_TbUsuario_CreadorPor"))
	private TbUsuario creadoPor;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", foreignKey = @ForeignKey(name = "FK_TbCliente_TbUsuario_ActualizadoPor"))
	private TbUsuario actualizadoPor;

	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDateTime fechaActualizacion;

	@JsonIgnore
	@Column(name = "fechaBaja")
	private LocalDateTime fechaBaja;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "eliminadoPor", foreignKey = @ForeignKey(name = "FK_TbCliente_TbUsuario_EliminadoPor"))
	private TbUsuario eliminadoPor;
	
	@Column(name = "enlacesContratados")
	private Integer enlacesContratados;
	
	@Column(name = "sitiosContratados")
	private Integer sitiosContratados;
	
	@Column(name = "serviciosContratados")
	private Integer serviciosContratados;

}
