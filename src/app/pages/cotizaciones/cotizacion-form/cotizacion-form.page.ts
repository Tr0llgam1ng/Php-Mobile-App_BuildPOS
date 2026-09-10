import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { Cliente } from '../../../core/models/cliente.model';
import { DocumentoGuardar, aDocumentoGuardar } from '../../../core/models/documento.model';
import { Material } from '../../../core/models/material.model';
import { ClientesService } from '../../../core/services/clientes.service';
import { CotizacionesService } from '../../../core/services/cotizaciones.service';
import { MaterialesService } from '../../../core/services/materiales.service';
import { UiService } from '../../../core/services/ui.service';
import { idDeRuta } from '../../../core/utils';

/** Registro (POST) y edición (PUT) de cotizaciones; verifican existencia pero no descuentan stock */
@Component({
  selector: 'app-cotizacion-form',
  templateUrl: './cotizacion-form.page.html',
  standalone: false,
})
export class CotizacionFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly nav = inject(NavController);
  private readonly cotizacionesService = inject(CotizacionesService);
  private readonly clientesService = inject(ClientesService);
  private readonly materialesService = inject(MaterialesService);
  private readonly ui = inject(UiService);

  protected readonly id = idDeRuta(this.route);
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly materiales = signal<Material[]>([]);
  protected readonly inicial = signal<DocumentoGuardar | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const [clientes, materiales, cotizacion] = await Promise.all([
        this.clientesService.listar(),
        this.materialesService.listar(),
        this.id === null ? Promise.resolve(null) : this.cotizacionesService.obtener(this.id),
      ]);
      this.clientes.set(clientes);
      this.materiales.set(materiales);

      if (cotizacion?.estado === 'convertida') {
        void this.ui.aviso('Esta cotización ya se convirtió en venta y no se puede editar.', 'warning');
        void this.nav.navigateBack(['/cotizaciones', cotizacion.id_cotizacion]);
        return;
      }
      if (cotizacion) {
        this.inicial.set(aDocumentoGuardar(cotizacion));
      }
    } catch (error) {
      void this.ui.error(error);
      void this.nav.navigateBack('/cotizaciones');
    } finally {
      this.cargando.set(false);
    }
  }

  protected async guardar(datos: DocumentoGuardar): Promise<void> {
    this.guardando.set(true);
    try {
      if (this.id === null) {
        const cotizacion = await this.cotizacionesService.crear(datos);
        void this.ui.aviso(`Cotización #${cotizacion.id_cotizacion} registrada. El stock no se modificó.`);
        await this.nav.navigateBack('/cotizaciones');
      } else {
        await this.cotizacionesService.reemplazar(this.id, datos);
        void this.ui.aviso('Cotización actualizada.');
        await this.nav.navigateBack(['/cotizaciones', this.id]);
      }
    } catch (error) {
      void this.ui.error(error);
    } finally {
      this.guardando.set(false);
    }
  }
}
