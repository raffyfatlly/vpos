export type PaymentMethod = "cash" | "bayarlah_qr";

export type UserRole = "admin" | "cashier";

export type SessionStaff = {
  id: string;
  name: string;
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
  location: string;
  staff: SessionStaff[];
  products: SessionProduct[];
  status: "active" | "completed";
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