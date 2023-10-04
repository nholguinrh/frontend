import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { API } from '../configuration/endpoints';
import { Cliente } from '../model/cliente.model';

import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _user: Cliente;

  public get usuario(): Cliente {
    if (this._user != null) {
      return this._user;
    } else if (
      this._user == null &&
      sessionStorage.getItem('usuario') != null
    ) {
      this._user = JSON.parse(sessionStorage.getItem('usuario')) as Cliente;
      return this._user;
    }
    return null;
  }
}
