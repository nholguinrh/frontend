package mx.com.totalplay.smc.entities;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "vClientesTotalEquipo")
public class TbVClientesTotalEquipo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idTotalEquipos")
	private Long idTotalEquipos;

	@Column(name = "idEmpresa", length = 45)
	private String idEmpresa;

	@Column(name = "fechaTotalEquipos")
	private LocalDateTime fechaTotalEquipos;

	@JsonIgnore
	@Column(name = "idTipoDispositivo")
	private long idTipoDispositivo;

	@JsonIgnore
	@Column(name = "numeroTotalEquipos")
	private long numeroTotalEquipos;
	
	@Column(name = "estatusDia")
	private int estatusDia;

}
