import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

/** Id numérico del parámetro ":id" de la ruta, o null si la ruta no lo tiene */
export function idDeRuta(route: ActivatedRoute): number | null {
  const id = route.snapshot.paramMap.get('id');
  return id ? Number(id) : null;
}

/** De los datos ya listos para la API, conserva solo los campos que el usuario modificó (para PATCH) */
export function soloModificados<T extends object>(form: FormGroup, datos: T): Partial<T> {
  const cambios: Partial<T> = {};
  for (const campo of Object.keys(datos) as (keyof T)[]) {
    if (form.get(campo as string)?.dirty) {
      cambios[campo] = datos[campo];
    }
  }
  return cambios;
}

/** Filtra sin distinguir mayúsculas ni acentos */
export function filtrar<T>(lista: T[], texto: string, obtenerTexto: (item: T) => string): T[] {
  const buscado = normalizar(texto);
  return buscado ? lista.filter((item) => normalizar(obtenerTexto(item)).includes(buscado)) : lista;
}

export function redondear(valor: number): number {
  return Math.round(valor * 100) / 100;
}

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}
