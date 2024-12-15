export type PaymentMethod = "cash" | "bayarlah_qr";

export type UserRole = "admin" | "cashier" | "both";

export type ProductVariation = {
  id: number;
  name: string;
  price: number;
};

export type SessionProduct = {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
  variations?: ProductVariation[];
};

export type Sale = {
  id: string;
  products: {
    productId: number;
    quantity: number;
    price: number;
    discount: number;
  }[];
  total: number;
  timestamp: string;
  paymentMethod: PaymentMethod;
};

export type SessionStaff = {
  id: string;
  name: string;
  role: UserRole;
  password: string;
};

export type Session = {
  id: string;
  name: string;
  date: string;
  location: string;
  staff: SessionStaff[];
  products: (SessionProduct & {
    initialStock: number;
    currentStock: number;
  })[];
  status: "active" | "completed";
  sales: Sale[];
  created_at: string;
};

export type AuthUser = {
  id: string;
  username: string;
  password: string;
  role: UserRole;
};