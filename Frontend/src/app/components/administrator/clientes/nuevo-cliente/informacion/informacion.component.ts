import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Step } from 'src/app/shared/model/stteper.model';
import { Servicios } from 'src/app/shared/model/catalogos';
import { NgxSpinnerService } from 'ngx-spinner';
import { NAV } from 'src/app/shared/configuration/navegacion';
import { Router } from '@angular/router';
import { BandejaSD, Cliente, Configuracion, DetalleCliente, Estatus, HistoricoPerformance, OrigenNombre, Paquete, Sector, Servicio, TipoTickets } from 'src/app/shared/model/cliente.model';
import { AlertService } from 'src/app/shared/utils/alertas';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ServiceErrorDialogComponent } from 'src/app/shared/components/service-error-dialog/service-error-dialog.component';
import { ExternosService } from 'src/app/shared/services/externos.service';
import { Empresa } from 'src/app/shared/model/externos.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { ClientService } from 'src/app/shared/services/client.service';
import { WorkspaceService } from 'src/app/shared/services/workspace.service';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.component.html',
  styleUrls: ['./informacion.component.css']
})
export class InformacionComponent implements OnInit {

  initialStep: Step; 
  steps: Step[] = [];
  title: string = 'Información general';
  subTitle: string = 'Ingresa la información general de tu cliente';
  form: FormGroup;
  cliente: Cliente;
  detalle: any;
  canEdit?: boolean = false;
  estatusFavorito: boolean = false;
  corazon: string = "src\assets\img\heart.svg";
  corazonRojo: string = "src\assets\img\heart-red.svg";
  servicios: Servicios[];
  sectores: Sector[];
  tickets: TipoTickets[];
  historicos: HistoricoPerformance[];
  bandejas: BandejaSD[];
  origenNombre: OrigenNombre[];
  paquetes: Paquete[];
  estatus: Estatus[];

  options: Empresa[] = [];
  filteredOptions: Observable<Empresa[]>;

