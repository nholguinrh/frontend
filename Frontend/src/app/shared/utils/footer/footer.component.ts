import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'smc-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  emailstring= "mailto:helpdesk@totalplay.com?Subject=Soporte SMC&body=Buen día, estoy buscando ayuda…(déjanos saber en que podemos ayudarte)";
  constructor() { }

  ngOnInit(): void {
  }

  openAvisoPrivacidad(){
    window.open('https://totalplayempresarial.com.mx/assets/archivos/AvisoPrivacidadTPE2018.pdf','_blank',"noopener")
  }

  openTerminos(){
    window.open('https://totalplayempresarial.com.mx/assets/archivos/TerminosCondiciones.pdf','_blank', "noopener")
  }

  help(){
    window.location.href = this.emailstring;
  }

}
