package mx.com.totalplay.smc.entities;

import java.time.LocalDateTime;

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
@Table(name = "UsuariosAccesosDirectos")
public class TbUsuarioAccesoDirecto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idUsuariosAccesosDirectos")
	private Long idUsuarioAccesoDirecto;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "paraUsuario", nullable = false, foreignKey = @ForeignKey(name = "FK_TbUsuarioAccesoDirecto_TbUsuario_Para"))
	private TbUsuario paraUsuario;

	@Column(name = "orden")
	private Integer orden;

//	@Column(name = "accesoDirecto")
//	private Long accesoDirecto;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "accesoDirecto", nullable = false, foreignKey = @ForeignKey(name = "FK_TbUsuarioAccesoDirecto_TbCatAccesoDirecto"))
	private TbCatAccesoDirecto accesoDirecto;

	@JsonIgnore
	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

}
