import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API } from '../configuration/endpoints';
import { ServiceResponse } from '../model/service-response';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http: HttpClient) { }

  consultarNotificaciones(idUsuario: number, estatus: string): Observable<ServiceResponse<any>> {
    return this.http
      .get<ServiceResponse<any>>(`${API.notification.mssmc.consultarEstatus}?idUsuario=${idUsuario}&estatus=${estatus}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  actualizasEstatusNotificacion(idUsuario: number, idNotificacion: number): Observable<ServiceResponse<any>> {
    return this.http
      .put<ServiceResponse<any>>(`${API.notification.mssmc.actualizarEstatusNotificacion}?idUsuario=${idUsuario}&idNotificacion=${idNotificacion}`,{})
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  borrarNotificacion(idUsuario: number, idNotificacion: number): Observable<ServiceResponse<any>> {
    return this.http
      .delete<ServiceResponse<any>>(`${API.notification.mssmc.borrarNotificacion}?idUsuario=${idUsuario}&idNotificacion=${idNotificacion}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  crearNotificacion(idUsuario: number, usuarioType: string, body: any, idCliente?:number): Observable<ServiceResponse<any>> {
    return this.http
      .post<ServiceResponse<any>>(`${API.notification.mssmc.crearNotificacion}?idUsuario=${idUsuario}&usuarioType=${usuarioType}&idCliente=${idCliente}`,body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  crearNotificacionMasiva(idUsuario: number, usuarioType: string, body: any): Observable<ServiceResponse<any>> {
    return this.http
      .post<ServiceResponse<any>>(`${API.notification.mssmc.crearNotificacion}?idUsuario=${idUsuario}&usuarioType=${usuarioType}`,body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  contarNotificaciones(idUsuario: number): Observable<ServiceResponse<any>> {
    return this.http
      .get<ServiceResponse<any>>(`${API.notification.mssmc.contarNoLeidas}?idUsuario=${idUsuario}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  crearNotificacionAutomatica(idUsuario: number, body: any): Observable<ServiceResponse<any>> {
    return this.http
      .post<ServiceResponse<any>>(`${API.notification.mssmc.crearNotificacionAutomatica}?idUsuario=${idUsuario}`,body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  actualizarNotificacionesAccion(idCliente: number): Observable<ServiceResponse<any>> {
    return this.http
      .get<ServiceResponse<any>>(`${API.notification.mssmc.actualizarNotificacionesAccion}?idCliente=${idCliente}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  buscarNotificaciones(idUsuario: number,texto: string,tipo: number): Observable<ServiceResponse<any>> {
    return this.http
      .get<ServiceResponse<any>>(`${API.notification.mssmc.buscarNotificaciones}?idUsuario=${idUsuario}&busqueda=${texto}&leidoNoleido=${tipo}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  crearNotificacionGeneral(idUsuario: number, body: any): Observable<ServiceResponse<any>> {
    return this.http
      .post<ServiceResponse<any>>(`${API.notification.mssmc.crearNotificacionGeneral}?idUsuario=${idUsuario}`,body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }
}
