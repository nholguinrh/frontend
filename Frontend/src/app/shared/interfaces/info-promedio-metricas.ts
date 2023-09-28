import { DateValue } from '../model/date-value';

export interface InfoPromedioMetricas {
  metricas: Metrica[];
}

export interface Metrica {
  metrica: string;
  idMetrica: number;
  porcentaje: number;
  porcentajeMenor: number;
  sla: number;
  barras: DateValue[];
  area: DateValue[];

}
