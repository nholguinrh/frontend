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
@Table(name = "AsignacionSLAClientes")
public class TbAsignacionSLAClientes {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idAsignacionSLAClientes")
	private Long idAsignacionSLAClientes;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idConfiguracionSLA", nullable = false,
		foreignKey = @ForeignKey(name = "FK_TbAsignacionSLAClientes_TbConfiguracionSLA"))
	private TbConfiguracionSLA tbConfiguracionSLA;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idClientes", nullable = false, 
		foreignKey = @ForeignKey(name = "FK_TbAsignacionSLAClientes_TbCliente"))
	private TbCliente tbCliente;
	
	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, 
		foreignKey = @ForeignKey(name = "FK_TbAsignacionSLAClientes_TbUsuarioCreadorPor"))
	private TbUsuario creadoPor;
	
	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDateTime fechaActualizacion;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", nullable = true, 
		foreignKey = @ForeignKey(name = "FK_TbAsignacionSLAClientes_TbUsuarioActualizadoPor"))
	private TbUsuario actualizadoPor;


}
