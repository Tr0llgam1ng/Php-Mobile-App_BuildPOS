import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Cliente } from '../../../core/models/cliente.model';
import { DocumentoGuardar, aDocumentoGuardar } from '../../../core/models/documento.model';
import { Material } from '../../../core/models/material.model';
import { ClientesService } from '../../../core/services/clientes.service';
import { MaterialesService } from '../../../core/services/materiales.service';
import { UiService } from '../../../core/services/ui.service';
import { VentasService } from '../../../core/services/ventas.service';
import { idDeRuta } from '../../../core/utils';

/** Registro (POST) y edición (PUT: reemplaza la venta completa) de ventas */
@Component({
  selector: 'app-venta-form',
  templateUrl: './venta-form.page.html',
  standalone: false,
})
export class VentaFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly nav = inject(NavController);
  private readonly ventasService = inject(VentasService);
  private readonly clientesService = inject(ClientesService);
  private readonly materialesService = inject(MaterialesService);
  private readonly ui = inject(UiService);

  protected readonly id = idDeRuta(this.route);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly materiales = signal<Material[]>([]);
  protected readonly inicial = signal<DocumentoGuardar | null>(null);
  /** Unidades que la venta ya descontó: al editarla vuelven a estar disponibles */
  protected readonly apartadas = signal<Record<number, number>>({});

  async ngOnInit(): Promise<void> {
    try {
      const [clientes, materiales, venta] = await Promise.all([
        this.clientesService.listar(),
        this.materialesService.listar(),
        this.id === null ? Promise.resolve(null) : this.ventasService.obtener(this.id),
      ]);
      this.clientes.set(clientes);
      this.materiales.set(materiales);

      if (venta) {
        const apartadas: Record<number, number> = {};
        for (const linea of venta.detalles ?? []) {
          apartadas[linea.id_material] = linea.cantidad;
        }
        this.apartadas.set(apartadas);
        this.inicial.set(aDocumentoGuardar(venta));
      }
    } catch (error) {
      void this.ui.error(error);
      void this.nav.navigateBack('/ventas');
    } finally {
      this.cargando.set(false);
    }
  }

  protected async guardar(datos: DocumentoGuardar): Promise<void> {
    this.guardando.set(true);
    try {
      if (this.id === null) {
        const venta = await this.ventasService.crear(datos);
        void this.ui.aviso(`Venta #${venta.id_venta} registrada. Se descontó el stock.`);
        await this.nav.navigateBack('/ventas');
      } else {
        await this.ventasService.reemplazar(this.id, datos);
        void this.ui.aviso('Venta actualizada. El stock se ajustó con los cambios.');
        await this.nav.navigateBack(['/ventas', this.id]);
      }
    } catch (error) {
      void this.ui.error(error);
    } finally {
      this.guardando.set(false);
    }
  }
}
