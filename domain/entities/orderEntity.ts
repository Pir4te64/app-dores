interface DeliveryAddress {
  id: number;
  title: string;
  streets: string;
  latitude: string;
  longitude: string;
}

export interface OrderPayment {
  id: number;
  price: number;
  priceFee: number | null;
  priceDelivery: number | null;
  priceTransaction: number | null;
  importeRefoundCharges: number | null;
  details: string;
  id_sp: string | null;
  id_reference: string | null;
  paymentMethod: string | null;
  idUser: number;
  idCommerce: number;
  paymentLink: string | null;
  paymentLinkSandbox: string | null;
  paymentType: 'BUY_MENU' | 'ORDER_OPEN_CASH';
  paymentStatus: 'APPROVED' | 'EN_PROCESO' | string;
  expirationDate: string | null;
  dateApproved: string | null;
  dateCreated: string | null;
  moneyReleaseDate: string | null;
  created_at: string;
  updated_at: string;
}

interface OrderDetail {
  id: number;
  idMenu: number;
  idCommerce: number;
  quantity: number;
  observaciones: string[];
}

export type OrderStatus =
  | 'PEDIDO_ENTREGADO'
  | 'EN_PROCESO'
  | 'CANCELADO'
  | 'EN_PREPARACION'
  | 'PEDIDO_EN_PROCESO';

export interface Order {
  id: number;
  type: 'OrdersResponse';
  total: number;
  idCustomer: number;
  deliveryName: string;
  update: boolean;
  qr: string;
  delivery: boolean;
  deliveryTime: string;
  modified: boolean;
  costDelivery: number;
  costFee: number;
  deliveryAddress: DeliveryAddress;
  orderStatus: OrderStatus;
  orderPayment: OrderPayment[];
  detailsOrder: OrderDetail[];
}

export class OrderEntity {
  id: number;
  type: 'OrdersResponse';
  total: number;
  idCustomer: number;
  deliveryName: string;
  update: boolean;
  qr: string;
  delivery: boolean;
  deliveryTime: string;
  modified: boolean;
  costDelivery: number;
  costFee: number;
  deliveryAddress: DeliveryAddress;
  orderStatus: OrderStatus;
  orderPayment: OrderPayment[];
  detailsOrder: OrderDetail[];

  constructor(data: Order) {
    this.id = data.id;
    this.type = data.type;
    this.total = data.total;
    this.idCustomer = data.idCustomer;
    this.deliveryName = data.deliveryName;
    this.update = data.update;
    this.qr = data.qr;
    this.delivery = data.delivery;
    this.deliveryTime = data.deliveryTime;
    this.modified = data.modified;
    this.costDelivery = data.costDelivery;
    this.costFee = data.costFee;
    this.deliveryAddress = data.deliveryAddress;
    this.orderStatus = data.orderStatus;
    this.orderPayment = data.orderPayment;
    this.detailsOrder = data.detailsOrder;
  }

  getLatestPayment(): OrderPayment | null {
    return this.orderPayment.length > 0 ? this.orderPayment[this.orderPayment.length - 1] : null;
  }

  getTotalItems(): number {
    return this.detailsOrder.reduce((sum, detail) => sum + detail.quantity, 0);
  }

  isDeliverable(): boolean {
    return this.delivery && Boolean(this.deliveryAddress);
  }
}
