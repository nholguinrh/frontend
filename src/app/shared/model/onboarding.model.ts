import { Estatus, Paquete } from "./cliente.model";

export class Perfil{
    descripcion?: string;
    idCatPerfil?: number;
    imagen?: string;
    informacion?: string;
    tbCatEstatus?: Estatus;
    tipo?: string;

    selected?: boolean;
}

export class Resumen{
    suscripcion?: string;
    renovacion?: string;
    beneficios?: string[];
    noContrato?: string;
    paquete?: Paquete;
}

export class Dashboard{
    descripcion?: string;
    informacion?: string;
    icono?: string;
    recommended?: boolean;
    idDashboard?: number;
    tbCatEstatus?: Estatus;
    
    selected?: boolean;
}
