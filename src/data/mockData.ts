import { Session, SessionProduct } from "@/types/pos";

export const MOCK_PRODUCTS: SessionProduct[] = [
  {
    id: 1,
    name: "T-Shirt Classic",
    price: 29.99,
    initialStock: 50,
    currentStock: 45,
    category: "Apparel",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Hoodie Premium",
    price: 59.99,
    initialStock: 30,
    currentStock: 28,
    category: "Apparel",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Cap Original",
    price: 24.99,
    initialStock: 40,
    currentStock: 35,
    category: "Accessories",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Sticker Pack",
    price: 9.99,
    initialStock: 100,
    currentStock: 85,
    category: "Merchandise",
    image: "/placeholder.svg"
  }
];

export const MOCK_SESSIONS: Session[] = [
  {
    id: "1",
    name: "Weekend Market Popup",
    date: "2024-03-16",
    location: "Central Park",
    staff: [
      { id: "staff1", name: "John Doe" },
      { id: "staff2", name: "Jane Smith" },
    ],
    products: MOCK_PRODUCTS,
    status: "active",
  },
  {
    id: "2",
    name: "Fashion District Event",
    date: "2024-03-17",
    location: "Fashion Mall",
    staff: [
      { id: "staff1", name: "John Doe" },
      { id: "staff3", name: "Mike Johnson" },
    ],
    products: MOCK_PRODUCTS,
    status: "active",
  }
];