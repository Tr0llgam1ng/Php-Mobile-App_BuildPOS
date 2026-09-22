import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

/**
 * Almacenamiento clave-valor persistente del dispositivo (Capacitor Preferences).
 * - Android: SharedPreferences
 * - iOS: UserDefaults
 * - Web / ionic serve: localStorage con el prefijo "CapacitorStorage."
 * Los valores se guardan como JSON, así que admite objetos y arreglos.
 */
@Injectable({ providedIn: 'root' })
export class AlmacenamientoService {
  async leer<T>(clave: string, predeterminado: T): Promise<T> {
    const { value } = await Preferences.get({ key: clave });
    if (value === null) {
      return predeterminado;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      // Valor dañado o de otra versión: se ignora
      return predeterminado;
    }
  }

  guardar(clave: string, valor: unknown): Promise<void> {
    return Preferences.set({ key: clave, value: JSON.stringify(valor) });
  }

  eliminar(clave: string): Promise<void> {
    return Preferences.remove({ key: clave });
  }
}
