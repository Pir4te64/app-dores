import { Banner } from '~/domain/entities/bannerEntity';
import { ApiClient } from '~/domain/sources/remote/apiClient';

export class BannerService {
  private readonly apiClient: ApiClient = ApiClient.getInstance();
  private static instance: BannerService;

  static getInstance(): BannerService {
    if (!BannerService.instance) {
      BannerService.instance = new BannerService();
    }
    return BannerService.instance;
  }

  async getBanners(): Promise<Banner[]> {
    const response = await this.apiClient.getWithAuth<Banner[]>(
      '/menus/user/v1/get-all-banners?active=true'
    );
    return response;
  }
}
