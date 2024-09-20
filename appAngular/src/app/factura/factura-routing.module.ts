import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturaTableComponent } from './factura-table/factura-table.component';
import { FacturaDetailComponent } from './factura-detail/factura-detail.component';
import { FacturaFormComponent } from './factura-form/factura-form.component';
import { CarritoComponent } from './carrito/carrito.component';
import { authGuard } from '../share/auth.guard';


const authEncargado = {
  canActivate: [authGuard],
  data: { roles: ['Encargado'] }
};

const authAdmin = {
  canActivate: [authGuard],
  data: { roles: ['Administrador'] }
};

const authEncargadoAdmin = {
  canActivate: [authGuard],
  data: { roles: ['Encargado', 'Administrador'] }
};

const routes: Routes = [
  { path: 'factura/create', component: FacturaFormComponent, ...authEncargado },
  { path: 'factura/update/:id', component: FacturaFormComponent, ...authEncargado },
  { path: 'factura-table', component: FacturaTableComponent, ...authEncargadoAdmin},
  { path: 'factura/carrito', component: CarritoComponent },
  { path: 'factura/:id', component: FacturaDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturaRoutingModule {}
