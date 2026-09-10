import { Injectable, inject } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

interface OpcionesPedirValor {
  titulo: string;
  etiqueta: string;
  valor?: string | number;
  tipo?: 'text' | 'number';
}

/** Avisos (toasts) y diálogos de confirmación */
@Injectable({ providedIn: 'root' })
export class UiService {
  private readonly toasts = inject(ToastController);
  private readonly alertas = inject(AlertController);

  async aviso(mensaje: string, color: 'success' | 'warning' | 'danger' = 'success'): Promise<void> {
    const toast = await this.toasts.create({
      message: mensaje,
      color,
      duration: 3500,
      position: 'top',
      buttons: [{ icon: 'close', role: 'cancel' }],
    });
    await toast.present();
  }

  error(error: unknown): Promise<void> {
    return this.aviso(error instanceof Error ? error.message : 'Ocurrió un error inesperado.', 'danger');
  }

  async confirmar(titulo: string, mensaje: string, textoAceptar = 'Eliminar'): Promise<boolean> {
    const alerta = await this.alertas.create({
      header: titulo,
      message: mensaje,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: textoAceptar, role: 'confirm' },
      ],
    });
    await alerta.present();
    const { role } = await alerta.onDidDismiss();
    return role === 'confirm';
  }

  /** Diálogo con un solo campo; devuelve lo escrito o null si se canceló */
  async pedirValor(opciones: OpcionesPedirValor): Promise<string | null> {
    const alerta = await this.alertas.create({
      header: opciones.titulo,
      inputs: [{ name: 'valor', type: opciones.tipo ?? 'text', value: opciones.valor, placeholder: opciones.etiqueta }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Guardar', role: 'confirm' },
      ],
    });
    await alerta.present();
    const { role, data } = await alerta.onDidDismiss<{ values: { valor?: string } }>();
    return role === 'confirm' ? String(data?.values.valor ?? '').trim() : null;
  }
}
