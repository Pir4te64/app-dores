import { User } from '~/domain/entities/userEntity';

export interface IUserRepository {
  login(loginData: LoginData): Promise<string | { accessToken: string; refreshToken: string }>;
  register(registerData: RegisterData): Promise<string>;
  getCurrentUser(): Promise<User>;
  updateUser(updateDate: UpdateData): Promise<any>;
  removeUserData(): Promise<void>;
  refreshToken(): Promise<{ accessToken: string; refreshToken: string }>;
  getAvatars(): Promise<any>;
  updateAvatar(avatarId: number): Promise<any>;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  code: string;
  termsAndConditions: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}
export interface ResetPasswordData {
  email: string;
  newPassword: string;
  code: string;
}
export interface UpdateData {
  firstName: string;
  numberPhone: string;
  lastName: string;
}
export interface AvatarData {
  id: number;
  name: string;
  url: string;
  type: string;
  softDelete: boolean;
  created_at: string;
  updated_at: string;
}
