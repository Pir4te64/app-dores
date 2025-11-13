import { UserRepository } from '~/data/repository/userRepository';
import { LoginData, RegisterData, ResetPasswordData } from '~/domain/repositories/iuserRepository';
import { tryCatch } from '~/infrastructure/config/tryCatch';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';

export class AuthService {
  private userRepository: UserRepository;
  private static authService: AuthService;

  constructor() {
    this.userRepository = UserRepository.getInstance();
  }

  static getInstance(): AuthService {
    if (!AuthService.authService) {
      AuthService.authService = new AuthService();
    }
    return AuthService.authService;
  }

  async login(loginData: LoginData): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await this.userRepository.login(loginData);

      if (typeof response === 'object' && 'accessToken' in response) {
        await AsyncStorageService.setItem('accessToken', response.accessToken);
        if (response.refreshToken) {
          await AsyncStorageService.setItem('refreshToken', response.refreshToken);
        }
      } else if (typeof response === 'string') {
        await AsyncStorageService.setItem('accessToken', response);
      }

      return response;
    } catch (error) {
      await AsyncStorageService.multiRemove(['accessToken', 'refreshToken']);
      throw error;
    }
  }

  async validateEmail(email: string, password: string): Promise<string> {
    return await this.userRepository.validateEmail(email, password);
  }

  async register(
    registerData: RegisterData
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const response = await this.userRepository.register(registerData);

      if (typeof response === 'object' && 'accessToken' in response) {
        await AsyncStorageService.setItem('accessToken', response.accessToken);
        if (response.refreshToken) {
          await AsyncStorageService.setItem('refreshToken', response.refreshToken);
        }
      } else if (typeof response === 'string') {
        await AsyncStorageService.setItem('accessToken', response);
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }
  async resetPassword(email: string): Promise<any> {
    return await this.userRepository.resetPassword(email);
  }

  async verifyResetCode(resetPasswordData: ResetPasswordData) {
    return await this.userRepository.verifyResetCode(resetPasswordData);
  }

  async logout(): Promise<void> {
    return await this.userRepository.removeUserData();
  }

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const { data: refreshToken, error } = await tryCatch(
        AsyncStorageService.getItem('refreshToken')
      );

      if (error || !refreshToken) {
        console.error('No refresh token available:', error);
        throw new Error('No refresh token available');
      }

      const response = await this.userRepository.refreshToken();

      await AsyncStorageService.setItem('accessToken', response.accessToken);
      await AsyncStorageService.setItem('refreshToken', response.refreshToken);

      return response;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }
}
