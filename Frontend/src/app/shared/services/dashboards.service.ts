import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { API } from '../configuration/endpoints';
import { NAV } from '../configuration/navegacion';
import { catchError, map, tap } from 'rxjs/operators';
import { ServiceResponse } from '../model/service-response';
import { Empresa } from '../model/externos.model';
import { PromedioMetricasRequest } from '../interfaces/promedio-metricas-request';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient, private router: Router) {}

  

  monitoreoEnlaceVistaGenereal(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.monitoreoEnlaces.vistaGeneral}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoEnlacesAfectaciones(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${API.dashboards.monitoreoEnlaces.afectacionesRecientes}`,
        request
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoEnlacesPromedio(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.monitoreoEnlaces.promedioTickets}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoEnlacesServicios(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${API.dashboards.monitoreoEnlaces.promedioServicios}`,
        request
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoEnlacesTicketsPunta(
    empresa: any,
    dispositivo: any
  ): Observable<any> {
    return this.http
      .get<any>(
        `${API.dashboards.monitoreoEnlaces.ticketsPunta}/${empresa}/${dispositivo}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  workspaceHistoricoMetricas(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${API.dashboards.monitoreoEnlaces.historicoMetricas}`,
        request
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoEjecutioRendimiento(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.monitoreoEjecutivo.rendimiento}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoEjecutivoAfectaciones(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${API.dashboards.monitoreoEjecutivo.afectacionesInalcanzables}`,
        request
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoEjecutivoPromedioMetricas(
    request: Partial<PromedioMetricasRequest>
  ): Observable<any> {
    return this.http
      .post(`${API.dashboards.monitoreoEjecutivo.promedioDeMetricas}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoEjecutivoPromedioResolucion(
    request: Partial<PromedioMetricasRequest>
  ): Observable<any> {
    return this.http
      .post(`${API.dashboards.monitoreoEjecutivo.promedioResolucion}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoMapaCrearTicket(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.monitoreoMapa.crearTicket}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  workspaceTicketsCliente(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.workspace.ticketsCliente}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  workspaceCrearTicket(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.monitoreoMapa.crearTicketExterno}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerDashboard(idUsuario: number): Observable<any> {
    return this.http
      .get<any>(`${API.dashboards.obtenerDashboard}?idUsuario=${idUsuario}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  personalizarDashboard(
    idUsuario: number,
    idDashboard: number,
    aspecto: string
  ): Observable<any> {
    return this.http
      .put<any>(
        `${API.dashboards.personalizarDashboard}?idUsuario=${idUsuario}&idDashboard=${idDashboard}&aspecto=${aspecto}`,
        {}
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  recuperarDashboardPaquete(idUsuario: number): Observable<any> {
    return this.http
      .get<any>(
        `${API.dashboards.recuperarDashboardPaquete}?idUsuario=${idUsuario}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  recuperarCuadranteDashboard(
    idUsuario: number,
    idDashboard: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${API.dashboards.recuperarCuadranteDashboard}/${idUsuario}/${idDashboard}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  actualizarCuadranteDashboard(body: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.actualizarCuadranteDashboard}`, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoEnlaceTicketsIncidentes(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.monitoreoEnlaces.ticketsPunta}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerTicketEspacioTrabajo(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.workspace.obtenerTickets}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerTicketIncidente(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.workspace.obtenerTicket}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerBusquedaPersonalizada(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.workspace.busquedaPersonalizada}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerAfectacionesRecientes(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${API.dashboards.monitoreoEnlaces.afectacionesRecientes}`,
        request
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerDetalleAfectacionesRecientes(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${API.dashboards.monitoreoEnlaces.detalleAfectacionesRecientes}`,
        request
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerEstadisticas(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${API.dashboards.monitoreoEnlaces.obtenerEstadisticas}`,
        request
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerMetricas(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.monitoreoEnlaces.obtenerMetricas}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerHistorico(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.monitoreoEnlaces.obtenerHistorico}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }
  obtenerServiciosInalcanzables(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${API.dashboards.monitoreoMapa.serviciosInalcanzables}`,
        request
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoMapaAfectaciones(request: any): Observable<any> {
    return this.http
      .post<any>(
        `${API.dashboards.monitoreoMapa.afectacionesRecientes}`,
        request
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  monitoreoEnlaceAlarmas(request: any): Observable<any> {
    return this.http
      .post<any>(`${API.dashboards.monitoreoEnlaces.alarmas}`, request)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }
  obtenerMetricasCliente(idCliente: number): Observable<any> {
    return this.http
      .get<any>(`${API.dashboards.metricasCliente}?idCliente=${idCliente}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerTiposDispositivos(idCliente: number): Observable<any> {
    return this.http
      .get<any>(`${API.dashboards.tiposDispositivos}?idCliente=${idCliente}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }


  obtenerLlamadas(body): Observable<any>{
      return this.http
      .post<any>(`${API.dashboards.monitoreoVoz.llamadas}`,body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerMetricasCarrusel(body): Observable<any>{
      return this.http
      .post<any>(`${API.dashboards.monitoreoVoz.voz}`,body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerRendimientoMetrica(body): Observable<any>{
      return this.http
      .post<any>(`${API.dashboards.monitoreoVoz.rendimiento}`,body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerDispositivosVoz(body): Observable<any>{
      return this.http
      .post<any>(`${API.dashboards.monitoreoVoz.dispositivos}`,body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerMetricasVozCliente(idCliente: number): Observable<any> {
    return this.http
      .get<any>(`${API.dashboards.metricasVozCliente}?idCliente=${idCliente}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  personalizaTicket(body: any): Observable<any> {
    return this.http
      .post<any>(
        `${API.dashboards.personalizaTicket}`,
        body
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  personalizaAlias(body): Observable<any> {
    return this.http
      .post<any>(`${API.admin.personalizaAlias}`, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }


}
