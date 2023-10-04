/**
 * 
 */
package mx.com.totalplay.smc.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
@Table(name = "CatHistoricoPerformance")
public class TbCatHistoricoPerformance {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idCatHistoricoPerformance")
	private Integer idCatHistoricoPerformance;

	@Column(name = "valor")
	private Integer valor;

	@Column(name = "unidad", length = 100)
	private String unidad;
}
