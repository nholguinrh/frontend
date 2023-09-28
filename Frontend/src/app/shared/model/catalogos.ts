export class Catalog{
  id?: string;
  value?: string;
  name?: string;
}

export class RolesTotalplay{
  cveCatRoles?: number;
  descripcion?: string;
  tipoRol?: string;
  activoInactivo?: string;
}

export class Servicios{
  cveCatServicios?: number;
  descripcion?: string;
  idCatServicios?: number;

  selected?: boolean;
}

export class PermisosPaquete{
  id?: number;
  nombre?: string;
  descripcion?: string;
  estatus?: boolean;
}
