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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "UsuarioAdmFavs")
public class TbUsuarioAdmFav {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idFavs")
	private Integer idFav;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "idClientes", nullable = false, foreignKey = @ForeignKey(name = "FK_TbUsuarioAdmFavs_TbCliente"))
	private TbCliente tbCliente;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idUsuarios", nullable = false, foreignKey = @ForeignKey(name = "FK_TbUsuarioAdmFavs_TbUsuario"))
	private TbUsuario tbUsuario;

}
