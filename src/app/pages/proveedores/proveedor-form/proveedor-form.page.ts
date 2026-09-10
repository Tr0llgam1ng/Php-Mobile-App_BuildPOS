import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { ProveedorGuardar } from '../../../core/models/proveedor.model';
import { ProveedoresService } from '../../../core/services/proveedores.service';
import { UiService } from '../../../core/services/ui.service';
import { idDeRuta, soloModificados } from '../../../core/utils';

/** Alta (POST) y edición (PATCH) de proveedores */
@Component({
  selector: 'app-proveedor-form',
  templateUrl: './proveedor-form.page.html',
  standalone: false,
})
export class ProveedorFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly nav = inject(NavController);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly proveedoresService = inject(ProveedoresService);
  private readonly ui = inject(UiService);

  protected readonly id = idDeRuta(this.route);
  protected readonly cargando = signal(this.id !== null);
  protected readonly guardando = signal(false);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    direccion: ['', [Validators.required, Validators.maxLength(255)]],
  });

  async ngOnInit(): Promise<void> {
    if (this.id === null) {
      return;
    }
    try {
      this.form.reset(await this.proveedoresService.obtener(this.id));
    } catch (error) {
      void this.ui.error(error);
      void this.nav.navigateBack('/proveedores');
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
      const datos: ProveedorGuardar = this.form.getRawValue();
      if (this.id === null) {
        await this.proveedoresService.crear(datos);
        void this.ui.aviso('Proveedor registrado.');
      } else {
        // PATCH: solo viajan los campos modificados
        const cambios = soloModificados(this.form, datos);
        if (Object.keys(cambios).length) {
          await this.proveedoresService.modificar(this.id, cambios);
        }
        void this.ui.aviso('Proveedor actualizado.');
      }
      await this.nav.navigateBack('/proveedores');
    } catch (error) {
      void this.ui.error(error);
    } finally {
      this.guardando.set(false);
    }
  }
}
