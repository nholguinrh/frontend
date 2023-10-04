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
@Table(name = "ConfiguracionImagenes")
public class TbConfiguracionImagen {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idConfiguracionImagenes")
	private Long idConfiguracionImagen;

	@Column(name = "tipoConfiguracion", length = 1)
	private String tipoConfiguracion;

	@Column(name = "fileName", length = 45)
	private String fileName;

	@Column(name = "path", length = 100)
	private String path;

	@Column(name = "ipServer", length = 200)
	private String ipServer;

}
