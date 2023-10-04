import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { API } from '../configuration/endpoints';
import { Dashboard, Perfil } from '../model/onboarding.model';
import { ServiceResponse } from '../model/service-response';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getPerfiles(){
    return this.http.get<any>(`${API.onboarding.perfiles}`)
        .toPromise();
  }

  getResumen(contrato: string){
    return this.http.get<any>(`${API.onboarding.resumen}` + '?contrato=' + contrato)
        .toPromise();
  }

  getNewResumen(contrato: string){
    return this.http.get<any>(`${API.onboarding.mssmc.resumen}` + '?contrato=' + contrato)
        .toPromise();
  }

  getDashboards(){
    return this.http.get<any>(`${API.onboarding.dashboards}`)
        .toPromise();
  }

  catalogoPerfiles(): Observable<ServiceResponse<Perfil[]>> {
    return this.http.get<ServiceResponse<Perfil[]>>(`${API.admin.catalogos.mssmc.perfiles}`)
    ;
  }

  catalogoDashboard(): Observable<ServiceResponse<Dashboard[]>> {
    return this.http.get<ServiceResponse<Dashboard[]>>(`${API.onboarding.mssmc.dashboards}`);
  }

  emailEquipoCliente(idUsuario:number, body:any): Observable<ServiceResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };

      return this.http
      .post<ServiceResponse<any>>(`${API.admin.clientes.mssmc.emailEquipoCliente}`, body, options)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  eliminarClientePorId(id: number): Observable<any> {
    return this.http
      .delete<any>(`${API.admin.clientes.mssmc.eliminarClientePorId}/{idUsuario}?idUsuario=${id}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  eliminarMiembroPorId(id: number): Observable<any> {
    return this.http
      .put<any>(`${API.admin.clientes.mssmc.eliminarClientePorId}/borradoLogico?idUsuario=${id}`,{})
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerClientePorId(id: number): Observable<ServiceResponse<any>> {
    return this.http
      .get<ServiceResponse<any>>(`${API.admin.clientes.mssmc.obtenerClientePorId}?idUsuario=${id}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerClientes(): Observable<ServiceResponse<any>> {
    return this.http
      .get<ServiceResponse<any>>(`${API.admin.clientes.mssmc.consultarClientes}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerClientesFavoritas(idUsuario: number): Observable<ServiceResponse<any>> {
    return this.http
      .get<ServiceResponse<any>>(`${API.admin.clientes.mssmc.consultarFavoritos}`+ '?idUsuario=' + idUsuario)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  validarEmpresa(idClienteTotalplay: string): Observable<ServiceResponse<any>> {
    return this.http
      .get<ServiceResponse<any>>(`${API.admin.clientes.mssmc.validarEmpresa}`+ '?idClienteTotalplay=' + idClienteTotalplay)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  emailEquipoClienteTotalplayReactivar(idUsuario:number, body:any): Observable<ServiceResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };

      return this.http
      .post<ServiceResponse<any>>(`${API.admin.clientes.mssmc.emailEquipoClienteActualizar}`, body, options)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

}

