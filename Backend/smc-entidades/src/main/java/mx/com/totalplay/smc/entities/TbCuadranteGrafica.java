package mx.com.totalplay.smc.entities;

import java.time.LocalDate;
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
@Table(name = "CuadrantesGrafica")
public class TbCuadranteGrafica {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idCuadrantesGrafica")
	private Integer idCuadranteGrafica;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idDashboardCuadrantes", nullable = false, foreignKey = @ForeignKey(name = "FK_TbCuadranteGrafica_TbDashboardCuadrante"))
	private TbDashboardCuadrante tbDashboardCuadrante;
	
	@Column(name = "informacion", length = 200, nullable = false)
	private String informacion;
	
	@Column(name = "tipoGrafica", length = 80)
	private String tipoGrafica;
	
	@Column(name = "imagen", length = 60)
	private String imagen;
	
	@Column(name = "predeterminado", length = 11, nullable = false)
	private String predeterminado;
	
	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbCuadranteGrafica_TbUsuario_CreadorPor"))
	private TbUsuario creadoPor;
	
	@JsonIgnore
	@Column(name = "fechaActualizacion")
	private LocalDate fechaActualizacion;
	
	@JsonIgnore
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "actualizadoPor", foreignKey = @ForeignKey(name = "FK_TbCatPerfiles_TbUsuario_ActualizadoPor"))
	private TbUsuario actualizadoPor;

}
