import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LineString } from 'topojson-specification';
import { API } from '../configuration/endpoints';
import { Constantes } from '../const/date-graph';
import {
  Cliente,
  DatosPunta,
  DetallePunta,
  Punta,
} from '../model/cliente.model';
import { PageRequest } from '../model/page.request';
import { ServiceResponse } from '../model/service-response';
import axios from "axios";

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  constructor(private http: HttpClient) {}

  getPerfiles() {
    return this.http.get<any>(`${API.onboarding.perfiles}`).toPromise();
  }

  public getJSON(request: PageRequest<Cliente>) {
    return this.http
      .get('./assets/json/clientes.json')
      .pipe(map((response: any) => response))
      .toPromise();
  }

  public getPuntas(request: PageRequest<Punta>) {
    return this.http
      .get('./assets/json/puntas.json')
      .pipe(map((response: any) => response))
      .toPromise();
  }

  public listarClientes(size: number, page: number) {
    return this.http
      .get<any>(`${API.admin.clientes.listar}` + '?size=' + 5 + '&page=' + page)
      .toPromise();
  }

  public getObject() {
    return this.http
      .get('./assets/json/vista.json')
      .pipe(map((response: any) => response))
      .toPromise();
  }

  getClientes(
    size: number,
    page: number,
    tipo: string,
    idUsuario: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.mssmc.consultarClientes}?page=${page}&size=${size}&tipo=${tipo}&idUsuario=${idUsuario}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  getClientesFavoritos(
    size: number,
    page: number,
    idUsuario: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.mssmc.consultarClientesFavoritos}?page=${page}&size=${size}&sort=&idUsuario=${idUsuario}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  getFilterClientes(
    size: number,
    page: number,
    idUsuario: number,
    body?: any,
  ): Observable<any> {
    return this.http
      .post<any>(
        `${API.admin.mssmc.filtrarClientes}?page=${page}&size=${size}&idUsuarioOpera=${idUsuario}`,
        body
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  getApplyFilterClientes(
    size: number,
    page: number,
    idUsuario: number,
    body?: any
  ): Observable<any> {
    return this.http
      .post<any>(
        `${API.admin.mssmc.aplicarFiltros}?page=${page}&size=${size}&sort=&idUsuario=${idUsuario}`,
        body
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  changeFavorito(
    idUsuario: number,
    idCliente: number,
    favorito: boolean
  ): Observable<any> {
    const body = {
      idUsuario: idUsuario,
      idCliente: idCliente,
      favorito: favorito,
    };

    return this.http
      .post<any>(`${API.admin.clientes.mssmc.favorito}`, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarPuntas(
    size: number,
    page: number,
    idCliente: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.clientes.mssmc.consultarPuntas}?page=${page}&size=${size}&idCliente=${idCliente}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarPuntasPorTipo(
    size: number,
    page: number,
    idCliente: number,
    tipo: string
  ): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.clientes.mssmc.consultarPuntasPorTipo}?page=${page}&size=${size}&idCliente=${idCliente}&tipo=${tipo}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarPuntasPorTexto(
    size: number,
    page: number,
    idCliente: number,
    cadena: string
  ): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.clientes.mssmc.consultarPuntasPorTexto}?page=${page}&size=${size}&idCliente=${idCliente}&cadena=${cadena}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarDetallePunta(
    idClientePunta: number,
    tipo: string
  ): Observable<ServiceResponse<DetallePunta>> {
    return this.http
      .get<ServiceResponse<DetallePunta>>(
        `${API.admin.clientes.mssmc.consultarDetallePuntas}?idClientePunta=${idClientePunta}&tipo=${tipo}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  modificarDetallePunta(
    idUsuario: number,
    detallePunta: DetallePunta
  ): Observable<ServiceResponse<DetallePunta>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      idUsuario: idUsuario.toString(),
    });
    const options = { headers: headers };
    detallePunta.date = Constantes.FECHA_ACTUAL_SITIOS;
    return this.http
      .put<ServiceResponse<DetallePunta>>(
        `${API.admin.clientes.mssmc.puntas}`,
        detallePunta,
        options
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarDatosPunta(
    idCliente: number
  ): Observable<ServiceResponse<DatosPunta>> {
    return this.http
      .get<ServiceResponse<DatosPunta>>(
        `${API.admin.clientes.mssmc.consultarDatosPunta}?idCliente=${idCliente}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarContadorPuntaSLA(
    idCliente: number
  ): Observable<ServiceResponse<DatosPunta>> {
    return this.http
      .get<ServiceResponse<DatosPunta>>(
        `${API.admin.clientes.mssmc.consultarContadorPuntaSLA}?idCliente=${idCliente}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarPuntasSLA(
    size: number,
    page: number,
    idCliente: number,
    tipo: string
  ): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.clientes.mssmc.consultarDatosPuntaSLA}?page=${page}&size=${size}&idCliente=${idCliente}&tipo=${tipo}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarPuntasSLAPorTexto(
    size: number,
    page: number,
    idCliente: number,
    texto: string
  ): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.clientes.mssmc.consultarDatosPuntaSLA}?page=${page}&size=${size}&idCliente=${idCliente}&texto=${texto}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarConfiguracionesSLAPorTexto(body: any): Observable<any> {
    return (
      this.http
        .post<any>(
          `${API.admin.clientes.mssmc.consultarConfiguracionesSLAPorTexto}`,
          body
        )
        //.post<any>(`${API.admin.clientes.mssmc.consultarConfiguracionesSLAPorTexto}?page=0&size=200000&&sort=&cadena=${cadena}`)
        .pipe(
          catchError((e) => {
            return throwError(e);
          })
        )
    );
  }

  consultarConfiguracionesSLA(
    idCliente: number
  ): Observable<ServiceResponse<any>> {
    return this.http
      .get<ServiceResponse<any>>(
        `${API.admin.clientes.mssmc.consultarConfiguracionesSLA}?idCliente=${idCliente}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  activacionMasivaPuntas(
    idUsuario: number,
    activar: boolean,
    idCliente: number
  ): Observable<ServiceResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      idUsuario: idUsuario.toString(),
    });
    const options = { headers: headers };
    return this.http
      .put<ServiceResponse<any>>(
        `${API.admin.clientes.mssmc.activacionMasivaPuntas}?activacion=${activar}&idCliente=${idCliente}&date=${Constantes.FECHA_ACTUAL_SITIOS}`,
        null,
        options
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  configuracionMasivaPuntas(
    idUsuario: number,
    idCliente: number,
    idConfiguracionSLA: number,
    operation: string
  ): Observable<ServiceResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      idUsuario: idUsuario.toString(),
    });
    const options = { headers: headers };
    return this.http
      .put<ServiceResponse<any>>(
        `${API.admin.clientes.mssmc.configuracionMasivaPuntas}?idCliente=${idCliente}&idConfiguracionSLA=${idConfiguracionSLA}&operation=${operation}`,
        null,
        options
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  updatePunta(
    idUsuario: number,
    request: any
  ): Observable<ServiceResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      idUsuario: idUsuario.toString(),
    });
    const options = { headers: headers };
    return this.http
      .put<ServiceResponse<any>>(
        `${API.admin.clientes.mssmc.puntas}`,
        request,
        options
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarEquipoAdminTotalplay(size: number, page: number): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.clientes.mssmc.consultarEquipoAdminTotalplay}?page=${
          page - 1
        }&size=${size}&sort=`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarEquipoAdminTotalplayNombre(
    size: number,
    page: number,
    filter: string
  ): Observable<any> {
    return this.http
      .get<any>(
        `${
          API.admin.clientes.mssmc.administradoresPorNombresEmail
        }/${filter}?page=${page - 1}&size=${size}&sort=`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarEquipoCliente(
    id: number,
    size: number,
    page: number
  ): Observable<any> {
    return this.http
      .get<any>(
        `${
          API.admin.clientes.mssmc.consultarEquipoCliente
        }?idCliente=${id}&page=${page - 1}&size=${size}&sort=`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  emailEquipoAdminTotalplay(
    idUsuario: number,
    body: any
  ): Observable<ServiceResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      idUsuario: idUsuario.toString(),
    });
    const options = { headers: headers };

    return this.http
      .post<ServiceResponse<any>>(
        `${API.admin.mssmc.emailEquipoAdminTotalplay}`,
        body,
        options
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  emailEquipoAdminTotalplayReactivar(
    idUsuario: number,
    body: any
  ): Observable<ServiceResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      idUsuario: idUsuario.toString(),
    });
    const options = { headers: headers };

    return this.http
      .post<ServiceResponse<any>>(
        `${API.admin.mssmc.emailEquipoAdminTotalplayReactivar}`,
        body,
        options
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http
      .get<any>(`${API.admin.clientes.mssmc.obtenerUsuarioPorId}${id}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  reenviarInvitacion(id: number): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.clientes.mssmc.obtenerUsuarioPorId}reenvio-mail?idUsuario=${id}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  eliminarUsuarioPorId(id: number): Observable<any> {
    return this.http
      .delete<any>(`${API.admin.clientes.mssmc.eliminarUsuarioPorId}${id}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  modificarEquipoCliente(id: number, perfil: number): Observable<any> {
    return this.http
      .put<any>(
        `${API.admin.clientes.mssmc.modificarEquipoCliente}?idUsuario=${id}&idCatPerfil=${perfil}`,
        null
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  editarUsuario(request: any, idUsuario: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      idUsuario: idUsuario.toString(),
    });
    const options = { headers: headers };
    return this.http
      .put<any>(
        `${API.admin.clientes.mssmc.obtenerUsuarioPorId}`,
        request,
        options
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarAsignadosSLA(idCliente: number): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.clientes.mssmc.consultarAsignadasSLA}?idCliente=${idCliente}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarConfiguradosSLA(idCliente: number): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.clientes.mssmc.consultarConfiguradasSLA}?idCliente=${idCliente}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  filtrarPuntas(body, size: number, page: number): Observable<any> {
    return this.http
      .post<any>(
        `${API.admin.clientes.mssmc.filtrarDispositivos}?page=${page}&size=${size}`,
        body
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  eliminarConfiguracion(id: number): Observable<any> {
    return this.http
      .delete<any>(
        `${API.admin.clientes.mssmc.eliminarConfiguracionesSLA}?idConfiguracionSLA=${id}`
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  public getEstados() {
    return this.http
      .get('./assets/json/estados.json')
      .pipe(map((response: any) => response))
      .toPromise();
  }

  filtrarPuntasSLA(body, size: number, page: number): Observable<any> {
    return this.http
      .post<any>(
        `${API.admin.clientes.mssmc.filtrarDispositivosSLA}?page=${page}&size=${size}`,
        body
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  getFile(urlFile: string): Promise<any> {
    return fetch(urlFile, {
      method: 'GET',
    });
  }

  obtenerBitacora(body): Observable<any> {
    const options: any = {
      responseType: 'blob' as const,
    };
    return this.http.post<any>(
      `${API.admin.clientes.mssmc.descargarBitacora}`,
      body,
      options
    );
  }

  registrarBitacora(body): Observable<any> {
    body.ipDispositivo = localStorage.getItem('ipDispositivo');
    return this.http
      .post<any>(`${API.admin.clientes.mssmc.registrarBitacora}`, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultarUsuarioCadena(
    size: number,
    page: number,
    idCliente: number,
    body
  ): Observable<any> {
    return this.http
      .post<any>(
        `${API.admin.clientes.mssmc.filtrarClientePorCadena}?page=${
          page - 1
        }&size=${size}&idCliente=${idCliente}`,
        body
      )
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  /* getIp(){
    fetch(Constantes.URL_API, {
      method: 'GET',
    }).then(respuestaRaw => respuestaRaw.json())
    .then(respuesta => {
      localStorage.setItem('ipDispositivo',respuesta.ip)
    });;
  } */

  public GetIp() : Observable<any> {
    return this.http.get<any>("https://api.ipify.org?format=json");  
  }

  permitirInvitar(id: number): Observable<any> {
    return this.http
      .get<any>(
        `${API.admin.clientes.mssmc.permitirInvitar}?idCliente=${id}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  obtenerVersion(): Observable<any> {
    return this.http
      .get<any>(`${API.admin.mssmc.versionSistema}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }
}
