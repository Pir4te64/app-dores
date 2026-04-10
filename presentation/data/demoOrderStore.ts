/**
 * DEMO MODE: Order Store
 * Almacena pedidos creados en modo demo para simular el flujo completo
 */

import { OrderEntity, Order } from '~/domain/entities/orderEntity';
import { CartItem } from '~/presentation/context/cartContext';
import { MOCK_ORDERS } from './mockData';

// Store para pedidos demo creados por el usuario
let userDemoOrders: OrderEntity[] = [];
let nextOrderId = 2000;

/**
 * Obtiene todos los pedidos en demo mode (solo creados por usuario)
 */
export const getDemoOrders = (): OrderEntity[] => {
    return [...userDemoOrders];
};

/**
 * Crea un nuevo pedido demo desde el carrito
 */
export const createDemoOrder = (
    items: CartItem[],
    addressTitle: string,
    addressStreet: string
): OrderEntity => {
    const orderId = nextOrderId++;
    const timestamp = new Date().toISOString();

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const costDelivery = 500;
    const costFee = Math.round(total * 0.05); // 5% fee

    const orderData: Order = {
        id: orderId,
        type: 'OrdersResponse',
        total,
        idCustomer: 1,
        deliveryName: 'Usuario Demo',
        update: false,
        qr: `DORES-${orderId}`,
        delivery: true,
        deliveryTime: '25-35 min',
        modified: false,
        costDelivery,
        costFee,
        deliveryAddress: {
            id: 1,
            title: addressTitle,
            streets: addressStreet,
            latitude: '-34.5875',
            longitude: '-58.4123',
        },
        orderStatus: 'EN_PREPARACION',
        orderPayment: [{
            id: orderId,
            price: total + costDelivery + costFee,
            priceFee: costFee,
            priceDelivery: costDelivery,
            priceTransaction: null,
            importeRefoundCharges: null,
            details: items.map(i => `${i.quantity}x ${i.name}`).join(', '),
            id_sp: null,
            id_reference: `REF-${orderId}`,
            paymentMethod: 'EFECTIVO',
            idUser: 1,
            idCommerce: items[0]?.commerceId || 1,
            paymentLink: null,
            paymentLinkSandbox: null,
            paymentType: 'BUY_MENU',
            paymentStatus: 'APPROVED',
            expirationDate: null,
            dateApproved: timestamp,
            dateCreated: timestamp,
            moneyReleaseDate: null,
            created_at: timestamp,
            updated_at: timestamp,
        }],
        detailsOrder: items.map((item, index) => ({
            id: orderId * 100 + index,
            idMenu: item.id,
            idCommerce: item.commerceId,
            quantity: item.quantity,
            observaciones: item.observations ? [item.observations] : [],
        })),
    };

    const newOrder = new OrderEntity(orderData);
    userDemoOrders = [newOrder, ...userDemoOrders];

    console.log('🎭 DEMO: Pedido creado', orderId);
    return newOrder;
};

/**
 * Obtiene un pedido por ID (demo mode)
 */
export const getDemoOrderById = (orderId: number): OrderEntity | null => {
    const allOrders = getDemoOrders();
    return allOrders.find(o => o.id === orderId) || null;
};

/**
 * Limpia los pedidos demo creados por el usuario
 */
export const clearUserDemoOrders = () => {
    userDemoOrders = [];
    nextOrderId = 2000;
};

/**
 * Simula la creación de un pedido inicial (cuando se agrega al carrito)
 */
export const createDemoCartOrder = (items: CartItem[]): number => {
    const orderId = nextOrderId++;
    console.log('🎭 DEMO: Orden de carrito creada', orderId);
    return orderId;
};
