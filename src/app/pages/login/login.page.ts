import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { UiService } from '../../core/services/ui.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly ui = inject(UiService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly enviando = signal(false);

  protected readonly form = this.fb.group({
    usuario: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected async iniciarSesion(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.enviando.set(true);
    try {
      const { usuario, password } = this.form.getRawValue();
      const datos = await this.auth.iniciarSesion(usuario.trim(), password);
      this.form.reset();
      await this.router.navigateByUrl('/inicio', { replaceUrl: true });
      void this.ui.aviso(`¡Bienvenido, ${datos.nombre}!`);
    } catch (error) {
      void this.ui.error(error);
    } finally {
      this.enviando.set(false);
    }
  }
}
