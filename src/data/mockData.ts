import { Session, SessionProduct } from "@/types/pos";

export const MOCK_PRODUCTS: SessionProduct[] = [
  {
    id: 1,
    name: "T-Shirt Classic",
    price: 29.99,
    category: "Apparel",
    image: "/placeholder.svg",
    initial_stock: 0,
    current_stock: 0,
    session_id: "1" // Add session_id
  },
  {
    id: 2,
    name: "Hoodie Premium",
    price: 59.99,
    category: "Apparel",
    image: "/placeholder.svg",
    initial_stock: 0,
    current_stock: 0,
    session_id: "1" // Add session_id
  },
  {
    id: 3,
    name: "Cap Original",
    price: 24.99,
    category: "Accessories",
    image: "/placeholder.svg",
    initial_stock: 0,
    current_stock: 0,
    session_id: "1" // Add session_id
  },
  {
    id: 4,
    name: "Sticker Pack",
    price: 9.99,
    category: "Merchandise",
    image: "/placeholder.svg",
    initial_stock: 0,
    current_stock: 0,
    session_id: "1" // Add session_id
  }
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    name: "Weekend Market Popup",
    date: "2024-03-16",
    location: "Central Park",
    staff: [
      { id: "staff1", name: "John Doe", role: "admin" },
      { id: "staff2", name: "Jane Smith", role: "cashier" },
    ],
    products: MOCK_PRODUCTS.map(product => ({
      ...product,
      initial_stock: 50,
      current_stock: 45
    })),
    status: "active",
    created_at: new Date().toISOString(),
    sales: [
      {
        id: "sale1",
        products: [
          { productId: 1, quantity: 2, price: 29.99, discount: 0 },
          { productId: 3, quantity: 1, price: 24.99, discount: 5 }
        ],
        total: 79.97,
        timestamp: "2024-03-16T10:30:00",
        paymentMethod: "cash"
      }
    ]
  },
  {
    id: "2",
    name: "Fashion District Event",
    date: "2024-03-17",
    location: "Fashion Mall",
    staff: [
      { id: "staff1", name: "John Doe", role: "admin" },
      { id: "staff3", name: "Mike Johnson", role: "cashier" },
    ],
    products: MOCK_PRODUCTS.map(product => ({
      ...product,
      initial_stock: 50,
      current_stock: 50
    })),
    status: "active",
    created_at: new Date().toISOString(),
    sales: []
  }
];