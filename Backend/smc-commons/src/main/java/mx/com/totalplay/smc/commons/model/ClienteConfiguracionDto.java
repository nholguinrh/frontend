package mx.com.totalplay.smc.commons.model;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ClienteConfiguracionDto {

	private Long idClienteConfiguracion;

	private ClienteDto tbCliente;

	private Integer tiempoHistorico;

	private String bandejaHistorico;
	
	private CatHistoricoPerformanceDto tbCatHistoricoPerformance;

	private String tipoTicketsS;

	private String origenTicket;

	private CatTipoTicketDto tbCatTipoTicket;

	private CatSectorDto tbCatSector;

	private CatOrigenNombreDto tbCatOrigenNombre;

	private CatBandejaSDDto tbCatBandejaSD;

	private LocalDateTime fechaCreacion;

	private UsuarioDto creadoPor;

	private LocalDateTime fechaActualizacion;

	private UsuarioDto actualizadoPor;

	private LocalDateTime fechaBaja;

	private UsuarioDto eliminadoPor;

}
