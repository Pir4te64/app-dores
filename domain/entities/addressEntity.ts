export class Address {
  id: number;
  title: string;
  streets: string;
  latitude: string;
  longitude: string;
  floor?: string;
  reference?: string;
  isDefault: boolean;

  constructor(address: Address) {
    this.id = address.id;
    this.title = address.title;
    this.streets = address.streets;
    this.latitude = address.latitude;
    this.longitude = address.longitude;
    this.isDefault = address.isDefault;
    this.floor = address.floor;
    this.reference = address.reference;
  }
}
