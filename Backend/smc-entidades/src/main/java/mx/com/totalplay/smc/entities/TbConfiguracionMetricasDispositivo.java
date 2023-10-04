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
@Table(name = "ConfiguracionMetricasDispositivo")
public class TbConfiguracionMetricasDispositivo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idMetricasGeneralesPorDispositivo")
	private Long idMetricasGeneralesPorDispositivo;

	@Column(name = "status")
	private boolean status;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idMetricas", foreignKey = @ForeignKey(name = "FK_TbConfiguracionMetricasDispositivo_TbMetrica"))
	private TbMetrica tbMetrica;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "cveTipoDispositivo", foreignKey = @ForeignKey(name = "FK_TbConfiguracionMetricasDispositivo_TbTipoDispositivo"))
	private TbTipoDispositivo tbTipoDispositivo;

	@Column(name = "metrica_default")
	private boolean metricaDefault;
	
}
