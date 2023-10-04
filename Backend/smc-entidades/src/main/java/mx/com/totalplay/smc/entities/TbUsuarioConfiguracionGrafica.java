package mx.com.totalplay.smc.entities;

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
@Table(name = "UsuarioConfiguracionGraficas")
public class TbUsuarioConfiguracionGrafica {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idUsuarioConfiguracionGraficas")
	private Integer idUsuarioConfiguracionGrafica;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idUsuarioConfigDashboard", nullable = false, 
		foreignKey = @ForeignKey(name = "FK_TbUsuarioConfiguracionGrafica_TbUsuarioConfiguracionDashboard"))
	private TbUsuarioConfiguracionDashboard tbUsuarioConfiguracionDashboard;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idCuadrantesGrafica", foreignKey = @ForeignKey(name = "FK_TbUsuarioConfiguracionGrafica_TbCuadranteGrafica"))
	private TbCuadranteGrafica tbCuadranteGrafica;
}
