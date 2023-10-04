import { Estatus } from "./estatus";

export interface Perfil {
  idCatPerfil: number;
  descripcion: string;
  informacion: string;
  tbCatEstatus: Estatus;
  imagen: string;
}
