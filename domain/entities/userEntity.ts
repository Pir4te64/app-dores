import { Address } from './addressEntity';

export class User {
  id: number;
  idUser: number;
  email: string;
  dni: string | null;
  role: string[];
  firstName: string;
  lastName: string;
  numberPhone: string | null;
  positiveBalance: number;
  imageProfile: string | null;
  percentageCompleted: number;
  kyc: boolean;
  address: Address;

  constructor(user: User) {
    this.id = user.id;
    this.idUser = user.idUser;
    this.email = user.email;
    this.dni = user.dni;
    this.role = user.role;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.numberPhone = user.numberPhone;
    this.positiveBalance = user.positiveBalance;
    this.imageProfile = user.imageProfile;
    this.percentageCompleted = user.percentageCompleted;
    this.kyc = user.kyc;
    this.address = user.address;
  }
}
