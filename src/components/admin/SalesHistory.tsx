import { Session } from "@/types/pos";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SalesHistoryProps {
  session: Session;
}

export function SalesHistory({ session }: SalesHistoryProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Date & Time</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment Method</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {session.sales?.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell>{sale.id}</TableCell>
              <TableCell>
                {new Date(sale.timestamp).toLocaleString()}
              </TableCell>
              <TableCell>{sale.products.length} items</TableCell>
              <TableCell>${sale.total.toFixed(2)}</TableCell>
              <TableCell>{sale.paymentMethod}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}