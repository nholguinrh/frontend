import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { API } from '../configuration/endpoints';
import { NAV } from '../configuration/navegacion';
import { catchError, map, tap } from 'rxjs/operators';
import { ServiceResponse } from '../model/service-response';
import { Empresa } from '../model/externos.model';
import { Constantes } from '../const/date-graph';

@Injectable({
  providedIn: 'root'
})
export class ExternosService {

  constructor(
    private http: HttpClient,
    private router: Router) { 
    
  }

  catalogoEmpresas(busqueda): Observable<ServiceResponse<any[]>> {
    return this.http.get<ServiceResponse<any[]>>(`${API.admin.catalogos.mssmc.empresasPorNombre}/${busqueda}`);
  }

  getEmpresa(id:number): Observable<any> {
    return this.http.get<any>(`${API.admin.catalogos.mssmc.empresas}/${id}`);
  }

  puntas(id:string, idUsuario: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };
    return this.http.get<any>(`${API.admin.catalogos.mssmc.puntas}/${id}`, options);
  }

  catalogoEmpresasJson(): Observable<ServiceResponse<Empresa[]>>{
    return this.http.get<ServiceResponse<Empresa[]>>("./assets/json/empresas.json");
  }

  getEmpresaJson(id:number): Observable<any> {
    return this.http.get<any>("./assets/json/empresa.json");
  }

  actualizarPuntas(id:string, idUsuario: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };
    return this.http.get<any>(`${API.admin.catalogos.mssmc.actualizarPuntas}/${id}/${Constantes.FECHA_ACTUAL_SITIOS}`, options);
  }

}
