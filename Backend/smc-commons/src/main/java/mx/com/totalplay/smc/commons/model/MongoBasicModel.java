package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MongoBasicModel {

	private String idEmpresa;
	private String funcionalidad;
	private String idDispositivo;
	private Rq rq;
	private GenericResponseAPI rs;

	@Getter
	@Setter
	@Builder
	@AllArgsConstructor
	@NoArgsConstructor
	static public class Rq {
		private String idEmpresa;
	}
}
