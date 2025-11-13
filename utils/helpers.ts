import { OrderStatus } from '~/domain/entities/orderEntity';

export const formatTime = (time: number[]) => {
  const hours = time[0];
  const minutes = time[1];
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
};
export const distanceFormatter = (distance: number): string => {
  if (!distance) return 'Consultar';
  return `${Math.round(distance)} KM`;
};
export const deliveryPriceFormatter = (cost: number): string => {
  return cost ? `$${cost.toString()}` : 'Consultar';
};
export const stylesOrderStatus = (orderStatus: OrderStatus) => {
  switch (orderStatus) {
    case 'CANCELADO':
      return 'text-red-600';
    case 'EN_PREPARACION':
      return 'text-orange-600';
    case 'EN_PROCESO':
      return 'text-orange-600';
    case 'PEDIDO_EN_PROCESO':
      return 'text-orange-600';
    case 'PEDIDO_ENTREGADO':
      return 'text-green-600';
    default:
      return 'text-[#1a3260]';
  }
};
export const textOrderStatus = (orderStatus: OrderStatus) => {
  switch (orderStatus) {
    case 'CANCELADO':
      return 'Cancelado';
    case 'EN_PREPARACION':
      return 'En preparación';
    case 'EN_PROCESO':
    case 'PEDIDO_EN_PROCESO':
      return 'En preparación';
    case 'PEDIDO_ENTREGADO':
      return 'Entregado';
    default:
      return 'Consultar';
  }
};
