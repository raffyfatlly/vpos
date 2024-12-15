import { SessionProduct, PaymentMethod, ProductVariation } from "@/types/pos";

export interface CartItem extends SessionProduct {
  quantity: number;
  discount: number;
  selectedVariation?: ProductVariation;
}

export interface SaleData {
  products: {
    productId: number;
    quantity: number;
    price: number;
    discount: number;
    variationId?: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
  id: string;
}