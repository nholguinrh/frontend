import { TipoTicket } from '../interfaces/tipo-ticket';
import { Servicios } from './catalogos';
import { Dashboard } from './onboarding.model';

export class Option {
  tittle?: string;
  image?: string;
  selected?: boolean;
  recommended?: boolean;
  uid?: string;
}

export class Cliente {
  contrato?: string;
  email?: string;
  fechaContratacion?: string;
  idCliente?: number;
  idClienteTotalPlay?: string;
  indicadorFavorito?: number;
  ipClienteRegistro?: string;
  numeroUsuarios?: string;
  observaciones?: string;
  pwd?: string;
  razonSocial?: string;
  representante?: string;
  rfc?: string;
  tbCatEstatus?: Estatus;
  tbCatPaquete?: Paquete;
  creadoPor?: Usuario;
  telefonoCelular?: string;
  telefonoFijo?: string;
  totalPuntas?: number;
  enlacesContratados?: number;
  sitiosContratados?: number;
  serviciosContratados?: number;
  direccionIP?: string = '';
  idClientes?: 0;
  idCatEstatus?: 0;
  idUsuario?: number;
  idClienteString?: string;
  idClienteUsuarios?: number;

  nombreAdmin?: string;
  servicio?: string;
  punta?: string;
  historicoPerformance?: HistoricoPerformance;
  sector: Sector;
  tipoTickets?: TipoTickets;
  bandejaSD?: BandejaSD;
  origenNombre?: OrigenNombre;

  /* Detalle Cliente */
  actualizadoPor?: string;
  eliminadoPor?: number;
  estatus?: Estatus;
  id?: number;
  idEmpresa?: string;
  paquete?: Paquete;
  puntasActivas?: number;
  detalle?: string;
  favorito?: boolean;
  fechaActualizacion?: string;
  fechaBaja?: string;
  fechaCreacion?: string;
  celular?: string;
  servicios?: Servicios[];
  puntas?: Punta[];
  tipo?: string;
}

export class AccesoDirecto {
  activoInactivo?: string;
  descripcion?: string;
  icono?: string;
  idCatAccesoDirecto?: number;
  path?: string;
  predeterminado?: number;
  tipoAcceso?: string;
}

export class Estatus {
  descripcion?: string;
  idCatEstatus?: number;
  tipoEstatus?: string;
  fechaCreacion?: string;
  estatus?: boolean;
}

export class Paquete {
  cantidadUsuarios?: number;
  descripcion?: string;
  idCatPaquete?: number;
  informacion?: string;
  fechaCreacion?: string;
  creadoPor?: Usuario;
  fechaActualizacion?: string;
  actualizadoPor?: Usuario;
  fechaBaja?: string;
  idCatPaquetes?: number;
  estatus?: boolean;
}

export class Perfil {
  descripcion?: string;
  idCatPerfil?: number;
  imagen?: string;
  informacion?: string;
  tbCatEstatus?: Estatus;
  tipo?: string;
  creadoPor?: string;
  fechaCreacion?: string;
  actualizadoPor?: string;
  fechaActualizacion?: string;
  fechaBaja?: string;
  eliminadoPor?: Usuario;
}

export class Proceso {
  idCatProceso?: number;
  descripcion?: string;
  url?: string;
}

export class OrigenNombre {
  descripcion?: string;
  idCatOrigenNombre?: number;
}

export class HistoricoPerformance {
  idCatHistoricoPerformance?: number;
  unidad?: string;
  valor?: number;
}

export class Sector {
  descripcion?: string;
  idCatSector?: number;
}

export interface Servicio {
  descripcion?: string;
  idCatServicios?: number;
}

export class TipoTickets {
  descripcion?: string;
  idCatTipoTicket?: number;
}

export class BandejaSD {
  descripcion?: string;
  idCatBandejaSD?: number;
}

export class DetalleCliente {
  cliente?: Cliente;
  configuracion?: Configuracion;
  punta?: Punta[];
  servicios?: Servicio[];
  usuario?: any[];
}

