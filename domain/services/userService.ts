import { UserRepository } from '~/data/repository/userRepository';
import { User } from '~/domain/entities/userEntity';
import { AvatarData, IUserRepository, UpdateData } from '~/domain/repositories/iuserRepository';

export class UserService {
  private static instance: UserService;
  private readonly userRepository: IUserRepository;

  constructor() {
    this.userRepository = UserRepository.getInstance();
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }
  async updateUser(updateData: UpdateData): Promise<any> {
    return await this.userRepository.updateUser(updateData);
  }
  async getAvatars(): Promise<AvatarData[]> {
    return await this.userRepository.getAvatars();
  }
  async updateAvatar(avatarId: number): Promise<any> {
    return await this.userRepository.updateAvatar(avatarId);
  }
  async getCurrentUser(): Promise<User> {
    return await this.userRepository.getCurrentUser();
  }
}
