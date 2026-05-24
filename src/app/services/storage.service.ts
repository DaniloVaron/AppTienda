/**
 * Servicio wrapper sobre Capacitor Preferences que ayuda con el almacenamiento local.
 */
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root', // Disponible en toda la app sin necesidad de registrar en providers
})
export class StorageService {
  constructor() {}

  /**
   * Guarda un valor en el almacenamiento local.
   */
  async set(key: string, value: any): Promise<void> {
    await Preferences.set({
      key,
      value: JSON.stringify(value), // Convertimos a string porque Preferences solo acepta strings
    });
  }

  /**
   * Obtiene un valor del almacenamiento local.
   */
  async get(key: string): Promise<any> {
    const resultado = await Preferences.get({ key });
    // Si no hay valor guardado, resultado.value será null
    if (resultado.value) {
      return JSON.parse(resultado.value); // Parseamos de vuelta a objeto/array
    }
    return null;
  }

  /**
   * Elimina un valor específico del almacenamiento.
   */
  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }

  /**
   * Elimina TODOS los datos del almacenamiento.
   */
  async clear(): Promise<void> {
    await Preferences.clear();
  }
}
