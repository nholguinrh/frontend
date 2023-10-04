package mx.com.totalplay.smc.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
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
@Table(name = "TipoDispositivo")
public class TbTipoDispositivo {

	@Id
	@Column(name = "cve_tipo_dispositivo", length = 45)
	private String cveTipoDispositivo;

	@Column(name = "descripcion", length = 45)
	private String descripcion;

}
