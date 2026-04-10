import { supabase } from '~/infrastructure/supabase/client';
import {
  DbPaymentMethod,
  DbDeliveryZone,
  DbExchangeRate,
  DbDrinkAddon,
} from '~/domain/entities/supabaseTypes';

export class CheckoutDataService {
  private static instance: CheckoutDataService;

  static getInstance(): CheckoutDataService {
    if (!CheckoutDataService.instance) {
      CheckoutDataService.instance = new CheckoutDataService();
    }
    return CheckoutDataService.instance;
  }

  async getPaymentMethods(commerceId: string): Promise<DbPaymentMethod[]> {
    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('commerce_id', commerceId)
      .eq('is_active', true)
      .order('created_at');

    if (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
    return data || [];
  }

  async getExchangeRate(commerceId: string): Promise<DbExchangeRate | null> {
    const { data, error } = await supabase
      .from('exchange_rates')
      .select('*')
      .eq('commerce_id', commerceId)
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching exchange rate:', error);
      return null;
    }
    return data;
  }

  async getDeliveryZones(commerceId: string): Promise<DbDeliveryZone[]> {
    const { data, error } = await supabase
      .from('delivery_zones')
      .select('*')
      .eq('commerce_id', commerceId)
      .eq('is_active', true)
      .order('zone_name');

    if (error) {
      console.error('Error fetching delivery zones:', error);
      return [];
    }
    return data || [];
  }

  async getDrinkAddons(commerceId: string): Promise<DbDrinkAddon[]> {
    const { data, error } = await supabase
      .from('drink_addons')
      .select('*')
      .eq('commerce_id', commerceId)
      .eq('is_available', true)
      .order('name');

    if (error) {
      console.error('Error fetching drink addons:', error);
      return [];
    }
    return data || [];
  }

  async getLiveExchangeRate(): Promise<number | null> {
    try {
      const res = await fetch('https://ve.dolarapi.com/v1/dolares');
      const rates = await res.json();
      const oficial = rates.find((r: any) => r.fuente === 'oficial');
      return oficial?.promedio || null;
    } catch {
      return null;
    }
  }
}
