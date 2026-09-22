import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { authGuard, invitadoGuard } from './core/guards/auth.guard';

// data.recurso: sección protegida; el guard verifica que el puesto del usuario pueda "leer" ese recurso
const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'login',
    canActivate: [invitadoGuard],
    loadChildren: () => import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'inicio',
    canActivate: [authGuard],
    loadChildren: () => import('./pages/inicio/inicio.module').then((m) => m.InicioPageModule),
  },
  {
    path: 'usuarios',
    canActivate: [authGuard],
    data: { recurso: 'usuarios' },
    loadChildren: () => import('./pages/usuarios/usuarios.module').then((m) => m.UsuariosPageModule),
  },
  {
    path: 'roles',
    canActivate: [authGuard],
    data: { recurso: 'roles' },
    loadChildren: () => import('./pages/roles/roles.module').then((m) => m.RolesPageModule),
  },
  {
    path: 'clientes',
    canActivate: [authGuard],
    data: { recurso: 'clientes' },
    loadChildren: () => import('./pages/clientes/clientes.module').then((m) => m.ClientesPageModule),
  },
  {
    path: 'proveedores',
    canActivate: [authGuard],
    data: { recurso: 'proveedores' },
    loadChildren: () => import('./pages/proveedores/proveedores.module').then((m) => m.ProveedoresPageModule),
  },
  {
    path: 'materiales',
    canActivate: [authGuard],
    data: { recurso: 'materiales' },
    loadChildren: () => import('./pages/materiales/materiales.module').then((m) => m.MaterialesPageModule),
  },
  {
    path: 'ventas',
    canActivate: [authGuard],
    data: { recurso: 'ventas' },
    loadChildren: () => import('./pages/ventas/ventas.module').then((m) => m.VentasPageModule),
  },
  {
    path: 'cotizaciones',
    canActivate: [authGuard],
    data: { recurso: 'cotizaciones' },
    loadChildren: () => import('./pages/cotizaciones/cotizaciones.module').then((m) => m.CotizacionesPageModule),
  },
  {
    // Borradores locales: solo para quien puede registrar cotizaciones
    path: 'borradores',
    canActivate: [authGuard],
    data: { recurso: 'cotizaciones', accion: 'crear' },
    loadChildren: () => import('./pages/borradores/borradores.module').then((m) => m.BorradoresPageModule),
  },
  {
    path: 'finanzas',
    canActivate: [authGuard],
    data: { recurso: 'finanzas' },
    loadChildren: () => import('./pages/finanzas/finanzas.module').then((m) => m.FinanzasPageModule),
  },
  { path: '**', redirectTo: 'inicio' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
