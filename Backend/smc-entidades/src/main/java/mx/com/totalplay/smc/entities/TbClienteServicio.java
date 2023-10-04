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
@Table(name = "ClienteServicios")
public class TbClienteServicio {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idClienteServicios")
	private Integer idClienteServicio;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idCatServicios", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteServicio_TbCatServicio"))
	private TbCatServicio tbCatServicio;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idClientes", nullable = false, foreignKey = @ForeignKey(name = "FK_TbClienteServicio_TbCliente"))
	private TbCliente tbCliente;

}
