import { Estatus, Perfil } from "./cliente.model";

export class AccesoDirecto {
    idCatAccesoDirecto?: number;
    descripcion?: string;
    predeterminado?: number;
    path?: string;
    activoInactivo?: string;
    icono?: string;
    tipoAcceso?: string;
}

export class UsuarioAccesoDirecto {
    idUsuarioAccesoDirecto?: number;
    paraUsuario?: ParaUsuario;
    orden?: number;
    accesoDirecto?: AccesoDirecto;
}

export class ParaUsuario {
    idUsuario?: number;
    nombreCompleto?: string;
    email?: string;
    tbCatEstatus?: Estatus;
    tbCatPerfil?: Perfil;
    reenvioPwd?: number;
    emailPromotor?: string;
    codigoVerificacion?: string;
}