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
@Table(name = "Metricas")
public class TbMetrica {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idMetricas")
	private Integer idMetrica;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idCatEstatus", foreignKey = @ForeignKey(name = "FK_TbMetrica_TbCatEstatus"))
	private TbCatEstatus tbCatEstatus;

	@Column(name = "metrica", length = 45)
	private String metrica;

	@Column(name = "tipoMetrica", length = 10)
	private String tipoMetrica;

	@Column(name = "informacion", length = 45)
	private String informacion;

	@Column(name = "clasificacion", length = 10)
	private String clasificacion;
	
}
