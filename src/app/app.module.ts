import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import {
  CurrencyPipe,
  DatePipe,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeModule } from './components/home/home.module';
import { AutorizationModule } from './components/autorization/autorization.module';
import { LayoutModule } from '@angular/cdk/layout';
import { ClienteModule } from './components/cliente/cliente.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CanDeactivateGuard } from './shared/helper/canDeactivateGuard.helper';
import { AdministratorModule } from './components/administrator/administrator.module';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { CustomDateAdapter } from './shared/utils/date-adapter/CustomDateAdapter';
import { MY_FORMATS } from './shared/configuration/global';
import { SharedModule } from './shared/shared.module';
import { UserIdleModule } from 'angular-user-idle';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    //idle es el tiempo que pasa antes de hacer algo, por ejemplo mostrar un modal 420
    //timeout es el tiempo que pasa antes de terminar el conteo, al final se cierra sesion 180
    UserIdleModule.forRoot({ idle: 420, timeout: 180, ping: 120 }),
    AppRoutingModule,
    BrowserAnimationsModule,
    AutorizationModule,
    AdministratorModule,
    ClienteModule,
    NgxSpinnerModule,
    LayoutModule,
    HomeModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
    { provide: LOCALE_ID, useValue: 'es-MX' },
    CanDeactivateGuard,
    DatePipe,
    CurrencyPipe,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
