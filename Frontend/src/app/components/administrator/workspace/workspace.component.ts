import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AdministratorLoginModel } from 'src/app/shared/model/auth';
import { AdministratorService } from 'src/app/shared/services/administrator.service';
import { AlertService } from 'src/app/shared/utils/alertas';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  tabLoadTimes: Date[] = [];
  selected = new FormControl(0);

  user: AdministratorLoginModel;
  isBackOffice: boolean = false;

  constructor( private alertService: AlertService,
    private adminService: AdministratorService, ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('admin-user'));
    let tabSeleccionada = localStorage.getItem('workspace');
    localStorage.removeItem('navigation');
    localStorage.removeItem('id-nuevo-cliente');
    localStorage.removeItem('cliente');
    if(tabSeleccionada != null){
      this.selectTab(Number(tabSeleccionada));
    }
    let perfil = this.adminService.getPerfi();
    if(perfil?.descripcion == 'Back Office'){
      this.isBackOffice = true;
    }
  }

  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }
    return this.tabLoadTimes[index];
  }

  selectTab(index: number){
    this.selected.setValue(index);
  }

  tabChange(index: any){
    localStorage.setItem('workspace', index);
  }

}
