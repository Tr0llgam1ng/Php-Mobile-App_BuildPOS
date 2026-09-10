import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { environment } from '../../../environments/environment';
import { SesionService } from './sesion.service';

/** Formato de todas las respuestas de la API PHP */
interface RespuestaApi<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string>;
}

type Parametros = Record<string, string | number>;

/** Error de la API con un mensaje listo para mostrarse al usuario */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errores: Record<string, string> = {},
  ) {
    super(message);
  }
}

/**
 * Cliente HTTP (Axios) de la API PHP con los métodos GET, POST, PUT, PATCH y DELETE.
 * Agrega el token de sesión a cada petición y convierte los errores en ApiError.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly sesion = inject(SesionService);
  private readonly router = inject(Router);
  private readonly http: AxiosInstance = axios.create({
    baseURL: environment.apiUrl,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });

  constructor() {
    this.http.interceptors.request.use((config) => {
      const token = this.sesion.token;
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      return config;
    });
    this.http.interceptors.response.use(
      (respuesta) => respuesta,
      (error: unknown) => Promise.reject(this.convertirError(error)),
    );
  }

  get<T>(archivo: string, params?: Parametros): Promise<T> {
    return this.enviar<T>({ method: 'GET', url: archivo, params });
  }

  post<T>(archivo: string, datos?: unknown, params?: Parametros): Promise<T> {
    return this.enviar<T>({ method: 'POST', url: archivo, data: datos, params });
  }

  /** Reemplaza el registro completo */
  put<T>(archivo: string, datos: unknown, params?: Parametros): Promise<T> {
    return this.enviar<T>({ method: 'PUT', url: archivo, data: datos, params });
  }

  /** Modifica solo los campos enviados */
  patch<T>(archivo: string, datos: unknown, params?: Parametros): Promise<T> {
    return this.enviar<T>({ method: 'PATCH', url: archivo, data: datos, params });
  }

  delete<T = null>(archivo: string, params?: Parametros): Promise<T> {
    return this.enviar<T>({ method: 'DELETE', url: archivo, params });
  }

  private async enviar<T>(config: AxiosRequestConfig): Promise<T> {
    const { data } = await this.http.request<RespuestaApi<T>>(config);
    return data.data;
  }

  private convertirError(error: unknown): ApiError {
    if (!axios.isAxiosError<RespuestaApi<unknown>>(error)) {
      return new ApiError('Ocurrió un error inesperado.', 0);
    }
    const status = error.response?.status ?? 0;

    if (status === 401 && this.sesion.usuario()) {
      // Token vencido o inválido: se cierra la sesión local y se regresa al login
      this.sesion.cerrar();
      void this.router.navigateByUrl('/login', { replaceUrl: true });
    }

    const cuerpo = error.response?.data;
    if (cuerpo?.message) {
      return new ApiError(cuerpo.message, status, cuerpo.errors);
    }
    if (!error.response) {
      return new ApiError('No se pudo conectar con el servidor. Verifica que Apache y MySQL estén encendidos en XAMPP.', 0);
    }
    return new ApiError(`Error inesperado del servidor (${status}).`, status);
  }
}
