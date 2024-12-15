export type PaymentMethod = "cash" | "bayarlah_qr";

export type UserRole = "admin" | "cashier" | "both";

export type SessionStaff = {
  id: string;
  name: string;
  role: UserRole;
  password: string;
};

export type SessionProduct = {
  id: number;
  name: string;
  price: number;
  initialStock: number;
  currentStock: number;
  category: string;
  image?: string;
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

export type Session = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  staff: SessionStaff[];
  products: SessionProduct[];
  status: "active" | "completed";
  sales: Sale[];
};

export type AuthUser = {
  id: string;
  username: string;
  password: string;
  role: UserRole;
};