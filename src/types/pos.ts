export type PaymentMethod = "cash" | "bayarlah_qr";

export type UserRole = "admin" | "cashier";

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

export type Session = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  staff: SessionStaff[];
  products: SessionProduct[];
  status: "active" | "completed";
};

export type SessionLog = {
  id: string;
  sessionId: string;
  userId: string;
  action: string;
  timestamp: string;
};

export type Sale = {
  id: string;
  sessionId: string;
  staffId: string;
  products: {
    productId: number;
    quantity: number;
    price: number;
    discount: number;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
};

export type AuthUser = {
  id: string;
  username: string;
  password: string;
  role: UserRole;
};