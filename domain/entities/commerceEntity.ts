interface Address {
  id?: number;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: string;
  longitude?: string;
}

interface BusinessHours {
  id: number;
  dayOfWeek: string;
  openingTime: number[];
  closingTime: number[];
}

export class Commerce {
  id: number;
  businessName: string;
  description: string;
  cost: number;
  coverImage: string;
  address: Address;
  distance: number;
  active: boolean;
  email?: string | null;
  rangeHours: BusinessHours;
  idUser: number;
  kyb: boolean;
  percentageCompleted: number;
  phoneNumber: string;
  profileImage?: string | null;
  taxId: string;
  validation: boolean;

  constructor(data: Commerce) {
    this.id = data.id ?? 0;
    this.businessName = data.businessName ?? '';
    this.description = data.description ?? '';
    this.cost = data.cost;
    this.coverImage = data.coverImage ?? '';
    this.address = {
      id: data.address?.id,
      street: data.address?.street ?? '',
      city: data.address?.city ?? '',
      state: data.address?.state ?? '',
      country: data.address?.country ?? '',
      postalCode: data.address?.postalCode,
      latitude: data.address?.latitude,
      longitude: data.address?.longitude,
    };
    this.distance = data.distance ?? 0;
    this.active = data.active ?? false;
    this.email = data.email;
    this.rangeHours = data.rangeHours;
    this.idUser = data.idUser ?? 0;
    this.kyb = data.kyb ?? false;
    this.percentageCompleted = data.percentageCompleted ?? 0;
    this.phoneNumber = data.phoneNumber ?? '';
    this.profileImage = data.profileImage;
    this.taxId = data.taxId ?? '';
    this.validation = data.validation ?? false;
  }
}
