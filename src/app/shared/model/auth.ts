import { Perfil } from "./onboarding.model";

export class Auth {
  idInfoTrabajador?: string;
  password?: string;
  contrato?: string;
  email?: string;

  nombre?: string;
  usuario?: number;
}

export class AdministratorLoginModel {
  email?: string;
  fechaCreacion?: string;
  idCatEstatus?: number;
  idCatRoles?: number;
  idCliente?: number;
  idClienteUsuarios?: number;
  idUsuario?: number;
  nombreCompleto?: string;
  perfil?: string;
  tbCatPerfil?: Perfil;
  idClienteTotalplay: number;
}