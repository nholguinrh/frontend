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
@Table(name = "MetricasDispositivos")
public class TbMetricaDispositivo {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idMetricasDispositivos")
	private Integer idMetricasDispositivos;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idMetricas", foreignKey = @ForeignKey(name = "FK_TbMetricasDispositivos_TbMetricas"))
	private TbMetrica tbMetrica;
	
	@Column(name = "tipoDispositivo", length = 45)
	private String tipoDispositivo;
	
	@Column(name = "aplica")
	private Boolean aplica;

}
