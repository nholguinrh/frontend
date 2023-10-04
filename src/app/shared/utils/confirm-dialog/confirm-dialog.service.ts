import { Q } from '@angular/cdk/keycodes';
import { Injectable } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { DatosPunta, Metrica } from '../../model/cliente.model';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
    private dialogConfig = new MatDialogConfig();

    leavingBeforeSubmit(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "Contraseña actualizada",
            subtitle: "<b>¡Recuerda!</b>, tu nueva contraseña te permitirá accesar cuando lo necesites.",
            cancelMessage: "Cancelar",
            confirmMessage: "Entendido",
            type: "success",
            showCancelMessage: false
        }
        return this.dialogConfig;
    }


    cuentaCreada():MatDialogConfig {
      this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "¡Tu cuenta ha sido creada con éxito!",
            subtitle: "Ya puedes inciar sesión en el SMC y comenzar a disfrutar de sus beneficios",
            cancelMessage: "Cancelar",
            confirmMessage: "Entendido",
            type: "success",
            showCancelMessage: false
        }
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    cuentaRegistrada(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "¡Tu cuenta ya fue registrada!",
            subtitle: "Ya puedes inciar sesión en el SMC y comenzar a disfrutar de sus beneficios.",
            cancelMessage: "Cancelar",
            confirmMessage: "Iniciar sesión",
            type: "warn",
            showCancelMessage: false
        }
        return this.dialogConfig;
    }

    altaMiembro(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "¡Alta de miembro exitosa!",
            subtitle: "<b>¡Recuerda!</b>, se envió un correo al nuevo miembro de tu equipo para que inicie su proceso de registro en el SMC.",
            cancelMessage: "Cancelar",
            confirmMessage: "Entendido",
            type: "success",
            showCancelMessage: false
        }
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    eliminarMiembro(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.width = '100px';
        this.dialogConfig.height = '250px';
        this.dialogConfig.data = {
            title: "¿Seguro que quieres continuar?",
            subtitle: "Estás apunto de eliminar a un miembro de tu <br>equipo de trabajo.",
            cancelMessage: "No, cancelar",
            confirmMessage: "Sí, eliminar",
            type: "warn",
            showCancelMessage: true
        }
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    reactivarMiembro(): MatDialogConfig {
      this.dialogConfig.restoreFocus = false;
      this.dialogConfig.autoFocus = false;
      this.dialogConfig.width = '100px';
      this.dialogConfig.height = '250px';
      this.dialogConfig.data = {
          title: "¿Seguro que quieres continuar?",
          subtitle: "Estás apunto de registrar de nuevo a un usuario que ya fue dado de baja del SMC.",
          cancelMessage: "No, cancelar",
          confirmMessage: "Sí, registrar",
          type: "warn",
          showCancelMessage: true
      }
      /* this.dialogConfig.backdropClass = "backdropBackground" */
      return this.dialogConfig;
    }

    eliminarCliente(): MatDialogConfig {
      this.dialogConfig.restoreFocus = false;
      this.dialogConfig.autoFocus = false;
      this.dialogConfig.width = '100px';
      this.dialogConfig.height = '250px';
      this.dialogConfig.data = {
          title: "¿Seguro que quieres continuar?",
          subtitle: "Estás apunto de eliminar a un cliente.",
          cancelMessage: "No, cancelar",
          confirmMessage: "Sí, eliminar",
          type: "warn",
          showCancelMessage: true
      }
      /* this.dialogConfig.backdropClass = "backdropBackground" */
      return this.dialogConfig;
  }

    activarPuntas(datosPuntas?:DatosPunta): MatDialogConfig {
        if(datosPuntas.totalEnlaces == null || datosPuntas.totalEnlaces == 0){
            this.dialogConfig.data = {
              title: "Configuración masiva de Dispositivos",
              subtitle: "¿Seguro que quieres continuar?",
              comment: "Estás apunto de <strong>activar todos los dispositivos</strong> incluyendo Sitios y Servicios.",
              negativeComment: "Estás apunto de <strong>desactivar todos los dispositivos</strong> incluyendo Sitios y Servicios.",
              active:"Activar todo",
              deactivate:"Desactivar todo",
              cancelMessage: "No, cancelar",
              confirmMessage: "Sí, activar",
              negativeConfirmMessage: "Sí, desactivar",
              type: "warn",
              showCancelMessage: true
          }
        }else{
          this.dialogConfig.data = {
            title: "Configuración masiva de Dispositivos",
            subtitle: "¿Seguro que quieres continuar?",
            comment: "Estás apunto de <strong>activar todos los dispositivos</strong> incluyendo Enlaces, Sitios y Servicios.",
            negativeComment: "Estás apunto de <strong>desactivar todos los dispositivos</strong> incluyendo Enlaces, Sitios y Servicios.",
            active:"Activar todo",
            deactivate:"Desactivar todo",
            cancelMessage: "No, cancelar",
            confirmMessage: "Sí, activar",
            negativeConfirmMessage: "Sí, desactivar",
            type: "warn",
            showCancelMessage: true
        }
        }
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        return this.dialogConfig;
    }

    activarInterfaces(asigandosSLA: any): MatDialogConfig {
      if(asigandosSLA.enlacesAsociados == 0 || asigandosSLA.enlacesAsociados == null){
          this.dialogConfig.data = {
            title: "Configuración masiva de Dispositivos",
            subtitle: "¿Seguro que quieres continuar?",
            comment: "Estás apunto de asignar un <strong>SLA a todos los dispositivos</strong>.Incluyento Sitios y Servicios",
            negativeComment: "Estás apunto de eliminar un <strong>SLA a todos los dispositivos</strong>.Incluyendo Sitios y Servicios",
            active:"Asignar a todo",
            deactivate:"Eliminar SLA a todo",
            cancelMessage: "No, cancelar",
            confirmMessage: "Sí, asignar todo",
            negativeConfirmMessage: "Sí, eliminar SLA",
            type: "warn",
            showCancelMessage: true
        }
      }else{
          this.dialogConfig.data = {
            title: "Configuración masiva de Dispositivos",
            subtitle: "¿Seguro que quieres continuar?",
            comment: "Estás apunto de asignar un <strong>SLA a todos los dispositivos</strong>.Incluyendo Enlaces, Sitios y Servicios",
            negativeComment: "Estás apunto de eliminar un <strong>SLA a todos los dispositivos</strong>.Incluyendo Enlaces, Sitios y Servicios",
            active:"Asignar a todo",
            deactivate:"Eliminar SLA a todo",
            cancelMessage: "No, cancelar",
            confirmMessage: "Sí, asignar todo",
            negativeConfirmMessage: "Sí, eliminar SLA",
            type: "warn",
            showCancelMessage: true
        }
      }
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    activarDispositivo(): MatDialogConfig {
      this.dialogConfig.restoreFocus = false;
      this.dialogConfig.autoFocus = false;
      this.dialogConfig.data = {
          title: "Configuración masiva de Dispositivos",
          subtitle: "¿Seguro que quieres continuar?",
          comment: "Estás apunto de asignar un SLA a todos los dispositivos, incluyento Enlaces, Puntas e Interfaces",
          negativeComment: "Estás apunto de designar un SLA a a todos los dispositivos, incluyento Enlaces, Puntas e Interfaces.",
          active:"Asignar a todo",
          deactivate:"Eliminar SLA a todo",
          cancelMessage: "No, cancelar",
          confirmMessage: "Sí, asignar",
          negativeConfirmMessage: "Sí, eliminar",
          type: "warn",
          showCancelMessage: true
      }
      /* this.dialogConfig.backdropClass = "backdropBackground" */
      return this.dialogConfig;
  }

    finalizarCliente(): MatDialogConfig {
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "¡Alta de cliente exitosa!",
            subtitle: "¡Recuerda!, se envió un correo al cliente para <br> que inicie su proceso de registro en el SMC",
            cancelMessage: "No, cancelar",
            confirmMessage: "Entendido",
            type: "success",
            showCancelMessage: false
        }
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    altaPaquete(){
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "¡Alta de paquete exitosa!",
            subtitle: "<b>¡Recuerda!</b>, ahora puedes asociar este nuevo paquete a tus usuarios.",
            cancelMessage: "Cancelar",
            confirmMessage: "Entendido",
            type: "success",
            showCancelMessage: false
        }
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    eliminarPaquete(){
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "¿Seguro que quieres continuar?",
            subtitle: "Estás apunto de eliminar un paquete",
            cancelMessage: "No, cancelar",
            confirmMessage: "Sí, eliminar",
            type: "warn",
            showCancelMessage: true
        }
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    eliminarPlantilla(){
      this.dialogConfig.restoreFocus = false;
      this.dialogConfig.autoFocus = false;
      this.dialogConfig.data = {
          title: "¿Seguro que quieres continuar?",
          subtitle: "Estás apunto de eliminar una de tus plantillas de SLA ",
          cancelMessage: "No, cancelar",
          confirmMessage: "Sí, eliminar SLA",
          type: "warn",
          showCancelMessage: true
      }
      /* this.dialogConfig.backdropClass = "backdropBackground" */
      return this.dialogConfig;
  }

    eliminarConfiguracionSLA(){
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "¿Seguro que quieres continuar?",
            subtitle: "Estás apunto de eliminar una de tus plantillas de SLA ",
            cancelMessage: "No, cancelar",
            confirmMessage: "Sí, eliminar SLA",
            type: "warn",
            showCancelMessage: true
        }
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    metricaServicio(){
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "Selecciona una métrica",
            lista: [{
                name: 'Disponibilidad',
                id: 1
              },{
                name: 'Alcanzabilidad',
                id: 2
              },{
                name: 'Perdida de paquetes',
                id: 3
              },{
                name: 'Latencia',
                id: 4
              },{
                name: 'Consumo',
                id: 5
              }],
            showCancelMessage: false
        }
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    ticketServicio(){
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "Selecciona un estatus",
            lista: [{
                name: 'Sin tickets',
                id: 1
              },{
                name: 'Ticket pendiente',
                id: 2
              },{
                name: 'Ticket resuelto',
                id: 3
              },{
                name: 'Todos los Tickets',
                id: 4
              },{
                name: 'Ticket en curso',
                id: 5
              }],
            showCancelMessage: false
        }
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    sitioServicio(){
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "Selecciona un sitio",
            lista: [{
                name: 'SUC-001',
                id: 1
              },{
                name: 'SUC-002',
                id: 2
              },{
                name: 'SUC-003',
                id: 3
              },{
                name: 'SUC-004',
                id: 4
              },{
                name: 'Suc-Cancún',
                id: 5
              }],
            showCancelMessage: false
        }
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    equipoServicio(){
        this.dialogConfig.restoreFocus = false;
        this.dialogConfig.autoFocus = false;
        this.dialogConfig.data = {
            title: "Selecciona un estatus",
            lista: [{
                name: 'Dispositivo Inalcanzable',
                id: 1
              },{
                name: 'Dispositivo sin gestión',
                id: 2
              },{
                name: 'Dispositivo arriba con una o más interfaces inalcanzables',
                id: 3
              },{
                name: 'Dispositivo en mantenimiento',
                id: 4
              },{
                name: 'Dispositivo arriba con una o más interfaces sin gestión',
                id: 5
              }],
            showCancelMessage: false
        }
        /* this.dialogConfig.backdropClass = "backdropBackground" */
        return this.dialogConfig;
    }

    metricaHistorico(metricas: Metrica[]){
      this.dialogConfig.restoreFocus = false;
      this.dialogConfig.autoFocus = false;
      this.dialogConfig.data = {
          title: "Selecciona una métrica",
          listadoItems: metricas,
          showCancelMessage: false
      }
      /* this.dialogConfig.backdropClass = "backdropBackground" */
      return this.dialogConfig;
  }

  sinDispositivos(): MatDialogConfig {
    this.dialogConfig.restoreFocus = false;
    this.dialogConfig.autoFocus = false;
    this.dialogConfig.width = '250px';
    this.dialogConfig.height = '350px';
    this.dialogConfig.data = {
        title: "Por el momento no cuentas con dispositivos activos",
        subtitle: "Contacta a tu asesor para revisar el estatus de tu plan contratado",
        confirmMessage: "Sí, contactar asesor",
        cancelMessage: "No, cancelar",
        type: "warn",
        showCancelMessage: true,
    }
    /* this.dialogConfig.backdropClass = "backdropBackground" */
    return this.dialogConfig;
}

permitirEnviar(): MatDialogConfig {
  this.dialogConfig.restoreFocus = false;
  this.dialogConfig.autoFocus = false;
  this.dialogConfig.width = '100px';
  this.dialogConfig.height = '250px';
  this.dialogConfig.data = {
      title: "Has excedido tu número de usuarios permitidos",
      subtitle: "Contacta a tu asesor para incrementar tu plan contratado y extender el número de usuarios",
      cancelMessage: "No, cancelar",
      confirmMessage: "Sí, contactar asesor",
      type: "warn",      
      showCancelMessage: true
  }
  /* this.dialogConfig.backdropClass = "backdropBackground" */
  return this.dialogConfig;
}

}
