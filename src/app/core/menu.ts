import { Recurso } from './models/usuario.model';

export interface OpcionMenu {
  titulo: string;
  descripcion: string;
  url: string;
  icono: string;
  /** Si se indica, la opción solo aparece para los puestos que pueden "leer" ese recurso */
  recurso?: Recurso;
}

export const MENU: OpcionMenu[] = [
  { titulo: 'Inicio', descripcion: 'Accesos rápidos', url: '/inicio', icono: 'home-outline' },
  { titulo: 'Ventas', descripcion: 'Registrar y consultar ventas', url: '/ventas', icono: 'cart-outline', recurso: 'ventas' },
  {
    titulo: 'Cotizaciones',
    descripcion: 'Cotizar y convertir en venta',
    url: '/cotizaciones',
    icono: 'document-text-outline',
    recurso: 'cotizaciones',
  },
  { titulo: 'Clientes', descripcion: 'Datos de los clientes', url: '/clientes', icono: 'people-outline', recurso: 'clientes' },
  { titulo: 'Materiales', descripcion: 'Inventario y stock', url: '/materiales', icono: 'cube-outline', recurso: 'materiales' },
  {
    titulo: 'Proveedores',
    descripcion: 'Empresas que surten los materiales',
    url: '/proveedores',
    icono: 'business-outline',
    recurso: 'proveedores',
  },
  {
    titulo: 'Finanzas',
    descripcion: 'Ventas, ganancias e inventario',
    url: '/finanzas',
    icono: 'stats-chart-outline',
    recurso: 'finanzas',
  },
  {
    titulo: 'Usuarios',
    descripcion: 'Registrar y administrar usuarios',
    url: '/usuarios',
    icono: 'person-add-outline',
    recurso: 'usuarios',
  },
  { titulo: 'Puestos de trabajo', descripcion: 'Roles del sistema', url: '/roles', icono: 'id-card-outline', recurso: 'roles' },
];
