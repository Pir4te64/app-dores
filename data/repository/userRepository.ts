import { User } from '~/domain/entities/userEntity';
import {
  AvatarData,
  IUserRepository,
  LoginData,
  RegisterData,
  ResetPasswordData,
  UpdateData,
} from '~/domain/repositories/iuserRepository';
import { ApiClient } from '~/domain/sources/remote/apiClient';
import { tryCatch } from '~/infrastructure/config/tryCatch';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';

export class UserRepository implements IUserRepository {
  private apiClient: ApiClient = ApiClient.getInstance();
  private static instance: UserRepository;

  static getInstance(): UserRepository {
    if (!UserRepository.instance) {
      UserRepository.instance = new UserRepository();
    }
    return UserRepository.instance;
  }

  async login(loginData: LoginData): Promise<{ accessToken: string; refreshToken: string }> {
    const { data, error } = await tryCatch(
      this.apiClient.post<any>('/auth/public/v1/login', {
        email: loginData.email,
        password: loginData.password,
      })
    );

    if (error) throw error;
    return data;
  }

  async validateEmail(email: string, password: string): Promise<any> {
    const { data, error } = await tryCatch(
      this.apiClient.post('/auth/public/v1/validate-email', {
        email,
        password,
      })
    );
    if (error) {
      throw error;
    }
    return data;
  }
  async register(userData: RegisterData): Promise<any> {
    const { data, error } = await tryCatch(
      this.apiClient.post('/auth/public/v1/register-customer', userData)
    );
    if (error) {
      throw error;
    }
    return data;
  }
  async getCurrentUser(): Promise<User> {
    return await this.apiClient.getWithAuth<User>('/auth/user/v1/get-me');
  }
  async updateUser(updateData: UpdateData): Promise<any> {
    return await this.apiClient.putWithAuth<User>(
      '/usuarios/user/v1/update-profile-customer',
      updateData
    );
  }
  async resetPassword(email: string): Promise<any> {
    return await this.apiClient.post(`/auth/public/v1/request-retrieve?email=${email}`);
  }
  async verifyResetCode(resetPasswordData: ResetPasswordData) {
    return await this.apiClient.put('/auth/public/v1/recover-password', resetPasswordData);
  }
  async getAvatars(): Promise<AvatarData[]> {
    const { data, error } = await tryCatch(
      this.apiClient.getWithAuth<AvatarData[]>('/usuarios/user/v1/avatars')
    );
    if (error) throw error;
    return data;
  }
  async updateAvatar(avatarId: number): Promise<any> {
    const { data, error } = await tryCatch(
      this.apiClient.putWithAuth(
        `/usuarios/user/v1/update-image-profile-customer?id-avatar=${avatarId}`
      )
    );
    if (error) throw error;
    return data;
  }
  async removeUserData(): Promise<void> {
    await AsyncStorageService.multiRemove(['accessToken', 'refreshToken', 'user']);
  }
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const { data: storedRefreshToken } = await tryCatch(
      AsyncStorageService.getItem('refreshToken')
    );

    if (!storedRefreshToken) {
      throw new Error('No refresh token available');
    }

    return await this.apiClient.post('/auth/public/v1/refresh-token', {
      refreshToken: storedRefreshToken,
    });
  }
}
