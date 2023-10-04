package mx.com.totalplay.smc.commons.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.com.totalplay.smc.commons.model.GenericResponseAPI;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClienteResponseDto extends GenericResponseAPI {

	private String date;
    private String idCliente;
    private String empresa;
    private Long totalPuntas;
    private Integer estatus;
    private Long totalEnlacesContratados;
    private Long totalServiciosContratados;

    public ClienteResponseDto(int httpStatus, String message, String dateTime, String idCliente, String empresa, Long totalPuntas, Integer estatus, Long totalEnlacesContratados, Long totalServiciosContratados) {
        super(httpStatus, message, dateTime, "", 0, 0);
        this.empresa = empresa;
        this.idCliente = idCliente;
        this.totalPuntas = totalPuntas;
        this.estatus = estatus;
        this.totalEnlacesContratados = totalEnlacesContratados ;
        this.totalServiciosContratados = totalServiciosContratados ;
    }
}
