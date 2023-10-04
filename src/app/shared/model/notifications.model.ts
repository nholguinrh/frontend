export class Notifications{
  idNotificacion: number;
  titulo: string;
  descripcion: string;
  tipoNotificacion: string;
  tbCatProceso: any;
  tbCatEstatus: Estatus;
  fechaCreacion: string;
  fechaLectura: any;
  tbParametroUrl: any;
  fecha?: any;
  hora?: any;
}


export class Estatus {
  idCatEstatus: number;
  descripcion: string;
  tipoEstatus: string;
}
