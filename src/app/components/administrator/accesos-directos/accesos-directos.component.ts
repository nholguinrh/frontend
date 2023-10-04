import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import axios from 'axios';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { AccesoDirecto } from 'src/app/shared/model/administrator.model';
import { Usuario } from 'src/app/shared/model/cliente.model';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';

@Component({
  selector: 'app-accesos-directos',
  templateUrl: './accesos-directos.component.html',
  styleUrls: ['./accesos-directos.component.css']
})
export class AccesosDirectosComponent implements OnInit {

  @ViewChild('accesosModal') accesosModal : any;
  public accesosDirectos: AccesoDirecto[] = [];
  public accesosUsuario: AccesoDirecto[] = [];
  public accesosUsuarioAux: AccesoDirecto[] = [];

  user: Usuario;
  _reintento: number = 1;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public spinner: NgxSpinnerService,
    private administratorService: AdministratorService,
    private workspaceService: WorkspaceService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('id-nuevo-cliente');
    this.user = JSON.parse(localStorage.getItem('admin-user'));
    this.spinner.show();
    localStorage.setItem('previous', 'administrator');
    this.loadCatalogoAccesoDirecto();
  }

  loadCatalogoAccesoDirecto() {
    this.administratorService.catalogoAccesoDirecto().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          data.forEach((accesoDirecto) => {
            if (accesoDirecto.predeterminado === 1 && accesoDirecto.tipoAcceso === 'administrador') {
              this.accesosUsuario.push(accesoDirecto);
            } else {
              if(accesoDirecto.tipoAcceso === 'administrador'){
                this.accesosDirectos.push(accesoDirecto);
              }
            }
          });
          this.loadAccesoDirectoUsuario();
        }
      },
      error: (_) => {
        this.openDialog();
        this.spinner.hide();
      }
    });
  }

  loadAccesoDirectoUsuario() {
    this.administratorService.consultaAccesosDirectos(this.administratorService.getIdUsuarios()).subscribe({
      next: ({ data, httpStatus }) => {
        if (httpStatus === 200) {

          data.forEach((usuarioAccesoDirecto) => {
            this.accesosUsuario.push(usuarioAccesoDirecto.accesoDirecto);
          });
          this.accesosUsuarioAux = [...this.accesosUsuario];
          this.spinner.hide();
        }
      },
      error: (_) => {
        this.openDialog();
        this.spinner.hide();
      }
    });
  }

  public closeAccesosModal() {
    this.accesosModal.nativeElement.className = 'modal hide-modal';
  }

  public openAccesosModal() {
    this.accesosModal.nativeElement.className = 'modal show-modal';
  }

  public limpiarAccesos(){
    this.closeAccesosModal();
    this.accesosUsuarioAux = [...this.accesosUsuario];
  }

  public actualizarAccesos(){
    const _accesosDirectos:any = this.generateJSON();
    this.spinner.show();
    this.administratorService.editaAccesosDirectos(
      this.administratorService.getIdUsuarios(),
      _accesosDirectos)
      .subscribe({
      next: ({httpStatus}) => {
        if (httpStatus === 200) {
          this.spinner.hide();
          this.accesosUsuario = [...this.accesosUsuarioAux];
          this.registrarBitacora();
          this.closeAccesosModal();
        } else {
          this.spinner.hide();
          this.limpiarAccesos();
        }
      },
      error: (_) => {
        this.closeAccesosModal();
        this.openDialog();
        this.spinner.hide();
      }
    });
  }

  generateJSON() {
    let _accesosDirectos:any = [];
    this.accesosUsuarioAux.forEach((accesoUsuario,i) => {

      if (accesoUsuario.predeterminado !== 1) {
        _accesosDirectos.push({
          paraUsuario: {
            idUsuario: this.administratorService.getIdUsuarios()
          },
          orden: i+1,
          accesoDirecto: accesoUsuario
        });
      }

    });
    return _accesosDirectos;
  }

  public modificaAcceso(acceso: AccesoDirecto){
    const i = this.accesosUsuarioAux.findIndex(e => e.idCatAccesoDirecto === acceso.idCatAccesoDirecto);
    if (i > -1) {
      this.accesosUsuarioAux.splice(i, 1);
    } else {
      this.accesosUsuarioAux.push(acceso);
    }
  }

  isAccesoActivo(descripcion: string){
    return this.accesosUsuarioAux?.some(e => e.descripcion === descripcion);
  }

  goToAccesoDirecto(ruta: string){
    if(ruta === 'administrator-workspace'){
      localStorage.setItem('workspace', '2');
    }
    localStorage.setItem('back-return', 'home');
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":" + ruta + ")");
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '449px',
      height: '360px ',
      data:{numero: this._reintento},
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((_) => {
      this.limpiarAccesos();
      this._reintento++;
    });
  }

  registrarBitacora(){
    let body = {
      "funcionalidad": "Guardar cambios de accesos directos",
      "tipoOperacion": "Cambios",
      "datos": "El usuario " + this.administratorService.getIdUsuarios() +" hace cambios de sus acceso directos",
      "creadoPor": {
        "idUsuario": this.administratorService.getIdUsuarios(), 
      }
    }

    console.log("::IPDispositivoBODY",body);

    this.workspaceService.registrarBitacora(body).subscribe({
      next: ({httpStatus, message}) => {
      },
      error: (_) => {
        console.log('No se registro en bitacora');
      }
    });
  }

}
