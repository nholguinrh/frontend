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
@Table(name = "ConfiguracionSLAMetricas")
public class TbConfiguracionSLAMetrica {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idConfiguracionSLAMetricas")
	private Long idConfiguracionSLAMetrica;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idConfiguracionSLA", nullable = false, foreignKey = @ForeignKey(name = "FK_TbConfiguracionSLAMetrica_TbConfiguracionSLA"))
	private TbConfiguracionSLA tbConfiguracionSLA;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idMetricas", nullable = false, foreignKey = @ForeignKey(name = "FK_TbConfiguracionSLAMetrica_TbMetrica"))
	private TbMetrica tbMetrica;

	@Column(name = "valor", length = 10)
	private String valor;

}
