import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { PermisosPaquete } from 'src/app/shared/model/catalogos';
import { ClienteNotify } from 'src/app/shared/model/cliente-notify-model';
import { Cliente, Estatus, Paquete } from 'src/app/shared/model/cliente.model';
import { TableField } from 'src/app/shared/model/fields.model';
import { Page } from 'src/app/shared/model/page';
import { PageRequest } from 'src/app/shared/model/page.request';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';
import { AlertService } from 'src/app/shared/utils/alertas';
import { MassiveNotificationDialogComponent } from 'src/app/shared/utils/massive-notification-dialog';
import { MassiveNotificationDialogService } from 'src/app/shared/utils/massive-notification-dialog/massive-notification-dialog.service';

@Component({
  selector: 'app-administrator-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  public dataSource = null;
  public fetchCol: TableField[];
  fetchRequest: PageRequest<Cliente> = new PageRequest<Cliente>();
  pageResponse: Page<Cliente> = new Page<Cliente>();
  public filtradoBusqueda: string = "nombre";
  public des: boolean = false;
  public form: FormGroup;
  idUsuario: number;
  filter: number = 0;
  paquetes: Paquete[]
  estatus: Estatus[];
  isChecked: boolean[];
  menuDispositivosEstatus: boolean = false;
  menuDispositivos: PermisosPaquete[] = [
    {id: 1, descripcion: "Enlaces", estatus: true},
    {id: 2, descripcion: "Sitios", estatus: false},
    {id: 3, descripcion: "Servicios", estatus: false},
  ];
  showAutocomplete: boolean = true;
  isBackOffice:  boolean = false;
  public clientList: ClienteNotify[] = [];
  public idClients: any[] = [];
  constructor(
    private alertService: AlertService,
    private workspaceService: WorkspaceService,
    private dialog: MatDialog,
    private dialogService: MassiveNotificationDialogService,
    private formBuilder: FormBuilder,
    public spinner: NgxSpinnerService,
    public router: Router,
    private administratorService: AdministratorService,
    public clientesService:ClientService,
    public notificationService : NotificationService,
  ) { }
  

  ngOnInit(): void {
    localStorage.removeItem('id-nuevo-cliente');
    this.idUsuario = this.administratorService.getIdUsuarios();
    this.fetchCol = [
      { field: 'idEmpresa', header: 'ID EMPRESA' },
      { field: 'razonSocial', header: 'NOMBRE EMPRESA' },
      { field: 'paquete', header: 'PAQUETE CONTRATADO' },
      { field: 'puntasActivas', header: 'TIPO DE DISPOSITIVO' },
      { field: 'estatus', header: 'ESTATUS DEL CLIENTE' },
      { field: 'numeroUsuarios', header: 'NÚMERO DE USUARIOS' },
      { field: 'detalle', header: 'DETALLE' }
    ];
    this.form = this.formBuilder.group({      
      busqueda: ['']
    });
    this.loadCatalogoPaquete();
    this.loadCatalogoPerfiles();
    this.onPaged(0);
    let perfil = this.administratorService.getPerfi();
    if(perfil?.descripcion == 'Back Office'){
      this.isBackOffice = true;
    }
  }

  onPaged(page: number) {
    if(this.filter == 0){
      this.clientesPorAntiguedad(page);
      this.borrarFiltros();
    }
    if(this.filter == 1){
      this.clientesPorNombre(page);
      this.borrarFiltros();
    }
    if(this.filter == 2){ 
      this.clientesAntiguos(page);
      this.borrarFiltros();
    }
    if(this.filter == 3){
      this.clientesRecientes(page);
      this.borrarFiltros();
    }
    if(this.filter == 4){
      this.clientesFavoritos(page);
      this.borrarFiltros();
    }
    if(this.filter == 5){
      this.clientesFiltros(page);
    }
  }

  clientesPorAntiguedad(page: number){
    this.spinner.show();
    this.workspaceService.getClientes(5, page, 'recientes', this.idUsuario).subscribe({
      next: (result) => {
        this.spinner.hide();
        this.pageResponse.init(result);
        this.pageResponse.content.forEach(elem => {
          elem.idClienteString = String(elem.idCliente).padStart(4,'0');
        });
      },
      error: () => {
        this.spinner.hide();
        this.openDialog();
      }
    });
  }


  clientesPorNombre(page: number){
    const body = { busqueda: "" }            

    if(this.form.controls['busqueda'].value != '' && this.form.controls['busqueda'].value != null){
      body.busqueda=this.form.controls['busqueda'].value;
    }

    if (body.busqueda != null && body.busqueda != '') {
      this.spinner.show();
      this.workspaceService.getFilterClientes(5, page, this.idUsuario, body).subscribe({
        next: (result) => {
          this.pageResponse.init(result);
          this.pageResponse.content.forEach(elem => {
            elem.idClienteString = String(elem.idCliente).padStart(4,'0');
          });
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();
          this.openDialog();
        }
      });
     }else{
       this.filter = 0;
       this.clientesPorAntiguedad(0);
     }
  }

  clientesRecientes(page: number){
    this.spinner.show();
    this.workspaceService.getClientes(5, page, 'recientes', this.idUsuario).subscribe({
      next: (result) => {
        this.pageResponse.init(result);
        this.pageResponse.content.forEach(elem => {
          elem.idClienteString = String(elem.idCliente).padStart(4,'0');
        });
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.openDialog();
      }
    });
  }

  clientesAntiguos(page: number){
    this.spinner.show();
    this.workspaceService.getClientes(5, page, 'antiguos', this.idUsuario).subscribe({
      next: (result) => {
        this.pageResponse.init(result);
        this.pageResponse.content.forEach(elem => {
          elem.idClienteString = String(elem.idCliente).padStart(4,'0');
        });
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.openDialog();
      }
    });
  }

  clientesFavoritos(page: number){
    this.spinner.show();
    this.workspaceService.getClientesFavoritos(5, page, this.idUsuario).subscribe({
      next: (result) => {
        this.pageResponse.init(result);
        this.pageResponse.content.forEach(elem => {
          elem.idClienteString = String(elem.idCliente).padStart(4,'0');
        });
        this.spinner.hide();
      },
      error: () => {
        this.spinner.hide();
        this.openDialog();
      }
    });
  }

  clientesFiltros(page: number){
    let contenidoEstatus: boolean;
    let contenidoPaquete: boolean;
    const body = { estatus: [], paquetes: [], tipo: "", busqueda: "" }

    this.paquetes.forEach(element => {
      if(element.estatus == true){
        body.paquetes.push(element.idCatPaquete);
        contenidoPaquete = true;
      }
    });
    this.estatus.forEach(element => {
      if(element.estatus == true){
        body.estatus.push(element.idCatEstatus);
        contenidoEstatus = true;
      }
    });

    if(!contenidoPaquete){
      body.paquetes = [0];
    }
    if(!contenidoEstatus){
      body.estatus = [0];
    }
    if(this.form.controls['busqueda'].value != '' && this.form.controls['busqueda'].value != null){
      if(this.form.controls['busqueda'].value == 'Favoritos'){
        body.tipo = "favoritos"
        body.busqueda = this.form.controls['busqueda'].value
      }else if(this.form.controls['busqueda'].value == 'Más recientes'){
        body.tipo = "recientes"
        body.busqueda = this.form.controls['busqueda'].value
      }else if(this.form.controls['busqueda'].value == 'Más antiguos'){
        body.tipo = "antiguos"
        body.busqueda = this.form.controls['busqueda'].value
      }else{
        body.tipo = "cadena"
        body.busqueda = this.form.controls['busqueda'].value
      }
    }
    console.log(body)
    if(contenidoEstatus || contenidoPaquete){
      this.spinner.show();
      this.workspaceService.getApplyFilterClientes(5, page, this.idUsuario, body).subscribe({
        next: (result) => {
          this.pageResponse.init(result);
          this.pageResponse.content.forEach(elem => {
            elem.idClienteString = String(elem.idCliente).padStart(4,'0');
          });
          this.spinner.hide();
        }, error: () => {
          this.spinner.hide();
          this.openDialog();
        }
      })
    }else{
      this.borrarFiltros();
      this.clientesPorAntiguedad(0);
      return false
    }
  }

  nuevoCliente(){
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteInformacion+")");
  }

  detalleCliente(id: number){
    localStorage.setItem('cliente', id.toString());
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.detalleCliente+")");
  }

  sendAlert(){
    this.alertService.info('<b>!Descarga realizada correctamente! </b>');
  }

  sendMassiveNotification(){
    const dialogRef = this.dialog.open(
      MassiveNotificationDialogComponent, 
      this.dialogService.sendMassiveNotification()
    );
    dialogRef.afterClosed().subscribe(
      data => {
        if(data == true){
          this.alertService.info('<b>¡Se ha enviado la notificación correctamente!</b>');
        }
      }
    );
  }

  filterString() {
    this.filter = 1;
    this.onPaged(0);
  }

  selectAntiguos(){
    this.filter = 2;
    this.onPaged(0);
  }

  selectRecientes(){
    this.filter = 3;
    this.onPaged(0);
  }

  selectFavoritos(){
    this.filter = 4;
    this.onPaged(0);
  }

  selectoFiltros(){
    this.filter = 5;
    this.onPaged(0);
  }
  
  openDialog() {
    const dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      width: '449px',
      height: '360px ',
      data:{numero: 0},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((_) => {
      this.form.reset('');
    });
  }

  selectEncabezado(event?: any){
    if(event){
      event.stopPropagation();
    }
  }

  mostrarDispositivo(){
    if(!this.menuDispositivos[0].estatus && !this.menuDispositivos[1].estatus && !this.menuDispositivos[2].estatus){
      return true
    }
  }

  loadCatalogoPaquete() {
    this.administratorService.catalogoPaquetesactivosAsociado().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          
          this.paquetes = data;
          console.log("Paquetes",this.paquetes);
        }
      },
      error: (error) => { 
        console.log('Error ', error);
      }
    });
  }
  loadCatalogoPerfiles() {
    this.administratorService.catalogoEstatusTipo("C").subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.estatus = data;
        }
      },
      error: (error) => { 
        console.log('Error ', error);
      }
    });
  }

  setAllDispositivos(event?: any) {
    if(event){
      event.stopPropagation();
    }
    this.menuDispositivosEstatus = !this.menuDispositivosEstatus;
    this.menuDispositivos.forEach(t => (t.estatus = this.menuDispositivosEstatus));
  }
  updateAllCompleteDispositivos() {
    this.menuDispositivosEstatus = this.menuDispositivos != null && this.menuDispositivos.every(t => t.estatus);
  }

  keyShowAutocomplete(event: any) {
    if(event.target.value.length > 0) {
      this.showAutocomplete = false;
    }else{
      this.showAutocomplete = true;
    }
  }


  calcularAnchoColumna(columna: string){
    return columna == 'detalle' ? '85px!important' : 
    columna == 'numeroUsuarios' ? '115px!important' : 
    columna == 'idEmpresa' ? '120px!important' :
    columna == 'razonSocial' ? '325px!important' :  
    columna == 'puntasActivas' ? this.calcularAncho() : ''
  }

  calcularAncho(){
    let anchoInicial = true 
    let tamañoAncho = 90
    this.menuDispositivos.forEach(elem => {
      if(elem.estatus == true){
        tamañoAncho = tamañoAncho +  100;
        anchoInicial = false
      }
    });
    if(this.mostrarDispositivo()){
      anchoInicial = false
      tamañoAncho = 390;
    }
    return anchoInicial ? '120px' : tamañoAncho + 'px';
  }

  returnPage(){
    this.filter = 0
    this.onPaged(0);
    this.form.reset();
  }

  borrarFiltros(){
    this.estatus?.forEach(element => {
      element.estatus = false
    });
    this.paquetes?.forEach(element => {
      element.estatus = false
    });
  }
}
