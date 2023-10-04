package mx.com.totalplay.smc.entities;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
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
@Table(name = "vclientes")
@IdClass(VClientesId.class)
public class TbVClientes {

	@Id
	@Column(name = "idClientes")
	private Long idClientes;

	@Column(name = "idEmpresa", length = 200)
	private String idEmpresa;
	
	@Column(name = "fechaActivacion")
	private LocalDateTime fechaActivacion;

}
