export interface PromedioMetricasRequest {
  fechaInicio: string;
  fechaFin: string;
  idEmpresa: number;
  idServicio: string;
  idDispositivo: string;
  tipoDispositivo: string;
  folioTicket: string;
  folioTicketExterno: string;
  metrica: string;
  tiempo: string;
  ipNs: string;
  funcionalidad: string;
  full: boolean;
  agruparPor? : string;
}
