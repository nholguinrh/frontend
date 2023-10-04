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
@Table(name = "CatAccesosDirectos")
public class TbCatAccesoDirecto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idCatAccesosDirectos")
	private Long idCatAccesoDirecto;

	@Column(name = "descripcion", length = 200)
	private String descripcion;

	@Column(name = "predeterminado")
	private Integer predeterminado;

	@Column(name = "path", length = 200)
	private String path;

	@Column(name = "activoInactivo", length = 1)
	private String activoInactivo;

	@Column(name = "icono", length = 45)
	private String icono;
	
	@Column(name = "tipoAcceso", length = 45)
	private String tipoAcceso;

}
