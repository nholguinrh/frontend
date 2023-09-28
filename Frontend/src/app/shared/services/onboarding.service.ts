import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API } from '../configuration/endpoints';
import { Auth } from '../model/auth';
import { Cliente, LoginContrato } from '../model/cliente.model';
import { CodigoSeguridad } from '../model/codigo-seguridad';
import { ServiceResponse } from '../model/service-response';

@Injectable({
  providedIn: 'root'
})
export class OnBoardignService {

  constructor(private http: HttpClient) { }

  login(auth: Auth): Observable<ServiceResponse<LoginContrato>> {
    const body = {
      contrato: auth.contrato,
      contrasenia: auth.password
    };
    return this.http
      .post<ServiceResponse<LoginContrato>>(API.onboarding.mssmc.registro, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        }) 
      );
  }

  loginAdmin(auth: Auth): Observable<ServiceResponse<LoginContrato>> {
    const body = {
      nombre: auth.nombre,
      contrasenia: auth.password,
      usuario: auth.usuario,
      email: auth.email,
      contrato: 'contrato',
      ip: '123.891.877.123'
    };
    return this.http
      .post<ServiceResponse<LoginContrato>>(API.onboarding.mssmc.loginAdmin, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        }) 
      );
  }

  generarCodigo(email: string): Observable<ServiceResponse<any>> {
    return this.http
      .post<ServiceResponse<any>>(`${API.admin.clientes.mssmc.generarCodigo}?email=${email}`, {})
      .pipe(
        catchError((e) => {
          return throwError(e);
        }) 
      );
  }

  generarCodigoCliente(idCliente: number): Observable<ServiceResponse<any>> {
    return this.http
      .post<ServiceResponse<any>>(`${API.onboarding.mssmc.enviarCodigo}?idCliente=${idCliente}`, {})
      .pipe(
        catchError((e) => {
          return throwError(e);
        }) 
      );
  }

  validarCodigo(codigoSeguridad:CodigoSeguridad) {
    const body = {
      email: codigoSeguridad.correo,
      codigo: codigoSeguridad.codigo
    };

    return this.http
      .post<ServiceResponse<any>>(API.admin.clientes.mssmc.validarCodigo, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  resetPassword(request: any) {
    const body = {
      idUsuario: request.idUsuario,
      contrasenia: request.password
    };
    
    return this.http
      .post<ServiceResponse<any>>(API.onboarding.mssmc.actualizarPassword, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }
  
}
