import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { MaterialGuardar } from '../../../core/models/material.model';
import { Proveedor } from '../../../core/models/proveedor.model';
import { MaterialesService } from '../../../core/services/materiales.service';
import { ProveedoresService } from '../../../core/services/proveedores.service';
import { SesionService } from '../../../core/services/sesion.service';
import { UiService } from '../../../core/services/ui.service';
import { idDeRuta, soloModificados } from '../../../core/utils';

/** Alta (POST) y edición (PATCH) de materiales */
@Component({
  selector: 'app-material-form',
  templateUrl: './material-form.page.html',
  standalone: false,
})
export class MaterialFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly nav = inject(NavController);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly materialesService = inject(MaterialesService);
  private readonly proveedoresService = inject(ProveedoresService);
  private readonly ui = inject(UiService);
  protected readonly sesion = inject(SesionService);

  protected readonly id = idDeRuta(this.route);
  protected readonly proveedores = signal<Proveedor[]>([]);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);

  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    id_proveedor: this.fb.control<number | null>(null, Validators.required),
    stock: this.fb.control<number | null>(0, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]),
    precio_compra: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
    precio_venta: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  async ngOnInit(): Promise<void> {
    try {
      const [proveedores, material] = await Promise.all([
        this.proveedoresService.listar(),
        this.id === null ? Promise.resolve(null) : this.materialesService.obtener(this.id),
      ]);
      this.proveedores.set(proveedores);
      if (material) {
        this.form.reset(material);
      }
    } catch (error) {
      void this.ui.error(error);
      void this.nav.navigateBack('/materiales');
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
        await this.materialesService.crear(this.datos());
        void this.ui.aviso('Material registrado.');
      } else {
        // PATCH: solo viajan los campos modificados
        const cambios = soloModificados(this.form, this.datos());
        if (Object.keys(cambios).length) {
          await this.materialesService.modificar(this.id, cambios);
        }
        void this.ui.aviso('Material actualizado.');
      }
      await this.nav.navigateBack('/materiales');
    } catch (error) {
      void this.ui.error(error);
    } finally {
      this.guardando.set(false);
    }
  }

  private datos(): MaterialGuardar {
    const valores = this.form.getRawValue();
    return {
      nombre: valores.nombre,
      id_proveedor: Number(valores.id_proveedor),
      stock: Number(valores.stock),
      precio_compra: Number(valores.precio_compra),
      precio_venta: Number(valores.precio_venta),
    };
  }
}
