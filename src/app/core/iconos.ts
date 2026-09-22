import { addIcons } from 'ionicons';
import {
  add,
  businessOutline,
  cloudOfflineOutline,
  cartOutline,
  close,
  createOutline,
  cubeOutline,
  documentTextOutline,
  homeOutline,
  idCardOutline,
  layersOutline,
  logOutOutline,
  paperPlaneOutline,
  peopleOutline,
  personAddOutline,
  receiptOutline,
  saveOutline,
  statsChartOutline,
  swapHorizontalOutline,
  trashOutline,
} from 'ionicons/icons';

/** Registra los íconos que usa la app (requerido por los componentes standalone de Ionic) */
export function registrarIconos(): void {
  addIcons({
    add,
    close,
    'business-outline': businessOutline,
    'cart-outline': cartOutline,
    'cloud-offline-outline': cloudOfflineOutline,
    'create-outline': createOutline,
    'cube-outline': cubeOutline,
    'document-text-outline': documentTextOutline,
    'home-outline': homeOutline,
    'id-card-outline': idCardOutline,
    'layers-outline': layersOutline,
    'log-out-outline': logOutOutline,
    'paper-plane-outline': paperPlaneOutline,
    'people-outline': peopleOutline,
    'person-add-outline': personAddOutline,
    'receipt-outline': receiptOutline,
    'save-outline': saveOutline,
    'stats-chart-outline': statsChartOutline,
    'swap-horizontal-outline': swapHorizontalOutline,
    'trash-outline': trashOutline,
  });
}
