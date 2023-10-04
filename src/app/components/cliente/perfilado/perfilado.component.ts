import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Perfil } from 'src/app/shared/model/onboarding.model';
import { ClientService } from 'src/app/shared/services/client.service';

@Component({
  selector: 'app-perfilado',
  templateUrl: './perfilado.component.html',
  styleUrls: ['./perfilado.component.css']
})
export class PerfiladoComponent implements OnInit {

  public perfiles: Perfil[];
  constructor(private router: Router,
    public spinner: NgxSpinnerService,
    private clienteService: ClientService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.clienteService.catalogoPerfiles().subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.perfiles = data.filter((perfil) => perfil.tipo === 'cliente');
          this.spinner.hide();
        } else {
          console.log(message);
          this.spinner.hide();
        }
      },
      error: (e) => {
        console.log(e);
        this.spinner.hide();
      }
    });

  }

  goToDashboards(descripcion?: string){
    localStorage.setItem('perfilCliente', descripcion.toLowerCase());
    this.router.navigateByUrl(NAV.cliente+"/("+NAV.cliente+":"+NAV.dashboards+")");
  }

  goToBienvenida(){
    this.router.navigateByUrl(NAV.cliente);
  }

}