export class Configuracion {
  idClienteConfiguracion?: number;
  tbCliente?: Cliente;
  tiempoHistorico?: number;
  bandejaHistorico?: string;
  tbCatHistoricoPerformance?: HistoricoPerformance;
  tipoTicketsS?: string;
  origenTicket?: string;
  tbCatTipoTicket?: TipoTicket;
  tbCatSector?: Sector;
  tbCatOrigenNombre?: OrigenNombre;
  tbCatBandejaSD?: BandejaSD;
  fechaCreacion?: string;
  creadoPor?: Usuario;
  fechaActualizacion?: string;
  actualizadoPor?: Usuario;
  fechaBaja?: string;
  eliminadoPor?: Usuario;
}

export class Punta {
  active?: boolean;
  type?: number;
  ip?: string;
  interfacesActivas?: string;
  slaPunta?: string;
  tipo?: string;
  monitoreo?: boolean;
  idClientePunta?: number;
  tbCliente?: Cliente;
  tbCatEstatus?: Estatus;
  tbConfiguracionSLA?: ConfiguracionSLA;
  enlace?: string;
  ipns?: string;
  sitio?: string;
  alias?: string;
  posicion?: number;
  nodoCentral?: number;
  tipoPunta?: string;
  activarPunta?: boolean;
  latitud?: number;
  longitud?: number;
  estado?: string;
  numeroInterfaces?: number;
}

export class Interface {
  idPuntaInterfaz?: number;
  tbClientePunta?: string;
  tbCatEstatus?: Estatus;
  tbConfiguracionSLA?: ConfiguracionSLA;
  interfaz?: string;
  alias?: string;
  activarInterfaz?: boolean;
  tipoServicios?: string;
}

export class Usuario {
  codigoVerificacion?: string;
  email?: string;
  emailPromotor?: string;
  fechaCreacion?: string;
  idUsuario?: number;
  nombreCompleto?: string;
  tbCatEstatus?: Estatus;
  tbCatPerfil?: Perfil;
  tbCatRol: Rol;
  reenvioPwd?: number;
  pwd?: string;
}

export class Rol {
  activoInactivo?: string;
  descripcion?: string;
  idCatRol?: number;
  tipoRol?: string;
}

export class Notification {
  titulo?: string;
  mensaje?: string;
  fullmensaje?: string;
  fecha?: string;
  hora?: string;
  cliente?: string;
  action?: boolean;
  status?: number;
  descripcion?: string;
  tipoNotificacion?: string;
}

export class Estadistica {
  name?: string;
  value?: string;
  change?: string;
  estatus?: number;
  minimo?: number;
  maximo?: number;
}

export class ConfiguracionSLA {
  idConfiguracionSLA?: number;
  tbCatEstatus?: Estatus;
  tituloSLA?: string;
  descripcion?: string;
  slaUtilizado?: number;
  totalPuntasConfiguradas?: number;
  totalInterfacesConfiguradas?: number;
  indicaPlantilla?: number;
}

export class LoginContrato {
  fechaExpPwd?: string;
  idClienteUsuario?: number;
  tbCliente?: Cliente;
  tbDashboard?: Dashboard;
  tbUsuario?: Usuario;
  tbCatPerfil?: Perfil;
}

export class Metrica {
  idMetrica?: number;
  metrica?: string;
  tipoMetrica?: string;
  informacion?: string;

  selected?: boolean;
}

export class Tiempo {
  idMetrica?: number;
  value?: string;
  time?: number;
}

export class DetallePunta {
  punta?: Punta;
  interfaces?: Interface[];
  date?: string;
  activacion?: boolean;
}

export class PlantillaSLA {
  idConfiguracionSLA?: number;
  tbCatEstatus?: Estatus;
  tituloSLA?: string;
  descripcion?: string;
  slaUtilizado?: number;
  totalPuntasConfiguradas?: number;
  totalInterfacesConfiguradas?: number;
  indicaPlantilla?: string;
}

export class DatosPunta {
  cliente?: string;
  totalPuntas?: number;
  totalPuntasActivas?: number;
  totalInterfaces?: number;
  totalInterfacesActivas?: number;
  totalEnlaces?: number;
  totalEnlacesActivos?: number;
  totalPuntasConfiguradas?: number;
  totalInterfacesConfiguradas?: number;
}

export interface PropiedadConColor {
  name: string;
  value: number;
  color: string;
}
