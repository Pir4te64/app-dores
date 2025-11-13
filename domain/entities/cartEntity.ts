import { Menu } from './menuEntity';

export interface CartItem extends Menu {
  quantity: number;
  observations?: string;
  commerceId: number;
}
