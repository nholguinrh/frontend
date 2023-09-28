import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { API } from '../configuration/endpoints';
import { NAV } from '../configuration/navegacion';
import { AdministratorLoginModel, Auth } from '../model/auth';
import { Cliente, Usuario } from '../model/cliente.model';
import { CodigoSeguridad } from '../model/codigo-seguridad';
import { ServiceResponse } from '../model/service-response';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private userSubject: BehaviorSubject<AdministratorLoginModel>;
  public user: Observable<AdministratorLoginModel>;

  constructor(private http: HttpClient, private router: Router) { 
    let tokenObject = JSON.parse(localStorage.getItem('admin-user'));
      this.userSubject = new BehaviorSubject<any>(tokenObject);
      this.user = this.userSubject.asObservable()
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
          localStorage.setItem('admin-client-user', JSON.stringify(data));
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
    this.router.navigateByUrl(NAV.login);
  }

  getIdUsuarios(): number {
    if (this.userSubject != null && this.userSubject.value != null) {
        return this.userSubject.value.idUsuario;
    }
    return null; 
  }

  addClient(request: any){
      return this.http.post<any>(`${API.admin.agregarCliente}`, request);
  }

  sendOnboarding(){
    return this.http.get<any>(`${API.admin.sendOnboarding}`);
  }

  enviarCodigoPass(email: string) {
    return this.http
      .post<ServiceResponse<any>>(`${API.admin.mssmc.enviarCodigoPassword}?email=${email}`, {})
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }

  validarCodigoPass(body: any) {
    return this.http
      .post<ServiceResponse<any>>(API.admin.mssmc.validarCodigoPassword, body)
      .pipe(
        catchError((e) => {
          return throwError(e);
        })
      );
  }
  
}
