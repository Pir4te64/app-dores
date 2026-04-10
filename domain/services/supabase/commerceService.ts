import { supabase } from '~/infrastructure/supabase/client';
import { DbCommerceProfile, DbBusinessHour } from '~/domain/entities/supabaseTypes';

let cachedCommerceId: string | null = null;

export class CommerceSupabaseService {
  private static instance: CommerceSupabaseService;

  static getInstance(): CommerceSupabaseService {
    if (!CommerceSupabaseService.instance) {
      CommerceSupabaseService.instance = new CommerceSupabaseService();
    }
    return CommerceSupabaseService.instance;
  }

  async getActiveCommerce(): Promise<DbCommerceProfile | null> {
    const { data, error } = await supabase
      .from('commerce_profiles')
      .select('*, address:commerce_addresses(*), hours:business_hours(*)')
      .eq('active', true)
      .limit(1)
      .single();

    if (error || !data) {
      console.error('Error fetching commerce:', error);
      return null;
    }

    cachedCommerceId = data.id;
    return data as DbCommerceProfile;
  }

  async getCommerceId(): Promise<string> {
    if (cachedCommerceId) return cachedCommerceId;

    const commerce = await this.getActiveCommerce();
    if (!commerce) throw new Error('No se encontró un comercio activo');
    return commerce.id;
  }

  isCommerceOpen(hours: DbBusinessHour[]): boolean {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const now = new Date();
    const today = days[now.getDay()];
    const todayHours = hours.find((h) => h.day_of_week === today);

    if (!todayHours || !todayHours.is_open) return false;

    const currentTime = now.toTimeString().slice(0, 5);
    return (
      currentTime >= (todayHours.opening_time || '00:00') &&
      currentTime <= (todayHours.closing_time || '23:59')
    );
  }
}
