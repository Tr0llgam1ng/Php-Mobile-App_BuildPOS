/** Mismo valor que IMPUESTO_PREDETERMINADO en movil_api/config/config.php (IVA 16 %) */
export const IMPUESTO_PREDETERMINADO = 16;

/** Mismo valor que STOCK_MINIMO en movil_api/config/config.php */
export const STOCK_MINIMO = 5;

/** Dígitos con espacios, guiones, paréntesis o "+" opcionales; la API exige de 10 a 15 dígitos */
export const PATRON_TELEFONO = /^\+?[\d\s()-]{10,20}$/;

/** Claves de Preferences donde se guarda la copia local de clientes y materiales (se borran al cerrar sesión) */
export const CLAVE_CATALOGO_CLIENTES = 'catalogo_clientes';
export const CLAVE_CATALOGO_MATERIALES = 'catalogo_materiales';
