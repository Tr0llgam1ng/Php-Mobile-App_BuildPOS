import { Component, inject } from '@angular/core';

import { Usuario } from '../../core/models/usuario.model';
import { PaginaLista } from '../../core/pagina-lista';
import { UsuariosService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  standalone: false,
})
export class UsuariosPage extends PaginaLista<Usuario> {
  private readonly usuariosService = inject(UsuariosService);

  protected listar(): Promise<Usuario[]> {
    return this.usuariosService.listar();
  }

  protected textoBusqueda(usuario: Usuario): string {
    return `${usuario.nombre} ${usuario.apellido} ${usuario.correo} ${usuario.telefono} ${usuario.rol}`;
  }

  protected async eliminar(usuario: Usuario): Promise<void> {
    const confirmado = await this.ui.confirmar(
      'Eliminar usuario',
      `¿Eliminar a ${usuario.nombre} ${usuario.apellido}? Ya no podrá iniciar sesión.`,
    );
    if (!confirmado) {
      return;
    }
    try {
      await this.usuariosService.eliminar(usuario.id_usuario);
      this.registros.update((lista) => lista.filter((u) => u.id_usuario !== usuario.id_usuario));
      void this.ui.aviso('Usuario eliminado.');
    } catch (error) {
      void this.ui.error(error);
    }
  }
}
