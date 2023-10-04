package mx.com.totalplay.smc.entities;

import java.time.LocalDate;

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
@Table(name = "Parametros")
public class TbParametros {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "idParametro")
	private String idParametro;

	@Column(name = "descripcion", length = 200)
	private String descripcion;

	@Column(name = "valor", length = 400)
	private String valor;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDate fechaCreacion;

}
