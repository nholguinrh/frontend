import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, Subject } from 'rxjs';
import { API } from '../configuration/endpoints';
import { NAV } from '../configuration/navegacion';
import { AdministratorLoginModel, Auth } from '../model/auth';
import { catchError, map, tap } from 'rxjs/operators';
import { ServiceResponse } from '../model/service-response';
import { AccesoDirecto, BandejaSD, Cliente, Configuracion, Estatus, HistoricoPerformance, Metrica, OrigenNombre, Paquete, Perfil, PlantillaSLA, Proceso, Rol, Sector, Servicio, TipoTickets } from '../model/cliente.model';
import { UsuarioAccesoDirecto } from '../model/administrator.model';
import { Dashboard } from '../model/onboarding.model';

@Injectable({
  providedIn: 'root'
})
export class AdministratorService {

  private userSubject: BehaviorSubject<AdministratorLoginModel>;
  public user: Observable<AdministratorLoginModel>;

  private enviarCambio = new Subject<any>();
  enviarCambioObservable = this.enviarCambio.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router) { 
    let tokenObject = JSON.parse(localStorage.getItem('admin-user'));
    this.userSubject = new BehaviorSubject<any>(tokenObject);
    this.user = this.userSubject.asObservable();
  }

  sendChangeHeader(menu: number){
    this.enviarCambio.next(menu);
  }

  login(auth: Auth): Observable<ServiceResponse<AdministratorLoginModel>> {
    const body = {
      usuario: auth.email,
      contrasenia: auth.password
    };

    return this.http
      .post<ServiceResponse<AdministratorLoginModel>>(API.admin.mssmc.login, body)
      .pipe(
        tap(({data}) => {
          localStorage.setItem('admin-user', JSON.stringify(data));
          this.userSubject.next(data);
        }),
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  loginAdmin(auth: Auth): Observable<ServiceResponse<AdministratorLoginModel>> {
    const body = {
      usuario: auth.email,
      contrasenia: auth.password
    };

    return this.http
      .post<ServiceResponse<AdministratorLoginModel>>(API.admin.mssmc.login, body)
      .pipe(
        tap(({data}) => {
          localStorage.setItem('admin-user', JSON.stringify(data));
          this.userSubject.next(data);
        }),
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  logout(){
    localStorage.clear();
    this.userSubject.next(null);
    this.router.navigateByUrl(NAV.loginAdmin);
  }

  public get userValue(): AdministratorLoginModel {
    return this.userSubject.value;
  }

  userData(id: string){
    return this.http.get<any>(`${API.admin.datosHeader}` + '/?idClienteUsuario=' + id)
    .toPromise();
  }

  catalogoAccesoDirecto(): Observable<ServiceResponse<AccesoDirecto[]>> {
    return this.http.get<ServiceResponse<AccesoDirecto[]>>(`${API.admin.catalogos.mssmc.accesosDirectos}`);
  }

  consultaAccesosDirectos(id: number): Observable<ServiceResponse<UsuarioAccesoDirecto[]>> {
    return this.http.get<ServiceResponse<UsuarioAccesoDirecto[]>>(`${API.admin.mssmc.consultaAccesosDirectos}/usuarios/${id}`);
  }

  editaAccesosDirectos(idUsuario:number, request: any): Observable<ServiceResponse<AccesoDirecto[]>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };

    return this.http.post<ServiceResponse<AccesoDirecto[]>>(`${API.admin.mssmc.consultaAccesosDirectos}` + '/', request, options)
    .pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  consultarDetalleCliente(idUsuario: number, idCliente: number){
    return this.http.get<ServiceResponse<any>>(`${API.admin.clientes.mssmc.consultarDetalle}/consultar-cliente?idUsuario=${idUsuario}&idCliente=${idCliente}`);
  } 

  setfavorito(favorito:boolean, idCliente:number, idUsuario:number) {
      const body = {
        idCliente: idCliente,
        idUsuario: idUsuario,
        favorito: favorito
      };
  
      return this.http.post<ServiceResponse<any>>(`${API.admin.clientes.mssmc.favorito}`, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  
  }

  enviarNotificacionAdmin(request: any){
    return this.http.post<any>(`${API.admin.clientes.enviarNotificacionAdmin}`, request)
        .toPromise();
  }

  sendOnboarding(){
    return this.http.get<any>(`${API.admin.sendOnboarding}`);
  }

  agregarClient(request: any){
    return this.http.post<any>(`${API.admin.agregarCliente}`, request)
    .toPromise();
  }


  getNombreUsuario(): string {
    if (this.userSubject != null && this.userSubject.value != null) {
      return this.userSubject.value.nombreCompleto;
    }
    return null;
  }

  getPerfilAdministrador(): string {
    if (this.userSubject != null && this.userSubject.value != null) {
        return this.userSubject.value.perfil;
    }
    return null;
  }

  getPerfilUsuario(): string {
    if (this.userSubject != null && this.userSubject.value != null) {
        return this.userSubject.value.perfil;
    }
    return null;
  }

  getPerfi(): Perfil {
    if (this.userSubject != null && this.userSubject.value != null) {
        return this.userSubject.value.tbCatPerfil;
    }
    return null;
  }

  getIdCliente(): number {
    if (this.userSubject != null && this.userSubject.value != null) {
        return this.userSubject.value.idCliente;
    }
    return null;
  }

  getidClienteTotalplay(): number {
    if (this.userSubject != null && this.userSubject.value != null) {
        return this.userSubject.value.idClienteTotalplay;
    }
    return null;
  }

  getIdClienteUsuarios(): number {
    if (this.userSubject != null && this.userSubject.value != null) {
        return this.userSubject.value.idClienteUsuarios;
    }
    return null;
  }

  getIdUsuarios(): number {
    if (this.userSubject != null && this.userSubject.value != null) {
        return this.userSubject.value.idUsuario;
    }
    return null; 
  }

 

  catalogoBandeja(): Observable<ServiceResponse<BandejaSD[]>> {
    return this.http.get<ServiceResponse<BandejaSD[]>>(`${API.admin.catalogos.mssmc.bandejaSD}`);
  }

  catalogoEstatus(): Observable<ServiceResponse<Estatus[]>> {
    return this.http.get<ServiceResponse<Estatus[]>>(`${API.admin.catalogos.mssmc.estatus}`);
  }

  catalogoHistoricoPerformance(): Observable<ServiceResponse<HistoricoPerformance[]>> {
    return this.http.get<ServiceResponse<HistoricoPerformance[]>>(`${API.admin.catalogos.mssmc.historicoPerformance}`);
  }
  
  catalogoOrigenesNombres(): Observable<ServiceResponse<OrigenNombre[]>> {
    return this.http.get<ServiceResponse<OrigenNombre[]>>(`${API.admin.catalogos.mssmc.origenNombre}`);
  }

  catalogoPaquetes(): Observable<ServiceResponse<Paquete[]>> {
    return this.http.get<ServiceResponse<Paquete[]>>(`${API.admin.catalogos.mssmc.paquetes}`);
  }

  catalogoPaquetesActivos(): Observable<ServiceResponse<Paquete[]>> {
    return this.http.get<ServiceResponse<Paquete[]>>(`${API.admin.catalogos.mssmc.paquetes}/estatus?estatus=activo`);
  }

  catalogoProcesos(): Observable<ServiceResponse<Proceso[]>> {
    return this.http.get<ServiceResponse<Proceso[]>>(`${API.admin.catalogos.mssmc.procesos}`);
  }

  catalogoRoles(): Observable<ServiceResponse<Rol[]>> {
    return this.http.get<ServiceResponse<Rol[]>>(`${API.admin.catalogos.mssmc.rolesTotalPlay}`);
  }

  catalogoSectores(): Observable<ServiceResponse<Sector[]>> {
    return this.http.get<ServiceResponse<Sector[]>>(`${API.admin.catalogos.mssmc.sector}`);
  }

  catalogoServicios(): Observable<ServiceResponse<Servicio[]>> {
    return this.http.get<ServiceResponse<Servicio[]>>(`${API.admin.catalogos.mssmc.servicios}`);
  }

  catalogoTiposTickets(): Observable<ServiceResponse<TipoTickets[]>> {
    return this.http.get<ServiceResponse<TipoTickets[]>>(`${API.admin.catalogos.mssmc.tipoTickets}`);
  }

  catalogoMetricas(): Observable<ServiceResponse<Metrica[]>> {
    return this.http.get<ServiceResponse<Metrica[]>>(`${API.admin.catalogos.mssmc.metricas}`);
  }

  catalogoMetricasDispositivo(dispositivo: string): Observable<ServiceResponse<any[]>> {
    return this.http.get<ServiceResponse<any[]>>(`${API.admin.catalogos.mssmc.metricasDispositivo}?tipoDispositivo=${dispositivo}`);
  }

  catalogoPlantillasSLA(): Observable<ServiceResponse<PlantillaSLA[]>> {
    return this.http.get<ServiceResponse<PlantillaSLA[]>>(`${API.admin.catalogos.mssmc.listarPlantillasSLA}`);
  }

  catalogoPerfiles(): Observable<ServiceResponse<Perfil[]>> {
    return this.http.get<ServiceResponse<Perfil[]>>(`${API.admin.catalogos.mssmc.perfiles}`);
  }

  catalogoEstatusTipo(tipo: string): Observable<ServiceResponse<Estatus[]>> {
    return this.http.get<ServiceResponse<Estatus[]>>(`${API.admin.catalogos.mssmc.estatus}tipo/${tipo}`);
  }

  catalogoDashboard(): Observable<ServiceResponse<Dashboard[]>> {
    return this.http.get<ServiceResponse<Dashboard[]>>(`${API.onboarding.mssmc.dashboards}`);
  }

  detalleSLA(id:number): Observable<ServiceResponse<any>> {
    return this.http.get<ServiceResponse<any>>(`${API.admin.catalogos.mssmc.detalleSLA}?idConfiguracionSLA=${id}`);
  }

  configureSLA(idUsuario:number, body:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };

    return this.http
    .post<ServiceResponse<any>>(API.admin.clientes.mssmc.configureSLA, body, options)
    .pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  configureSLACliente(idUsuario:number, body:any, idCliente: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };

    return this.http
    .post<ServiceResponse<any>>(`${API.admin.clientes.mssmc.configureSLA}?idCliente=${idCliente}`, body, options)
    .pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  actualizacionSLA(idUsuario:number, body:any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };

    return this.http
    .put<ServiceResponse<any>>(API.admin.clientes.mssmc.configureSLA, body, options)
    .pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  eliminarSLA(idConfiguracionSLA:number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idConfiguracionSLA': idConfiguracionSLA.toString()});
    const options = { headers: headers };

    return this.http
    .delete<ServiceResponse<any>>(`${API.admin.clientes.mssmc.configureSLA}/borrar-configuracionSLA`, options)
    .pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  validarSLA(tituloSLA: string){
    return this.http
      .get<ServiceResponse<any>>(`${API.admin.clientes.mssmc.configureSLA}/validar-tituloSLA?tituloSLA=${tituloSLA}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  getMassiveClientesList() {
    return this.http.get("./assets/json/clienteslist.json")
    .pipe(map((response: any) => response)).toPromise();
  }

  generateCode(idUsuario:number) {
    return this.http
      .post<ServiceResponse<any>>(API.onboarding.mssmc.enviarCodigo, idUsuario)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  validateCode(codigo:string) {
    const body = {
      id: 0,
      codigo: codigo
    };

    return this.http
      .post<ServiceResponse<any>>(API.onboarding.mssmc.verificarCodigo, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  nuevoCliente(idUsuario:number, body:any): Observable<ServiceResponse<any>>{
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };

    return this.http.post<ServiceResponse<any>>(`${API.admin.mssmc.cliente}` + '/', body, options)
    .pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  editarCliente(idUsuario:number, cliente:Cliente, configuracion:Configuracion, servicios: Servicio[], usuario) {
    const body = {
      cliente: cliente,
      configuracion: configuracion,
      servicios: servicios,
      usuario: usuario
    };

    return this.http.put<ServiceResponse<any>>(`${API.admin.mssmc.cliente}/?idUsuario=${idUsuario}`, body, {})
    .pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  editarNuevoCliente(idUsuario:number, body:any) {
    return this.http.put<ServiceResponse<any>>(`${API.admin.mssmc.cliente}/?idUsuario=${idUsuario}`, body, {})
    .pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  eliminarCliente(idUsuario:number, idCliente:number) {
    return this.http.get<ServiceResponse<any>>(`${API.admin.mssmc.cliente}/borrar-cliente?idUsuarioOpera=${idUsuario}&idCliente=${idCliente}`)
    .pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  enviarEmailNuevoCliente(idUsuario:number, body:any): Observable<ServiceResponse<any>> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };

    return this.http.post<ServiceResponse<any>>(`${API.admin.clientes.mssmc.emailNuevoCLiente}`, body, options)
    .pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }


  consultaPaquetes(id: number){
    return this.http
      .get<ServiceResponse<any>>(`${API.admin.clientes.mssmc.consultarPaquete}?creadoPor=${id}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultaPaquete(idPaquete: number){
    return this.http
      .get<ServiceResponse<any>>(`${API.admin.clientes.mssmc.consultarPaquete}/${idPaquete}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  consultaPaqueteUsuario(idPaquete: number, idUsuario: number){
    return this.http
      .get<ServiceResponse<any>>(`${API.admin.clientes.mssmc.consultarPaquete}/?idPaquete=${idPaquete}/usuario/?idUsuario=${idUsuario}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  crearPaquetes(body: any, idUsuario:number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };
    return this.http
      .post<ServiceResponse<any>>(`${API.admin.clientes.mssmc.consultarPaquete}?creadoPor=${idUsuario}`, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  editarPaquete(body: any, idCatPaquete:number, idUsuario:number){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idCatPaquete': idCatPaquete.toString(),
      'idUsuario': idUsuario.toString()});
    const options = { headers: headers };
    return this.http
      .put<ServiceResponse<any>>(`${API.admin.clientes.mssmc.consultarPaquete}/${idCatPaquete}?creadoPor=${idUsuario}`, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  eliminarPaquete(idCatPaquete:number,idUsuario){
    return this.http
      .delete<ServiceResponse<any>>(`${API.admin.clientes.mssmc.consultarPaquete}/${idCatPaquete}?creadoPor=${idUsuario}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  validarPaquete(descripcion: string){
    return this.http
      .get<ServiceResponse<any>>(`${API.admin.clientes.mssmc.consultarPaquete}/validar-descripcion?descripcion=${descripcion}`)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  validarPaquetePost(body: any){
    return this.http
      .post<ServiceResponse<any>>(`${API.admin.clientes.mssmc.consultarPaquete}/validar-descripcion`, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  validarSLAPost(body: any){
    return this.http
      .post<ServiceResponse<any>>(`${API.admin.clientes.mssmc.configureSLA}/validar-tituloSLA?tituloSLA`, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  configuracion(idParametro :number){
    return this.http
    .post<any>(`${API.admin.catalogos.mssmc.configuracion}?idParametro=${idParametro}`, null)
    .pipe(
      catchError((e) => {
        return throwError(e);
      })
    );
  }

  catalogoPaquetesactivosAsociado(): Observable<ServiceResponse<Paquete[]>> {
    return this.http.get<ServiceResponse<Paquete[]>>(`${API.admin.catalogos.mssmc.paquetesAsociado}`);
  }

}
