import { Banner } from '~/domain/entities/bannerEntity';
import { supabase } from '~/infrastructure/supabase/client';
import { mapPromotion } from '~/domain/mappers/supabaseMappers';
import { CommerceSupabaseService } from '~/domain/services/supabase/commerceService';

export class BannerService {
  private static instance: BannerService;

  static getInstance(): BannerService {
    if (!BannerService.instance) {
      BannerService.instance = new BannerService();
    }
    return BannerService.instance;
  }

  async getBanners(): Promise<Banner[]> {
    const commerceService = CommerceSupabaseService.getInstance();
    const commerceId = await commerceService.getCommerceId();

    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const today = days[new Date().getDay()];

    const { data, error } = await supabase
      .from('daily_promotions')
      .select('*, products:daily_promotion_products(*, product:products(*, images:product_images(*)))')
      .eq('commerce_id', commerceId)
      .eq('is_active', true)
      .eq('day_of_week', today);

    if (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }

    if (!data || data.length === 0) {
      // If no promotions for today, get all active promotions
      const { data: allPromos } = await supabase
        .from('daily_promotions')
        .select('*')
        .eq('commerce_id', commerceId)
        .eq('is_active', true)
        .limit(5);

      return (allPromos || []).map(mapPromotion);
    }

    return data.map(mapPromotion);
  }
}
