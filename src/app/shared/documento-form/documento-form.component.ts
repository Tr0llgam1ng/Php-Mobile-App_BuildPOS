import { Component, OnInit, computed, input, output, signal } from '@angular/core';

import { IMPUESTO_PREDETERMINADO } from '../../core/constantes';
import { Cliente } from '../../core/models/cliente.model';
import { DocumentoGuardar } from '../../core/models/documento.model';
import { Material } from '../../core/models/material.model';
import { redondear } from '../../core/utils';

interface LineaEditable {
  /** Identificador local de la línea */
  clave: number;
  id_material: number | null;
  cantidad: number | null;
}

/**
 * Formulario compartido por ventas y cotizaciones: cliente, materiales con cantidad e impuesto.
 * Calcula subtotal y total en vivo y avisa si no hay existencia suficiente.
 */
@Component({
  selector: 'app-documento-form',
  templateUrl: './documento-form.component.html',
  styleUrls: ['./documento-form.component.scss'],
  standalone: false,
})
export class DocumentoFormComponent implements OnInit {
  readonly clientes = input.required<Cliente[]>();
  readonly materiales = input.required<Material[]>();
  readonly inicial = input<DocumentoGuardar | null>(null);
  /** Unidades que el documento ya tiene apartadas (al editar una venta); cuentan como disponibles */
  readonly unidadesApartadas = input<Record<number, number>>({});
  /** false en los borradores: el stock se vuelve a verificar al enviarlos como cotización */
  readonly validarExistencia = input(true);
  readonly textoGuardar = input('Guardar');
  readonly guardando = input(false);
  readonly guardar = output<DocumentoGuardar>();

  protected readonly idCliente = signal<number | null>(null);
  protected readonly impuesto = signal<number | null>(IMPUESTO_PREDETERMINADO);
  protected readonly lineas = signal<LineaEditable[]>([]);
  protected readonly intentoGuardar = signal(false);
  private siguienteClave = 0;

  private readonly materialesPorId = computed(
    () => new Map(this.materiales().map((material) => [material.id_material, material])),
  );

  protected readonly resumen = computed(() => {
    const lineas = this.lineas().map((linea) => {
      const material = linea.id_material === null ? undefined : this.materialesPorId().get(linea.id_material);
      const cantidad = linea.cantidad ?? 0;
      const disponible = material ? this.disponible(material) : 0;
      return {
        ...linea,
        material,
        disponible,
        subtotal: material ? redondear(material.precio_venta * cantidad) : 0,
        excede: this.validarExistencia() && !!material && cantidad > disponible,
      };
    });
    const subtotal = redondear(lineas.reduce((suma, linea) => suma + linea.subtotal, 0));
    const total = redondear(subtotal * (1 + (this.impuesto() ?? 0) / 100));
    return { lineas, subtotal, montoImpuesto: redondear(total - subtotal), total };
  });

  /** Primer problema que impide guardar, o null si todo está correcto */
  protected readonly problema = computed(() => {
    const { lineas } = this.resumen();
    const impuesto = this.impuesto();

    if (this.idCliente() === null) {
      return 'Selecciona un cliente.';
    }
    if (!lineas.length) {
      return 'Agrega al menos un material.';
    }
    if (lineas.some((linea) => !linea.material)) {
      return 'Selecciona el material de cada línea.';
    }
    if (lineas.some((linea) => linea.cantidad === null || !Number.isInteger(linea.cantidad) || linea.cantidad < 1)) {
      return 'Cada cantidad debe ser un número entero mayor a 0.';
    }
    if (lineas.some((linea) => linea.excede)) {
      return 'Hay materiales sin existencia suficiente.';
    }
    if (impuesto === null || !Number.isFinite(impuesto) || impuesto < 0 || impuesto > 100) {
      return 'El impuesto debe estar entre 0 y 100 %.';
    }
    return null;
  });

  ngOnInit(): void {
    const inicial = this.inicial();
    if (!inicial) {
      this.agregarLinea();
      return;
    }
    this.idCliente.set(inicial.id_cliente);
    this.impuesto.set(inicial.impuesto);
    this.lineas.set(inicial.detalles.map((detalle) => ({ clave: this.siguienteClave++, ...detalle })));
  }

  protected disponible(material: Material): number {
    return material.stock + (this.unidadesApartadas()[material.id_material] ?? 0);
  }

  /** Evita elegir el mismo material en dos líneas */
  protected usadoEnOtraLinea(idMaterial: number, clave: number): boolean {
    return this.lineas().some((linea) => linea.clave !== clave && linea.id_material === idMaterial);
  }

  protected agregarLinea(): void {
    this.lineas.update((lineas) => [...lineas, { clave: this.siguienteClave++, id_material: null, cantidad: 1 }]);
  }

  protected quitarLinea(clave: number): void {
    this.lineas.update((lineas) => lineas.filter((linea) => linea.clave !== clave));
  }

  protected cambiarMaterial(clave: number, idMaterial: number | null): void {
    this.actualizarLinea(clave, { id_material: idMaterial });
  }

  protected cambiarCantidad(clave: number, valor: string | null | undefined): void {
    this.actualizarLinea(clave, { cantidad: aNumero(valor) });
  }

  protected cambiarImpuesto(valor: string | null | undefined): void {
    this.impuesto.set(aNumero(valor));
  }

  protected enviar(): void {
    this.intentoGuardar.set(true);
    if (this.problema()) {
      return;
    }
    this.guardar.emit({
      id_cliente: this.idCliente() as number,
      impuesto: this.impuesto() as number,
      detalles: this.lineas().map((linea) => ({
        id_material: linea.id_material as number,
        cantidad: linea.cantidad as number,
      })),
    });
  }

  private actualizarLinea(clave: number, cambios: Partial<LineaEditable>): void {
    this.lineas.update((lineas) => lineas.map((linea) => (linea.clave === clave ? { ...linea, ...cambios } : linea)));
  }
}

function aNumero(valor: string | null | undefined): number | null {
  return valor === null || valor === undefined || valor.trim() === '' ? null : Number(valor);
}
