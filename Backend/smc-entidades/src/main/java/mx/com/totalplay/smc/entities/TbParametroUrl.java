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
@Table(name = "ParametrosUrl")
public class TbParametroUrl {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idParametrosUrl")
	private Long idParametrosUrl;

	@Column(name = "descripcion", length = 100)
	private String descripcion;

	@Column(name = "accion", length = 45)
	private String accion;

	@Column(name = "servidorIp", length = 20)
	private String servidorIp;

	@Column(name = "path", length = 150)
	private String path;

	@Column(name = "parametros", length = 255)
	private String parametros;

	@Column(name = "tipoServicio", length = 45)
	private String tipoServicio;

}
