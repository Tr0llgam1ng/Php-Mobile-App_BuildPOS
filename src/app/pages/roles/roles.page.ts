import { Component, inject } from '@angular/core';

import { Rol } from '../../core/models/rol.model';
import { PaginaLista } from '../../core/pagina-lista';
import { RolesService } from '../../core/services/roles.service';

/** Puestos de trabajo: alta (POST), renombrar (PATCH) y eliminación desde diálogos */
@Component({
  selector: 'app-roles',
  templateUrl: './roles.page.html',
  standalone: false,
})
export class RolesPage extends PaginaLista<Rol> {
  private readonly rolesService = inject(RolesService);

  protected listar(): Promise<Rol[]> {
    return this.rolesService.listar();
  }

  protected textoBusqueda(rol: Rol): string {
    return rol.nombre;
  }

  protected async crear(): Promise<void> {
    const nombre = await this.ui.pedirValor({ titulo: 'Nuevo puesto de trabajo', etiqueta: 'Nombre del puesto' });
    if (!nombre) {
      return;
    }
    try {
      const rol = await this.rolesService.crear({ nombre });
      this.registros.update((lista) => [...lista, rol]);
      void this.ui.aviso('Puesto registrado. Asígnale permisos en la API (core/auth.php).');
    } catch (error) {
      void this.ui.error(error);
    }
  }

  protected async renombrar(rol: Rol): Promise<void> {
    const nombre = await this.ui.pedirValor({ titulo: 'Renombrar puesto', etiqueta: 'Nombre del puesto', valor: rol.nombre });
    if (!nombre || nombre === rol.nombre) {
      return;
    }
    try {
      const actualizado = await this.rolesService.modificar(rol.id_rol, { nombre });
      this.registros.update((lista) => lista.map((r) => (r.id_rol === rol.id_rol ? actualizado : r)));
      void this.ui.aviso('Puesto actualizado.');
    } catch (error) {
      void this.ui.error(error);
    }
  }

  protected async eliminar(rol: Rol): Promise<void> {
    if (!(await this.ui.confirmar('Eliminar puesto', `¿Eliminar el puesto "${rol.nombre}"?`))) {
      return;
    }
    try {
      await this.rolesService.eliminar(rol.id_rol);
      this.registros.update((lista) => lista.filter((r) => r.id_rol !== rol.id_rol));
      void this.ui.aviso('Puesto eliminado.');
    } catch (error) {
      void this.ui.error(error);
    }
  }
}
