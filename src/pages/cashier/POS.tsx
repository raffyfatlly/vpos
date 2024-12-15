import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  CreditCard,
  Receipt,
  Search,
  Plus,
  Minus,
  X,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

const SAMPLE_PRODUCTS: Product[] = [
  { id: 1, name: "Espresso", price: 3.99, category: "Hot Drinks" },
  { id: 2, name: "Cappuccino", price: 4.99, category: "Hot Drinks" },
  { id: 3, name: "Latte", price: 4.99, category: "Hot Drinks" },
  { id: 4, name: "Croissant", price: 3.49, category: "Pastries" },
  { id: 5, name: "Chocolate Muffin", price: 2.99, category: "Pastries" },
  { id: 6, name: "Iced Coffee", price: 4.49, category: "Cold Drinks" },
  { id: 7, name: "Smoothie", price: 5.99, category: "Cold Drinks" },
  { id: 8, name: "Sandwich", price: 6.99, category: "Food" },
];

const CATEGORIES = ["All", ...new Set(SAMPLE_PRODUCTS.map(p => p.category))];

const POS = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [paymentAmount, setPaymentAmount] = useState("");
  const { toast } = useToast();

  const filteredProducts = SAMPLE_PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + delta) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  };

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getTax = () => getSubtotal() * 0.08; // 8% tax
  const getTotal = () => getSubtotal() + getTax();

  const handleCheckout = () => {
    const total = getTotal();
    const payment = parseFloat(paymentAmount);
    
    if (!payment || payment < total) {
      toast({
        title: "Invalid payment amount",
        description: "Please enter a valid payment amount that covers the total.",
        variant: "destructive",
      });
      return;
    }

    const change = payment - total;
    toast({
      title: "Order completed",
      description: `Change due: $${change.toFixed(2)}`,
    });
    
    setCart([]);
    setPaymentAmount("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-6rem)]">
      {/* Products Section */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-20rem)]">
          {filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="p-4 border rounded-lg hover:bg-accent transition-colors text-left space-y-2"
            >
              <div className="aspect-square bg-gray-100 rounded-md mb-2" />
              <h3 className="font-medium truncate">{product.name}</h3>
              <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="border rounded-lg p-4 space-y-4 h-full flex flex-col">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Current Order</h2>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>${(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border-t pt-4 space-y-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>${getTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="number"
              placeholder="Payment amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={() => setCart([])}>
              <Receipt className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={handleCheckout} disabled={cart.length === 0}>
              <CreditCard className="mr-2 h-4 w-4" />
              Pay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;