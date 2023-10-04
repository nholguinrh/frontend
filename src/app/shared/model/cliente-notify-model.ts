export class ClienteNotify{
    contrato: string;
    email: string;
    enlacesContratados: number;
    fechaContratacion: string;
    idCliente: number;
    idClienteTotalPlay: number;
    indicadorFavorito: number;
    ipClienteRegistro: string;
    numeroUsuarios: number;
    observaciones: string;
    pwd: string;
    razonSocial: string;
    representante: string;
    rfc: string;
    serviciosContratados: number;
    sitiosContratados: number;
    tbCatEstatus: EstatusNotify;
    tbCatPaquete: PaqueteNotify;
    telefonoCelular: string;
    telefonoFijo: string;
    totalPuntas: number;
}

export class EstatusNotify {
    descripcion: string;
    idCatEstatus: number;
    tipoEstatus: string;
}

export class PaqueteNotify {
    cantidadUsuarios: number;
    descripcion: string;
    idCatPaquete: number;
    informacion: string;
}