import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { PATRON_TELEFONO } from '../../../core/constantes';
import { Rol } from '../../../core/models/rol.model';
import { UsuarioGuardar } from '../../../core/models/usuario.model';
import { AuthService } from '../../../core/services/auth.service';
import { RolesService } from '../../../core/services/roles.service';
import { SesionService } from '../../../core/services/sesion.service';
import { UiService } from '../../../core/services/ui.service';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { idDeRuta, soloModificados } from '../../../core/utils';

/** Registro (POST) y edición (PATCH) de usuarios */
@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.page.html',
  standalone: false,
})
export class UsuarioFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly nav = inject(NavController);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly usuariosService = inject(UsuariosService);
  private readonly rolesService = inject(RolesService);
  private readonly auth = inject(AuthService);
  private readonly sesion = inject(SesionService);
  private readonly ui = inject(UiService);

  protected readonly id = idDeRuta(this.route);
  protected readonly roles = signal<Rol[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    edad: this.fb.control<number | null>(null, [Validators.required, Validators.min(18), Validators.max(100)]),
    id_rol: this.fb.control<number | null>(null, Validators.required),
    telefono: ['', [Validators.required, Validators.pattern(PATRON_TELEFONO)]],
    correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
    // Obligatoria solo al registrar; al editar se cambia únicamente si se escribe una nueva
    password: ['', this.id === null ? [Validators.required, Validators.minLength(6)] : [Validators.minLength(6)]],
  });

  async ngOnInit(): Promise<void> {
    try {
      const [roles, usuario] = await Promise.all([
        this.rolesService.listar(),
        this.id === null ? Promise.resolve(null) : this.usuariosService.obtener(this.id),
      ]);
      this.roles.set(roles);
      if (usuario) {
        this.form.reset({ ...usuario, password: '' });
      }
    } catch (error) {
      void this.ui.error(error);
      void this.nav.navigateBack('/usuarios');
    } finally {
      this.cargando.set(false);
    }
  }

  protected async guardar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    try {
      if (this.id === null) {
        await this.usuariosService.crear(this.datos());
        void this.ui.aviso('Usuario registrado. Ya puede iniciar sesión.');
      } else {
        // PATCH: solo viajan los campos modificados
        const cambios = soloModificados(this.form, this.datos());
        if (Object.keys(cambios).length) {
          await this.usuariosService.modificar(this.id, cambios);
          if (this.id === this.sesion.usuario()?.id_usuario) {
            await this.auth.refrescarPerfil();
          }
        }
        void this.ui.aviso('Usuario actualizado.');
      }
      await this.nav.navigateBack('/usuarios');
    } catch (error) {
      void this.ui.error(error);
    } finally {
      this.guardando.set(false);
    }
  }

  private datos(): UsuarioGuardar {
    const { edad, id_rol, password, ...resto } = this.form.getRawValue();
    return { ...resto, edad: Number(edad), id_rol: Number(id_rol), ...(password ? { password } : {}) };
  }
}
