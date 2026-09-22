import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

import { BorradorGuardar } from '../../../core/models/borrador.model';
import { Cliente } from '../../../core/models/cliente.model';
import { DocumentoGuardar } from '../../../core/models/documento.model';
import { Material } from '../../../core/models/material.model';
import { BorradoresService } from '../../../core/services/borradores.service';
import { CatalogoLocalService } from '../../../core/services/catalogo-local.service';
import { UiService } from '../../../core/services/ui.service';
import { redondear } from '../../../core/utils';

/** Alta y modificación de un borrador de cotización guardado en el dispositivo */
@Component({
  selector: 'app-borrador-form',
  templateUrl: './borrador-form.page.html',
  standalone: false,
})
export class BorradorFormPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly nav = inject(NavController);
  private readonly borradoresService = inject(BorradoresService);
  private readonly catalogo = inject(CatalogoLocalService);
  private readonly ui = inject(UiService);

  /** Id local del borrador; null al crear uno nuevo */
  protected readonly id = this.route.snapshot.paramMap.get('id');
  protected readonly cargando = signal(true);
  protected readonly guardando = signal(false);
  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly materiales = signal<Material[]>([]);
  protected readonly inicial = signal<DocumentoGuardar | null>(null);
  protected readonly referencia = signal('');
  protected readonly notas = signal('');
  /** Fecha de la copia local de clientes/materiales cuando no hubo conexión */
  protected readonly copiaDel = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      const [clientes, materiales, borrador] = await Promise.all([
        this.catalogo.clientes(),
        this.catalogo.materiales(),
        this.id === null ? Promise.resolve(null) : this.borradoresService.obtener(this.id),
      ]);
      this.clientes.set(clientes.datos);
      this.materiales.set(materiales.datos);
      this.copiaDel.set(clientes.copiaDel ?? materiales.copiaDel);

      if (borrador) {
        this.referencia.set(borrador.referencia);
        this.notas.set(borrador.notas);
        this.inicial.set(borrador.datos);
      }
    } catch (error) {
      void this.ui.error(error);
      void this.nav.navigateBack('/borradores');
    } finally {
      this.cargando.set(false);
    }
  }

  protected async guardar(datos: DocumentoGuardar): Promise<void> {
    const entrada: BorradorGuardar = {
      referencia: this.referencia().trim(),
      notas: this.notas().trim(),
      datos,
      cliente: this.nombreCliente(datos.id_cliente),
      total: this.calcularTotal(datos),
    };

    this.guardando.set(true);
    try {
      if (this.id === null) {
        await this.borradoresService.crear(entrada);
        void this.ui.aviso('Borrador guardado en el dispositivo.');
      } else {
        await this.borradoresService.actualizar(this.id, entrada);
        void this.ui.aviso('Borrador actualizado.');
      }
      await this.nav.navigateBack('/borradores');
    } catch (error) {
      void this.ui.error(error);
    } finally {
      this.guardando.set(false);
    }
  }

  private nombreCliente(idCliente: number): string {
    const cliente = this.clientes().find((c) => c.id_cliente === idCliente);
    return cliente ? `${cliente.nombre} ${cliente.apellido}` : `Cliente #${idCliente}`;
  }

  /** Total estimado con los precios de venta conocidos; la API recalcula al enviar */
  private calcularTotal(datos: DocumentoGuardar): number {
    const precios = new Map(this.materiales().map((m) => [m.id_material, m.precio_venta]));
    const subtotal = datos.detalles.reduce(
      (suma, linea) => suma + (precios.get(linea.id_material) ?? 0) * linea.cantidad,
      0,
    );
    return redondear(subtotal * (1 + datos.impuesto / 100));
  }
}