  user: any;
  dialogRef: any = null; 
  idEmpresa: any = null;
  idCliente: number = 0;
  serviciosAux: Servicios[] = [];
  typeSend: number;
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService, 
    public spinner: NgxSpinnerService,
    private router: Router,
    private administratorService: AdministratorService,
    private clienteService: ClientService,
    private externosService: ExternosService,
    public dialog: MatDialog,
    public notificationService : NotificationService,
    private workspaceService: WorkspaceService
  ) { 
    this.createForm();
    this.filteredOptions = this.form.controls['nombreEmpresa'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || null)),
    );
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('admin-user'));
    localStorage.setItem('navigation', NAV.nuevoClienteInformacion);
    this.initialStep = new Step('Información', true, false);
    this.steps.push(new Step('Activación', false, false));
    this.steps.push(new Step('Configuración', false, false));

    this.catalogos();
    console.log('Data Cliente:');
    if(localStorage.getItem('id-nuevo-cliente')){
      this.canEdit = true;
      this.administratorService.consultarDetalleCliente(
        this.administratorService.getIdUsuarios(),
        Number(localStorage.getItem('id-nuevo-cliente'))
        ).subscribe({
        next: ({data, httpStatus}) => {
          console.log('Data Cliente:',data);
          if (httpStatus === 200) {
            this.detalle = {
              cliente: data,
              configuracion: data.configuracion as Configuracion,
              punta: null,
              usuarios: data.usuario,
              servicios: data.servicios as Servicio[]
            } ;

            if (this.detalle.cliente != null) {
              this.form.get('nombreEmpresa').setValue(this.detalle.cliente.cliente.razonSocial);
              this.form.get('nombreEmpresa').disable();
              this.form.get('nombreAdmin').setValue(this.detalle.cliente.cliente.representante);
              this.form.get('email').setValue(this.detalle.cliente.cliente.email);
              this.form.get('telefono').setValue(this.detalle.cliente.cliente.telefonoCelular);
              this.form.get('paquete').setValue(this.detalle.cliente.cliente.tbCatPaquete.idCatPaquete);
              this.form.get('contrato').setValue(this.detalle.cliente.cliente.contrato);
              this.form.get('observaciones').setValue(this.detalle.cliente.cliente.observaciones);
              this.form.get('historico').setValue(this.detalle.configuracion.tbCatHistoricoPerformance.idCatHistoricoPerformance);
              this.form.get('sector').setValue(this.detalle.configuracion.tbCatSector.idCatSector);
              this.form.get('ticket').setValue(this.detalle.configuracion.tbCatTipoTicket.idCatTipoTicket);
              this.form.get('origen').setValue(this.detalle.configuracion.tbCatOrigenNombre.idCatOrigenNombre);
              this.form.get('bandeja').setValue(this.detalle.configuracion.tbCatBandejaSD.idCatBandejaSD);
              this.form.get('punta').setValue(this.detalle.cliente.cliente.sitiosContratados);
              this.form.get('enlace').setValue(this.detalle.cliente.cliente.enlacesContratados);
              this.form.get('servicios').setValue(this.detalle.cliente.cliente.serviciosContratados);

              this.getFavorito(this.detalle.cliente.cliente.indicadorFavorito);
            }


            if (this.detalle.configuracion != null) {
              this.form.get('sector').setValue(this.detalle.configuracion.tbCatSector.idCatSector);
              this.form.get('ticket').setValue(this.detalle.configuracion.tbCatTipoTicket.idCatTipoTicket);

              this.form.get('bandeja').setValue(this.detalle.configuracion.tbCatBandejaSD.idCatBandejaSD);
              this.form.get('origen').setValue(this.detalle.configuracion.tbCatOrigenNombre.idCatOrigenNombre);
            }

            if (this.detalle.servicios != null) {
              this.detalle.servicios.forEach((element) => {
                this.servicios.forEach((servicio) => {
                  if(element.idCatServicios == servicio.idCatServicios){
                    this.serviciosAux.push(servicio);
                  }
                });
              });
              this.form.get('servicio').setValue(this.serviciosAux);
            }

            this.spinner.hide();

          } else {
            this.openDialog(2);
            this.alertService.error('<b>Error al obtener datos del cliente</b>');
            this.spinner.hide();
          }
        },
        error: (_) => {
          console.log('error con servidor');
        }
      });
    }
  }

  getFavorito(indicadorFavorito:number) {
    if (indicadorFavorito === 1) {
      this.estatusFavorito = true;
    } else {
      this.estatusFavorito = false;
    }
  }

  openDialog(numero:number): void {
    this.dialogRef = this.dialog.open(ServiceErrorDialogComponent, {
      data:{numero:numero},
      disableClose: true
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if(result == 2){
        window.location.reload()
      }else if(result == ""){
      }else if(result == 1){
        this.send();
      }
      this.dialogRef = null;
    });
}

  goBack(){
    let home = localStorage.getItem('back-return')
    if(home === 'home'){
      localStorage.setItem('menu', '1');
      localStorage.removeItem('back-return');
      localStorage.removeItem('navigation');
      this.router.navigateByUrl(NAV.administrator);
    }else{
      this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
    }
  }

  createForm() { 
    this.form = this.formBuilder.group(
      {
        nombreEmpresa: [null, [Validators.required]],
        nombreAdmin: [null, [Validators.required, Validators.minLength(10), Validators.pattern("^([ ]{0,1}[a-zA-ZÁÉÍÓÚáéíóú]+[ ']{0,1}[a-zA-ZÁÉÍÓÚáéíóú]+[ ']{0,1}[a-zA-ZÁÉÍÓÚáéíóú]+[ ']{0,1}[a-zA-ZÁÉÍÓÚáéíóú])+[ ]{0,1}$") ]],
        email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9._-]+\.[a-z]{2,4}$")]],
        telefono: [null, [Validators.minLength(10), Validators.maxLength(10)]],
        paquete: [null, [Validators.required]],
        contrato: [null, [Validators.required]],
        servicio: [null, [Validators.required]],
        punta: [null, [Validators.required]],
        servicios: [null, [Validators.required]],
        enlace: [null, [Validators.required]],
        historico : [null, [Validators.required]],
        sector: [null, [Validators.required]],
        ticket: [null, [Validators.required]],
        bandeja: [null, [Validators.required]],
        origen: [null, [Validators.required]],
        observaciones: [''],
      }
    );
  }

  catalogos(){
    /* this.loadEmpresas() */
    this.loadCatalogoBandeja();
    this.loadCatalogoHistoricoPerformance();
    this.loadCatalogoPaquete();
    this.loadCatalogoOrigenNombre();
    this.loadCatalogoSector();
    this.loadCatalogoServicio();
    this.loadCatalogoTipoTicket();
    this.loadCatalogoEstatus();
  }

  loadEmpresas(busqueda) {
    this.externosService.catalogoEmpresas(busqueda).subscribe({
      next: ({ empresas, httpStatus }) => {
        if (httpStatus === 200) {
          this.options = empresas;
        }
      },
      error: (error) => { 
        console.log('Servicio externo [empresas]: ', error);
      }
    });
  }

  loadCatalogoBandeja() {
    this.administratorService.catalogoBandeja().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.bandejas = data;
        }
      },
      error: (error) => { 
        if (this.dialogRef === null) {
          this.openDialog(2);
        }
        
        console.log('Error ', error);
      }
    });
  }

  loadCatalogoHistoricoPerformance() {
    this.administratorService.catalogoHistoricoPerformance().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.historicos = data;
        }
      },
      error: (error) => { 
        if (this.dialogRef === null) {
          this.openDialog(2);
        }
        console.log('Error ', error);
      }
    });
  }

  loadCatalogoOrigenNombre() {
    this.administratorService.catalogoOrigenesNombres().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.origenNombre = data;
        }
      },
      error: (error) => {
        if (this.dialogRef === null) {
          this.openDialog(2);
        }
        console.log('Error ', error);
      }
    });
  }

  loadCatalogoPaquete() {
    this.administratorService.catalogoPaquetesActivos().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.paquetes = data;
        }
      },
      error: (error) => { 
        if (this.dialogRef === null) {
          this.openDialog(2);
        }
        console.log('Error ', error);
      }
    });
  }

  loadCatalogoSector() {
    this.administratorService.catalogoSectores().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.sectores = data;
        }
      },
      error: (error) => { 
        if (this.dialogRef === null) {
          this.openDialog(2);
        }
        console.log('Error ', error);
      }
    });
  }

  loadCatalogoServicio() {
    this.administratorService.catalogoServicios().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.servicios = data;
        }
      },
      error: (error) => { 
        if (this.dialogRef === null) {
          this.openDialog(2);
        }
        console.log('Error ', error);
      }
    });
  }

  loadCatalogoTipoTicket() {
    this.administratorService.catalogoTiposTickets().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.tickets = data;
        }
      },
      error: (error) => { 
        if (this.dialogRef === null) {
          this.openDialog(2);
        }
        console.log('Error ', error);
      }
    });
  }

  loadCatalogoEstatus() {
    this.administratorService.catalogoEstatus().subscribe({
      next: ({ data, httpStatus }) => { 
        if (httpStatus === 200) {
          this.estatus = data;
          localStorage.setItem('catEstatus', JSON.stringify(this.estatus));
        }
      },
      error: (error) => { 
        if (this.dialogRef === null) {
          this.openDialog(2);
        }
        console.log('Error ', error);
      }
    });
  }

  serviceRemoved(servicio: string) {
    const toppings = this.form.value['servicio'] as string[];
    this.removeFirst(toppings, servicio);
    this.form.patchValue({servicio: toppings});
  }

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  send(){
    if(this.form.valid){
      this.typeSend = 1;
      this.spinner.show();
      const _nav = NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteActivacion+")";
      this.setCliente(_nav);
    }
  }

  continueLater(){
    this.typeSend = 0;
    this.spinner.show();
    const _nav = NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")";
    this.setCliente(_nav);
  }

  setCliente(_nav:string) {
    if(this.form.invalid){
      this.spinner.hide();
      return;
    }
    this.cliente = new Cliente();
    this.cliente.razonSocial = this.form.controls['nombreEmpresa'].value;
    this.cliente.representante = this.form.controls['nombreAdmin'].value.trim();
    this.cliente.email = this.form.controls['email'].value;
    this.cliente.telefonoCelular = this.form.controls['telefono'].value;
    this.cliente.contrato = this.form.controls['contrato'].value;
    this.cliente.sitiosContratados = this.form.controls['punta'].value;
    this.cliente.enlacesContratados = this.form.controls['enlace'].value;
    this.cliente.serviciosContratados = this.form.controls['servicios'].value;
    this.cliente.observaciones = this.form.controls['observaciones'].value;
    this.cliente.numeroUsuarios = '0';
    if(this.idEmpresa != null){
      this.cliente.idClienteTotalPlay = this.idEmpresa;
    }

    let paquete = new Paquete();
    this.paquetes.forEach(e => {
      if (e.idCatPaquete === this.form.controls['paquete'].value) {
        paquete = e;
      }
    });
    this.cliente.tbCatPaquete = paquete;

    let estatus = new Estatus();
      this.estatus.forEach(e => {
        if (e.idCatEstatus === 21) {
          estatus = e;
        }
      });
    this.cliente.tbCatEstatus = estatus;

    const _servicios = this.form.controls['servicio'].value;

    let _configuracion = new Configuracion();

    let sector = new Sector();
    this.sectores.forEach(e => {
      if (e.idCatSector === this.form.controls['sector'].value) {
        sector = e;
      }
    });
    _configuracion.tbCatSector = sector;

    let historicoPerformance = new HistoricoPerformance();
    this.historicos.forEach(e => {
      if (e.idCatHistoricoPerformance === this.form.controls['historico'].value) {
        historicoPerformance = e;
      }
    });
    _configuracion.tbCatHistoricoPerformance = historicoPerformance;
    
    let ticket = new TipoTickets();
    this.tickets.forEach(e => {
      if (e.idCatTipoTicket === this.form.controls['ticket'].value) {
        ticket = e;
      }
    });
    _configuracion.tbCatTipoTicket = ticket;

    let bandeja = new BandejaSD();
    this.bandejas.forEach(e => {
      if (e.idCatBandejaSD === this.form.controls['bandeja'].value) {
        bandeja = e;
      }
    });
    _configuracion.tbCatBandejaSD = bandeja;


    let origen = new OrigenNombre();
      this.origenNombre.forEach(e => {
        if (e.idCatOrigenNombre === this.form.controls['origen'].value) {
          origen = e;
        }
      });
    _configuracion.tbCatOrigenNombre = origen;

    if (this.estatusFavorito) {
      this.cliente.indicadorFavorito = 1;
    } else {
      this.cliente.indicadorFavorito = 0;
    }

    const body = {
      cliente: this.cliente,
      configuracion: _configuracion,
      servicios: _servicios,
      usuario: null
    };
    
    if(localStorage.getItem('id-nuevo-cliente')){
      body.cliente.idCliente = Number(localStorage.getItem('id-nuevo-cliente'));
      body.configuracion.idClienteConfiguracion = this.detalle.configuracion.idClienteConfiguracion;
      body.usuario = this.detalle?.usuarios;
      this.editarNuevoCliente(body, _nav);
    }else{
      this.guardarNuevoCliente(body, _nav);
    }
  }

  guardarNuevoCliente(body:any, _nav:string) {
    this.administratorService.nuevoCliente(this.user.idUsuario, body).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.registrarBitacora(1, data.cliente.idCliente)
          if(this.idEmpresa != null){
            this.externosService.puntas(this.idEmpresa, this.user.idUsuario).subscribe({
              next: (result) => {
                this.navigate(data, _nav);
              },
              error: (e) => {
                console.error('Error al hacer petición de puntas');
                this.navigate(data, _nav);
              }
            });
          }else{
            this.navigate(data, _nav);
          }
          if(this.typeSend == 0){
            this.navigate(data, _nav);
            this.enviarNotificacion(data.cliente);
          }
        } else {
          this.spinner.hide();
          if(message === 'El contrato ya existe'){
            this.form.controls['contrato'].setErrors({'incorrect': true});
          } else if(message === 'El email ya existe'){
            this.form.controls['email'].setErrors({'incorrect': true});
          } else{
            this.alertService.error(`Error ${message}`);
          }
        }
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e);
        this.openDialog(1);
      }
    }); 
  }

  navigate(data: any, _nav: string){
    this.cliente = new Cliente();
    this.cliente = data.cliente;
    localStorage.setItem('id-nuevo-cliente', this.cliente.idCliente.toString());
    localStorage.setItem('cliente', this.cliente.idCliente.toString());
    this.router.navigateByUrl(_nav);
    this.spinner.hide();
  }

  favorito(){
    this.estatusFavorito = !this.estatusFavorito;
  }

  goToEquipos(){
    this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.administratorWorspace+")");
  }

  getError(){
      return 'Este campo es requerido';
  }

  get formulario() {
    return this.form.controls;
  }

  public onlyalpha(event) {
    let k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || k == 241 || k == 209);
  }

  public onlyalphaEmail(event) {
    let k;
    k = event.charCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || (!(k > 31 && (k < 48 || k > 57))) || k == 8 || k == 46 || k == 64 || k == 241 || k == 209 || k == 45 || k == 95 );
  }

  public onlyNumbers(event) {
    let k;
    k = event.charCode;
    return (!(k > 31 && (k < 48 || k > 57)));
  }

  public keyShowAutocomplete(event: any) {
    if(event.target.value > 0 || event.target.value == ''){
    
    }else{
      if(Number(event.target.value) != 0){
        this.form.get('telefono')?.setErrors({ incorrectText: true });
      }
    }
  }

  keyShowAutocompleteEmpresa(event: any){
    this.options = [];
    if(event.target.value.length > 2){
      this.loadEmpresas(this.form.controls['nombreEmpresa'].value);
      /* if((this.options.find(ele => ele == this.form.controls['nombreEmpresa'].value)) == undefined){
        this.form.get('nombreEmpresa')?.setErrors({ incorrectText: true });
      } */
    }

  }

  public guardarCambios(){
    if(this.form.valid){
      this.spinner.show();
      this.cliente = new Cliente();
      this.cliente.razonSocial = this.form.controls['nombreEmpresa'].value;
      this.cliente.representante = this.form.controls['nombreAdmin'].value.trim();
      this.cliente.email = this.form.controls['email'].value;
      this.cliente.telefonoCelular = this.form.controls['telefono'].value;

      this.cliente.paquete = this.form.controls['paquete'].value;
      this.cliente.contrato = this.form.controls['contrato'].value;
      this.cliente.servicio = this.form.controls['servicio'].value;
      this.cliente.sitiosContratados = this.form.controls['punta'].value;
      this.cliente.enlacesContratados = this.form.controls['enlace'].value;
      this.cliente.serviciosContratados = this.form.controls['servicios'].value;

      this.cliente.sector = this.form.controls['sector'].value;
      this.cliente.historicoPerformance = this.form.controls['historico'].value;
      this.cliente.tipoTickets = this.form.controls['ticket'].value;
      this.cliente.observaciones = this.form.controls['observaciones'].value;

      this.cliente.bandejaSD = this.form.controls['bandeja'].value;
      this.cliente.origenNombre = this.form.controls['origen'].value;
      this.router.navigateByUrl(NAV.administrator+"/("+'home'+":"+NAV.nuevoClienteActivacion+")");
    }
  }

  private _filter(value: string): Empresa[] {
    if(value){
      if(value.length > 4){
        const filterValue = value.toLowerCase();
        return this.options.filter(option => option.nombre.toLowerCase().includes(filterValue));
      }else{
        return [];
      }
    }else{
      return [];
    }
  }

  public getEmpresa(empresa: Empresa){
      this.externosService.getEmpresa(Number(empresa.id)).subscribe({
        next: (data) => { 
          if (data.httpStatus == 200) {
            this.form.controls['punta'].setValue(data.empresa.totalPuntas ? data.empresa.totalPuntas : 0);
            this.form.controls['enlace'].setValue(data.totalEnlacesContratados ? data.totalEnlacesContratados : 0);
            this.form.controls['servicios'].setValue(data.totalServiciosContratados ? data.totalServiciosContratados : 0);
            // ambiente dev
            //this.idEmpresa = data.idCliente;
            // ambiente totalplay 
            this.idEmpresa = empresa.id;
          }
        },
        error: (error) => { 
          console.log('Servicio externo [empresa/id]: ', error);
        }
      });
    }

  enviarNotificacion(cliente){
    const body = {
      notificacion: {
        titulo: "Configuración pendiente",
        descripcion: "¡Hey! Dejaste pendiente la configuración de " ,
        tipoNotificacion: "A"
      },
      parametros: {
        descripcion: cliente.razonSocial,
        accion: "string",
        servidorIp: "string",
        path: "string",
        parametros: ""+cliente.idCliente+",1",
        tipoServicio: "string"
      }
    }
    this.notificationService.crearNotificacionAutomatica(this.administratorService.getIdUsuarios(),body).subscribe({
      next: (result) => {
        this.spinner.hide();
        this.registrarBitacora(2, cliente.idCliente)
        if(result.httpStatus == 200){
          this.alertService.notify('¡Tienes un cliente pendiente de configurar!');
        }
      },
      error: () => {
        this.spinner.hide();
        console.log("No se pudo crear la notificacion");
      }
    });

  }

  editarNuevoCliente(body:any, _nav:string) {
    this.administratorService.editarNuevoCliente(this.user.idUsuario, body).subscribe({
      next: ({data, httpStatus, message}) => {
        if (httpStatus === 200) {
          this.navigate(data, _nav);
          if(this.typeSend == 0){
            this.enviarNotificacion(data.cliente);
          }
          this.alertService.success(`${message}`);
          this.spinner.hide();
        } else {
          this.spinner.hide();
          if(message === 'El contrato ya existe'){
            this.form.controls['contrato'].setErrors({'incorrect': true});
          } else if(message === 'El email ya existe'){
            this.form.controls['email'].setErrors({'incorrect': true});
          } else{
            this.form.controls['email'].setErrors({'incorrect': true});
          }
        }
      },
      error: (e) => {
        this.spinner.hide();
        console.log(e);
        this.openDialog(1);
      }
    }); 
  }

  onBlurMethod(){
    let empresa = this.form.controls['nombreEmpresa'].value;
    if(empresa.length > 0 ){
      if(this.idEmpresa == null){
        this.form.controls['nombreEmpresa'].setErrors({'incorrect': true});
      }else{
        this.clienteService.validarEmpresa(this.idEmpresa).subscribe({
          next: ({data, httpStatus, message}) => {
            this.spinner.hide();
            if (httpStatus === 200) {
              if(data == 'empresa registrada'){
                this.form.controls['nombreEmpresa'].setErrors({'exist': true});
              }
            }
          },
          error: (e) => {
            this.spinner.hide();
            console.log(e);
          }
        }); 
      }
    }
  }

  public blockSpace(event) {
    let k;
    k = event.charCode;
    if (k == 32) return false;
  }


  registrarBitacora(flujo?: number, idCliente?: number){
    let comentario: string; 
    let tipoOperacion: string;
    let funcionalidad: string;
    if(flujo == 1){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", guardo la informacion del nuevo cliente: " + idCliente
      funcionalidad = 'Guardado de información'
      tipoOperacion = 'Alta'
    }else if(flujo == 2){
      comentario = "El usuario: "+ this.administratorService.getIdUsuarios() + ", eligió continuar mas tarde con la configuración del nuevo cliente: " + idCliente
      funcionalidad = 'Continuar mas tarde'
      tipoOperacion = 'Envió'
    }else{
      return
    }
    let body = {
      "funcionalidad": funcionalidad,
      "tipoOperacion": tipoOperacion,
      "datos": comentario,
      "creadoPor": {
        "idUsuario": this.administratorService.getIdUsuarios()
      }
    }

    this.workspaceService.registrarBitacora(body).subscribe({
      next: ({httpStatus, message}) => {
      },
      error: (_) => {
        console.log('No se registro en bitacora');
      }
    });
  }

  onSelectionChange(event: any){
    console.log('onSelectionChange called', event.option.value);
    console.log("Empresa:",this.options);
    let empresa = this.options.find(element => element.nombre == event.option.value);
    this.getEmpresa(empresa);
  }
}
