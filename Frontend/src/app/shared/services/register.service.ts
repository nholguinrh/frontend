import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API } from '../configuration/endpoints';
import { Auth } from '../model/auth';
import { Cliente } from '../model/cliente.model';
import { ServiceResponse } from '../model/service-response';


@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private _user: Cliente;
  constructor(
    private http: HttpClient
    ) { }

  login(auth: Auth){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const body = {
      matricula: auth.contrato,
      contrasenia: auth.password,
      idInfoTrabajador: '0',
    };
    return this.http
      .post<ServiceResponse<Cliente>>(API.onboarding.registro, body, {
        headers,
      });
  }

}
