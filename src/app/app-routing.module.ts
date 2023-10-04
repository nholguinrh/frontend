import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { appRoutes } from './shared/configuration/routes';

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { scrollPositionRestoration: 'enabled', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
