import { Category } from '~/domain/entities/categoryEntity';
import { Menu, MenuImage } from '~/domain/entities/menuEntity';
import { Commerce } from '~/domain/entities/commerceEntity';
import { Banner } from '~/domain/entities/bannerEntity';
import { OrderEntity, Order, OrderStatus } from '~/domain/entities/orderEntity';
import { getImageUrl } from '~/infrastructure/supabase/imageHelper';
import {
  DbProduct,
  DbCategory,
  DbCommerceProfile,
  DbOrder,
  DbDailyPromotion,
} from '~/domain/entities/supabaseTypes';

export function mapCategory(db: DbCategory): Category {
  return new Category({
    id: Number(db.id) || 0,
    name: db.name,
    description: db.description || '',
    icon: db.icon || undefined,
  } as Category);
}

export function mapProduct(db: DbProduct): Menu {
  const images: MenuImage[] = (db.images || []).map((img) => ({
    id: Number(img.id) || 0,
    name: img.name || '',
    type: img.type || 'image/jpeg',
    url: getImageUrl(img.url),
  }));

  return new Menu({
    id: Number(db.id) || 0,
    commerceId: Number(db.commerce_id) || 0,
    name: db.name,
    description: db.description || '',
    price: db.price,
    stock: db.stock,
    image: images,
    category: {
      id: db.category ? Number(db.category.id) || 0 : 0,
      name: db.category?.name || '',
      urlImage: db.category?.icon ? getImageUrl(db.category.icon) : null,
    },
    dietaryRestrictions: [],
  });
}

export function mapCommerce(db: DbCommerceProfile): Commerce {
  const addr = db.address?.[0];
  const hours = db.hours?.[0];

  return new Commerce({
    id: Number(db.id) || 0,
    businessName: db.business_name,
    description: db.fantasy_name || db.trade_name || db.business_name,
    cost: 0,
    coverImage: getImageUrl(db.cover_image),
    address: {
      street: addr?.street || '',
      city: addr?.city || '',
      state: addr?.state || '',
      country: addr?.country || '',
      postalCode: addr?.postal_code,
      latitude: addr?.latitude,
      longitude: addr?.longitude,
    },
    distance: 0,
    active: db.active,
    email: db.email,
    rangeHours: hours
      ? {
          id: Number(hours.id) || 0,
          dayOfWeek: hours.day_of_week,
          openingTime: hours.opening_time
            ? hours.opening_time.split(':').map(Number)
            : [0, 0],
          closingTime: hours.closing_time
            ? hours.closing_time.split(':').map(Number)
            : [0, 0],
        }
      : { id: 0, dayOfWeek: 'MONDAY', openingTime: [0, 0], closingTime: [0, 0] },
    idUser: Number(db.user_id) || 0,
    kyb: true,
    percentageCompleted: db.percentage_completed,
    phoneNumber: db.phone_number || '',
    profileImage: getImageUrl(db.profile_image),
    taxId: db.tax_id || '',
    validation: true,
  } as unknown as Commerce);
}

// Map Supabase order status to app's OrderStatus
function mapOrderStatus(status: string): OrderStatus {
  const statusMap: Record<string, OrderStatus> = {
    PEDIDO_EN_PROCESO: 'PEDIDO_EN_PROCESO',
    PEDIDO_EN_PREPARACION: 'EN_PREPARACION',
    PEDIDO_ENVIADO: 'EN_PROCESO',
    PEDIDO_ENTREGADO: 'PEDIDO_ENTREGADO',
    CANCELED: 'CANCELADO',
  };
  return statusMap[status] || 'PEDIDO_EN_PROCESO';
}

export function mapOrder(db: DbOrder): OrderEntity {
  const orderData: Order = {
    id: Number(db.id) || 0,
    type: 'OrdersResponse',
    total: db.total,
    idCustomer: 0,
    deliveryName: db.delivery_name || '',
    update: false,
    qr: '',
    delivery: db.order_type === 'DELIVERY',
    deliveryTime: db.delivery_zone?.estimated_time || '',
    modified: false,
    costDelivery: db.cost_delivery,
    costFee: db.cost_fee,
    deliveryAddress: {
      id: 0,
      title: db.delivery_zone?.zone_name || 'Dirección de entrega',
      streets: db.delivery_address || '',
      latitude: db.delivery_latitude || '',
      longitude: db.delivery_longitude || '',
    },
    orderStatus: mapOrderStatus(db.order_status),
    orderPayment: db.payment_method
      ? [
          {
            id: 0,
            price: db.total,
            priceFee: db.cost_fee,
            priceDelivery: db.cost_delivery,
            priceTransaction: null,
            importeRefoundCharges: null,
            details: db.payment_reference || '',
            id_sp: null,
            id_reference: db.payment_reference,
            paymentMethod: db.payment_method,
            idUser: 0,
            idCommerce: 0,
            paymentLink: null,
            paymentLinkSandbox: null,
            paymentType: 'BUY_MENU',
            paymentStatus: db.payment_status === 'VERIFIED' ? 'APPROVED' : 'EN_PROCESO',
            expirationDate: null,
            dateApproved: db.payment_verified_at,
            dateCreated: db.created_at,
            moneyReleaseDate: null,
            created_at: db.created_at,
            updated_at: db.updated_at,
          },
        ]
      : [],
    detailsOrder: (db.items || []).map((item) => ({
      id: Number(item.id) || 0,
      idMenu: Number(item.product_id) || 0,
      idCommerce: Number(db.commerce_id) || 0,
      quantity: item.quantity,
      observaciones: item.observations || [],
    })),
  };

  return new OrderEntity(orderData);
}

export function mapPromotion(db: DbDailyPromotion, index: number): Banner {
  const now = new Date();
  const startDate: [number, number, number] = [now.getFullYear(), now.getMonth() + 1, now.getDate()];
  const endDate: [number, number, number] = [now.getFullYear(), 12, 31];

  return new Banner(
    Number(db.id) || index,
    db.title,
    db.description || '',
    db.image_url ? getImageUrl(db.image_url) : '',
    '',
    startDate,
    endDate,
    db.is_active,
    index,
    false,
    db.created_at,
    db.created_at
  );
}
