package mx.com.totalplay.smc.entities;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode
public class VClientesId implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long idClientes;

	private String idEmpresa;

}
