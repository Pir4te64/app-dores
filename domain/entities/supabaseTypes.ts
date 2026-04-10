// Tipos que mapean 1:1 a las tablas de Supabase (snake_case)

export interface DbCommerceProfile {
  id: string;
  user_id: string;
  business_name: string;
  trade_name: string | null;
  fantasy_name: string | null;
  email: string | null;
  phone_number: string | null;
  tax_id: string | null;
  profile_image: string | null;
  cover_image: string | null;
  active: boolean;
  percentage_completed: number;
  created_at: string;
  updated_at: string;
  address?: DbCommerceAddress[];
  hours?: DbBusinessHour[];
}

export interface DbCommerceAddress {
  id: string;
  commerce_id: string;
  street: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  latitude: string | null;
  longitude: string | null;
}

export interface DbBusinessHour {
  id: string;
  commerce_id: string;
  day_of_week: string;
  opening_time: string | null;
  closing_time: string | null;
  is_open: boolean;
}

export interface DbCategory {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export interface DbProduct {
  id: string;
  commerce_id: string;
  name: string;
  description: string | null;
  price: number;
  stock: boolean;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  category?: DbCategory;
  images?: DbProductImage[];
}

export interface DbProductImage {
  id: string;
  product_id: string;
  name: string | null;
  type: string | null;
  url: string;
  storage_path: string | null;
  sort_order: number;
  created_at: string;
}

export interface DbOrder {
  id: string;
  commerce_id: string;
  order_type: string;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_phone: string | null;
  order_status: string;
  total: number;
  cost_delivery: number;
  cost_fee: number;
  payment_method: string | null;
  payment_reference: string | null;
  payment_status: string;
  payment_verified_at: string | null;
  payment_verified_by: string | null;
  delivery_zone_id: string | null;
  delivery_address: string | null;
  delivery_latitude: string | null;
  delivery_longitude: string | null;
  delivery_name: string | null;
  delivery_id: string | null;
  exchange_rate: number | null;
  total_bs: number | null;
  created_at: string;
  updated_at: string;
  items?: DbOrderItem[];
  delivery_zone?: DbDeliveryZone;
}

export interface DbOrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  quantity: number;
  unit_price: number;
  subtotal: number;
  observations: string[] | null;
  drink_addon_id: string | null;
  drink_addon_price: number | null;
  created_at: string;
  product?: DbProduct;
  drink_addon?: DbDrinkAddon;
}

export interface DbPaymentMethod {
  id: string;
  commerce_id: string;
  name: string;
  label: string;
  details: Record<string, string> | null;
  is_active: boolean;
  created_at: string;
}

export interface DbDeliveryZone {
  id: string;
  commerce_id: string;
  zone_name: string;
  delivery_fee: number;
  delivery_fee_currency: string;
  estimated_time: string | null;
  is_active: boolean;
  created_at: string;
}

export interface DbExchangeRate {
  id: string;
  commerce_id: string;
  rate: number;
  currency_from: string;
  currency_to: string;
  is_active: boolean;
  updated_at: string;
  updated_by: string | null;
}

export interface DbDrinkAddon {
  id: string;
  commerce_id: string;
  name: string;
  price: number;
  is_available: boolean;
  only_in_store: boolean;
  created_at: string;
}

export interface DbDailyPromotion {
  id: string;
  commerce_id: string;
  day_of_week: string;
  title: string;
  description: string | null;
  discount_percentage: number | null;
  discount_amount: number | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  products?: DbDailyPromotionProduct[];
}

export interface DbDailyPromotionProduct {
  id: string;
  promotion_id: string;
  product_id: string;
  promotional_price: number | null;
  product?: DbProduct;
}
