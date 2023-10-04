import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AdministratorLoginModel } from 'src/app/shared/model/auth';
import { AlertService } from 'src/app/shared/utils/alertas';

@Component({
  selector: 'app-workspace-cliente',
  templateUrl: './workspace-cliente.component.html',
  styleUrls: ['./workspace-cliente.component.css']
})
export class WorkspaceClienteComponent implements OnInit {

  tabLoadTimes: Date[] = [];
  selected = new FormControl(0);
  user: AdministratorLoginModel;
  constructor(  private alertService: AlertService ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('admin-user'));
    let tabSeleccionada = localStorage.getItem('workspace');
    localStorage.removeItem('navigation');
    if(tabSeleccionada != null){
      this.selectTab(Number(tabSeleccionada));
    }
    localStorage.setItem('isdashboard', '0');
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
