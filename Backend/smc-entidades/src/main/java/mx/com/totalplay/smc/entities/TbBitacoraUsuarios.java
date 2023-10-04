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

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "BitacoraUsuarios")
public class TbBitacoraUsuarios {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "idBitacoraUsuarios")
	private Long idBitacoraUsuario;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "idClientes", foreignKey = @ForeignKey(name = "FK_TbBitacoraUsuarios_TbCliente"))
	private TbCliente tbCliente;

	@Column(name = "Funcionalidad", length = 80)
	private String funcionalidad;

	@Column(name = "tipoOperacion", length = 45)
	private String tipoOperacion;

	@Column(name = "datos", length = 255)
	private String datos;

	@Column(name = "fechaCreacion")
	private LocalDateTime fechaCreacion;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "creadoPor", nullable = false, foreignKey = @ForeignKey(name = "FK_TbBitacoraUsuarios_TbUsuario_CreadorPor"))
	private TbUsuario creadoPor;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "operadoPor", foreignKey = @ForeignKey(name = "FK_TbBitacoraUsuarios_TbUsuario_OperadoPor"))
	private TbUsuario operadoPor;
	
	@Column(name = "IPDispositivo", length = 45)
	private String ipDispositivo;
}
