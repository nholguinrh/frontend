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
@Table(name = "ClientePuntas")
public class TbClientePunta {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idClientePuntas")
	private Long idClientePunta;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idClientes", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClientePunta_TbCliente"))
	private TbCliente tbCliente;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatEstatus", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClientePunta_TbCatEstatus"))
	private TbCatEstatus tbCatEstatus;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idConfiguracionSLA", nullable = true, foreignKey = @ForeignKey(name = "FK_TbClientePunta_TbConfiguracionSLA"))
	private TbConfiguracionSLA tbConfiguracionSLA;

	@Column(name = "enlace", length = 120)
	private String enlace;

	@Column(name = "ipns", length = 80)
	private String ipns;

	@Column(name = "sitio", length = 255)
	private String sitio;

	@Column(name = "alias", length = 60)
	private String alias;

	@Column(name = "posicion")
	private Integer posicion;

	@Column(name = "nodoCentral")
	private Integer nodoCentral;

	@Column(name = "tipoPunta", length = 45)
	private String tipoPunta;

//	@Column(name = "activarPunta")
//	private Boolean activarPunta;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClientePunta_TbUsuario_CreadoPor"))
	private TbUsuario creadoPor;

	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDateTime fechaActualizacion;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", nullable = true,  foreignKey = @ForeignKey(name = "FK_TbClientePunta_TbUsuario_ActualizadoPor"))
	private TbUsuario actualizadoPor;

	@JsonIgnore
	@Column(name = "fechaBaja")
	private LocalDateTime fechaBaja;

	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "eliminadoPor", nullable = true, foreignKey = @ForeignKey(name = "FK_TbClientePunta_TbUsuario_EliminadoPor"))
	private TbUsuario eliminadoPor;
	
	@Column(name = "latitud")
	private Double latitud;
	
	@Column(name = "longitud")
	private Double longitud;
	
	@Column(name = "estado", length = 60)
	private String estado;
	
	@Column(name = "numeroInterfaces")
	private Integer numeroInterfaces;
	
	@Column(name = "interfacesActivas")
	private Integer interfacesActivas;
	
	@Column(name = "idDispositivo")
	private String idDispositivo;

}
