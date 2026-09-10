import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { PATRON_TELEFONO } from '../../../core/constantes';
import { ClienteGuardar } from '../../../core/models/cliente.model';
import { ClientesService } from '../../../core/services/clientes.service';
import { UiService } from '../../../core/services/ui.service';
import { idDeRuta, soloModificados } from '../../../core/utils';

/** Alta (POST) y edición (PATCH) de clientes */
@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.page.html',
  standalone: false,
})
export class ClienteFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly nav = inject(NavController);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly clientesService = inject(ClientesService);
  private readonly ui = inject(UiService);

  protected readonly id = idDeRuta(this.route);
  protected readonly cargando = signal(this.id !== null);
  protected readonly guardando = signal(false);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellido: ['', [Validators.required, Validators.maxLength(100)]],
    domicilio: ['', [Validators.required, Validators.maxLength(255)]],
    telefono: ['', [Validators.required, Validators.pattern(PATRON_TELEFONO)]],
  });

  async ngOnInit(): Promise<void> {
    if (this.id === null) {
      return;
    }
    try {
      this.form.reset(await this.clientesService.obtener(this.id));
    } catch (error) {
      void this.ui.error(error);
      void this.nav.navigateBack('/clientes');
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
      const datos: ClienteGuardar = this.form.getRawValue();
      if (this.id === null) {
        await this.clientesService.crear(datos);
        void this.ui.aviso('Cliente registrado.');
      } else {
        // PATCH: solo viajan los campos modificados
        const cambios = soloModificados(this.form, datos);
        if (Object.keys(cambios).length) {
          await this.clientesService.modificar(this.id, cambios);
        }
        void this.ui.aviso('Cliente actualizado.');
      }
      await this.nav.navigateBack('/clientes');
    } catch (error) {
      void this.ui.error(error);
    } finally {
      this.guardando.set(false);
    }
  }
}
